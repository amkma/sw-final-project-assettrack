import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAssetById, createAsset, updateAsset } from '../../api/assetApi'
import { getUsers } from '../../api/userApi'
import AssetForm from '../../components/forms/AssetForm'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './AssetFormPage.css'

export default function AssetFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    sn: '',
    type: '',
    brand: '',
    model: '',
    purchaseDate: '',
    warrantyEndDate: '',
    userId: '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEditing)
  const [users, setUsers] = useState([])

  // Fetch users for the dropdown + existing asset data if editing
  useEffect(() => {
    async function fetchData() {
      // Fetch users list (for assignment dropdown)
      try {
        const usersRes = await getUsers()
        setUsers(usersRes.data || [])
      } catch {
        setUsers([])
      }

      // If editing, pre-fill the form
      if (isEditing) {
        try {
          const res = await getAssetById(id)
          const asset = res.data
          setFormData({
            sn: asset.sn || '',
            type: asset.type || '',
            brand: asset.brand || '',
            model: asset.model || '',
            purchaseDate: asset.purchaseDate || '',
            warrantyEndDate: asset.warrantyEndDate || '',
            userId: '', // Backend doesn't return assigned userId in AssetResponse
          })
        } catch {
          setApiError('Failed to load asset data.')
        } finally {
          setPageLoading(false)
        }
      }
    }
    fetchData()
  }, [id, isEditing])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (apiError) setApiError('')
  }

  function validate() {
    const newErrors = {}

    if (!formData.sn.trim()) {
      newErrors.sn = 'Serial number is required'
    }
    if (!formData.type) {
      newErrors.type = 'Asset type is required'
    }
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required'
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required'
    }

    // Warranty date should be after purchase date
    if (formData.purchaseDate && formData.warrantyEndDate) {
      if (new Date(formData.warrantyEndDate) <= new Date(formData.purchaseDate)) {
        newErrors.warrantyEndDate = 'Warranty end must be after purchase date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setApiError('')

    // Build payload
    const payload = {
      sn: formData.sn.trim(),
      type: formData.type,
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      purchaseDate: formData.purchaseDate || null,
      warrantyEndDate: formData.warrantyEndDate || null,
      userId: formData.userId ? Number(formData.userId) : null,
    }

    try {
      if (isEditing) {
        await updateAsset(id, payload)
      } else {
        await createAsset(payload)
      }
      navigate('/assets', { replace: true })
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (isEditing ? 'Failed to update asset.' : 'Failed to create asset.')
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  // ── Page loading state ────────────────────────────────

  if (pageLoading) {
    return <LoadingSpinner message="Loading asset data…" />
  }

  return (
    <div className="asset-form-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <button
            className="btn btn-ghost btn-sm mb-2"
            onClick={() => navigate('/assets')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 010 .708L5.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clipRule="evenodd" />
            </svg>
            Back to Assets
          </button>
          <h1 className="page-title">
            {isEditing ? 'Edit Asset' : 'Add New Asset'}
          </h1>
          <p className="page-subtitle">
            {isEditing
              ? 'Update the asset information below.'
              : 'Fill in the details to register a new hardware asset.'}
          </p>
        </div>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="asset-form-page__alert" role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5h2v4H7V5zm0 5h2v2H7v-2z" />
          </svg>
          <span>{apiError}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="card asset-form-page__card">
        <AssetForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          isEditing={isEditing}
          users={users}
        />
      </div>
    </div>
  )
}
