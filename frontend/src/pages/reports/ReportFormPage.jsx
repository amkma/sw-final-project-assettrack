import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAssets } from '../../api/assetApi'
import { createReport } from '../../api/reportApi'
import ReportForm from '../../components/forms/ReportForm'
import './ReportFormPage.css'

export default function ReportFormPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    assetId: '',
    description: '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [assets, setAssets] = useState([])

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await getAssets()
        setAssets(res.data || [])
      } catch {
        setAssets([])
      }
    }
    fetchAssets()
  }, [])

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
    if (!formData.assetId) {
      newErrors.assetId = 'Please select an asset'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setApiError('')

    try {
      await createReport({
        assetId: Number(formData.assetId),
        description: formData.description.trim(),
      })
      navigate('/reports', { replace: true })
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to submit report. Please try again.'
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="report-form-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm mb-2" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 010 .708L5.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <h1 className="page-title">Report an Issue</h1>
          <p className="page-subtitle">
            Submit a condition report for a hardware asset.
          </p>
        </div>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="report-form-page__alert" role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5h2v4H7V5zm0 5h2v2H7v-2z" />
          </svg>
          <span>{apiError}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="card report-form-page__card">
        <ReportForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          assets={assets}
        />
      </div>
    </div>
  )
}
