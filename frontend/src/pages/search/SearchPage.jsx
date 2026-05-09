import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { searchAssets, findSpare } from '../../api/assetApi'
import { ASSET_TYPES } from '../../utils/constants'
import { formatDate } from '../../utils/helpers'
import './SearchPage.css'

export default function SearchPage() {
  const navigate = useNavigate()

  const [params, setParams] = useState({
    sn: '',
    type: '',
    brand: '',
    status: '',
  })
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [spareResult, setSpareResult] = useState(null)
  const [spareFinding, setSpareFinding] = useState(false)

  const { user } = useAuth()
  const isDeveloper = user?.roleId === 0

  function handleChange(e) {
    const { name, value } = e.target
    setParams((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSearch(e) {
    e.preventDefault()
    setLoading(true)
    setSearched(true)
    setSpareResult(null)
    try {
      // Build non-empty query params
      const query = {}
      if (params.sn.trim()) query.sn = params.sn.trim()
      if (params.type) query.type = params.type
      if (params.brand.trim()) query.brand = params.brand.trim()
      if (params.status) query.status = params.status

      const res = await searchAssets(query)
      setResults(res.data?.content || res.data || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setParams({ sn: '', type: '', brand: '', status: '' })
    setResults([])
    setSearched(false)
    setSpareResult(null)
  }

  async function handleFindSpare() {
    setSpareFinding(true)
    setSpareResult(null)
    try {
      const res = await findSpare('Laptop')
      const spareList = res.data?.content || res.data || []
      setSpareResult(spareList[0] || null)
    } catch {
      setSpareResult('none')
    } finally {
      setSpareFinding(false)
    }
  }

  return (
    <div className="search-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Search Assets</h1>
          <p className="page-subtitle">Find assets by serial number, type, brand, or status.</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="card search-page__form-card">
        <form className="search-page__form" onSubmit={handleSearch}>
          <div className="search-page__fields">
            <div className="form-group">
              <label className="form-label" htmlFor="search-sn">Serial Number</label>
              <input
                id="search-sn"
                className="form-input"
                type="text"
                name="sn"
                placeholder="e.g. SN-20240001"
                value={params.sn}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="search-type">Type</label>
              <select
                id="search-type"
                className="form-select"
                name="type"
                value={params.type}
                onChange={handleChange}
              >
                <option value="">Any</option>
                {ASSET_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="search-brand">Brand</label>
              <input
                id="search-brand"
                className="form-input"
                type="text"
                name="brand"
                placeholder="e.g. Dell"
                value={params.brand}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="search-status">Status</label>
              <select
                id="search-status"
                className="form-select"
                name="status"
                value={params.status}
                onChange={handleChange}
              >
                <option value="">Any</option>
                <option value="assigned">Assigned</option>
                {!isDeveloper && <option value="available">Available</option>}
              </select>
            </div>
          </div>

          <div className="search-page__actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M6.5 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM0 6.5a6.5 6.5 0 1111.65 3.938l3.206 3.206a1 1 0 01-1.414 1.414l-3.206-3.206A6.5 6.5 0 010 6.5z" clipRule="evenodd" />
              </svg>
              {loading ? 'Searching…' : 'Search'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={handleClear}>
              Clear
            </button>
            {!isDeveloper && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleFindSpare}
                disabled={spareFinding}
              >
                {spareFinding ? 'Finding…' : '🔍 Find Available Spare Laptop'}
              </button>
            )}
          </div>
        </form>

        {/* Spare Result */}
        {spareResult && spareResult !== 'none' && (
          <div className="search-page__spare-result animate-fade-in">
            <p className="font-semibold text-success">Spare laptop found!</p>
            <p className="text-sm">
              <strong>{spareResult.brand} {spareResult.model}</strong> — SN: <code>{spareResult.sn}</code>
            </p>
            <div className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>
              <p>Production/Purchase Date: {formatDate(spareResult.purchaseDate)}</p>
              <p>Warranty End: {formatDate(spareResult.warrantyEndDate)}</p>
              <p>Last Owner: {spareResult.lastOwnerName || 'N/A'}</p>
            </div>
            <button
              className="btn btn-ghost btn-sm mt-2"
              onClick={() => navigate(`/assets/${spareResult.id}`)}
            >
              View Asset →
            </button>
          </div>
        )}
        {spareResult === 'none' && (
          <p className="text-sm text-muted mt-3">No spare laptops available at this time.</p>
        )}
      </div>

      {/* Results */}
      {searched && !loading && (
        <div className="search-page__results animate-fade-in">
          <h3 className="search-page__results-title">
            Results <span className="badge badge-neutral">{results.length}</span>
          </h3>

          {results.length === 0 ? (
            <div className="empty-state">
              <h3>No assets match your search</h3>
              <p>Try different filters or broaden your criteria.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Serial Number</th>
                    <th>Type</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Warranty End</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((asset) => {
                    const isAssigned = asset.lastOwnerName != null
                    return (
                      <tr
                        key={asset.id}
                        className="search-page__row"
                        onClick={() => navigate(`/assets/${asset.id}`)}
                      >
                        <td><code className="search-page__sn">{asset.sn}</code></td>
                        <td><span className="badge badge-neutral">{asset.type || '—'}</span></td>
                        <td>{asset.brand || '—'}</td>
                        <td>{asset.model || '—'}</td>
                        <td>
                          <span className={`badge ${isAssigned ? 'badge-info' : 'badge-success'}`}>
                            {isAssigned ? 'Assigned' : 'Available'}
                          </span>
                        </td>
                        <td>
                          {isAssigned
                            ? asset.lastOwnerName
                            : <span className="text-muted">—</span>}
                        </td>
                        <td>{formatDate(asset.warrantyEndDate)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
