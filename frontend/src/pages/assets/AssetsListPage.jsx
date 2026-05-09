import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getAssets } from '../../api/assetApi'
import AssetCard from '../../components/cards/AssetCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './AssetsListPage.css'

const ITEMS_PER_PAGE = 10

export default function AssetsListPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.roleId === 2

  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('table') // 'table' | 'grid'

  // Filters
  const [filterType, setFilterType] = useState('')
  const [filterBrand, setFilterBrand] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await getAssets()
        setAssets(res.data?.content || res.data || [])
      } catch {
        setAssets([])
      } finally {
        setLoading(false)
      }
    }
    fetchAssets()
  }, [])

  // ── Derive unique filter options from data ──────────────

  const typeOptions = useMemo(
    () => [...new Set(assets.map((a) => a.type).filter(Boolean))].sort(),
    [assets]
  )
  const brandOptions = useMemo(
    () => [...new Set(assets.map((a) => a.brand).filter(Boolean))].sort(),
    [assets]
  )

  // ── Apply filters ──────────────────────────────────────

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (filterType && a.type !== filterType) return false
      if (filterBrand && a.brand !== filterBrand) return false
      if (filterStatus === 'assigned' && a.lastOwnerName == null) return false
      if (filterStatus === 'available' && a.lastOwnerName != null) return false
      return true
    })
  }, [assets, filterType, filterBrand, filterStatus])

  // ── Pagination ─────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filterType, filterBrand, filterStatus])

  // ── Helpers ────────────────────────────────────────────

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  function clearFilters() {
    setFilterType('')
    setFilterBrand('')
    setFilterStatus('')
  }

  const hasActiveFilters = filterType || filterBrand || filterStatus

  // ── Render ─────────────────────────────────────────────

  return (
    <div className="assets-list-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Assets</h1>
          <p className="page-subtitle">
            {filtered.length} asset{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="assets-list-page__actions">
          {isAdmin && (
            <Link to="/assets/new" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2a1 1 0 011 1v4h4a1 1 0 110 2H9v4a1 1 0 11-2 0V9H3a1 1 0 010-2h4V3a1 1 0 011-1z" />
              </svg>
              Add New Asset
            </Link>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="assets-list-page__filters card">
        <div className="assets-list-page__filter-row">
          <div className="assets-list-page__filter-group">
            <label className="form-label" htmlFor="filter-type">Type</label>
            <select
              id="filter-type"
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="assets-list-page__filter-group">
            <label className="form-label" htmlFor="filter-brand">Brand</label>
            <select
              id="filter-brand"
              className="form-select"
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              {brandOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="assets-list-page__filter-group">
            <label className="form-label" htmlFor="filter-status">Status</label>
            <select
              id="filter-status"
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="assigned">Assigned</option>
              <option value="available">Available</option>
            </select>
          </div>

          <div className="assets-list-page__filter-actions">
            {hasActiveFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* View Toggle */}
        <div className="assets-list-page__view-toggle">
          <button
            className={`assets-list-page__view-btn ${viewMode === 'table' ? 'assets-list-page__view-btn--active' : ''}`}
            onClick={() => setViewMode('table')}
            aria-label="Table view"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <path d="M2 3h14v2H2V3zm0 5h14v2H2V8zm0 5h14v2H2v-2z" />
            </svg>
          </button>
          <button
            className={`assets-list-page__view-btn ${viewMode === 'grid' ? 'assets-list-page__view-btn--active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <path d="M2 2h5v5H2V2zm9 0h5v5h-5V2zM2 11h5v5H2v-5zm9 0h5v5h-5v-5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <LoadingSpinner message="Loading assets…" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ marginBottom: 'var(--space-4)', opacity: 0.35 }}>
            <rect x="4" y="8" width="48" height="40" rx="6" stroke="var(--gray-400)" strokeWidth="2" />
            <path d="M4 20h48M20 20v28M36 20v28" stroke="var(--gray-300)" strokeWidth="2" />
          </svg>
          <h3>No assets found</h3>
          <p>{hasActiveFilters ? 'Try adjusting your filters.' : 'No assets have been added yet.'}</p>
          {isAdmin && !hasActiveFilters && (
            <Link to="/assets/new" className="btn btn-primary mt-4">Add First Asset</Link>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* ── Grid View ──────────────────────────────────── */
        <div className="assets-list-page__grid">
          {paginated.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        /* ── Table View ─────────────────────────────────── */
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>Type</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Purchase Date</th>
                <th>Warranty End</th>
                <th>Assigned To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((asset) => {
                const isAssigned = asset.lastOwnerName != null
                return (
                  <tr
                    key={asset.id}
                    className="assets-list-page__row"
                    onClick={() => navigate(`/assets/${asset.id}`)}
                  >
                    <td>
                      <code className="assets-list-page__sn">{asset.sn}</code>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{asset.type || '—'}</span>
                    </td>
                    <td>{asset.brand || '—'}</td>
                    <td>{asset.model || '—'}</td>
                    <td>{formatDate(asset.purchaseDate)}</td>
                    <td>{formatDate(asset.warrantyEndDate)}</td>
                    <td>
                      {isAssigned
                        ? asset.lastOwnerName
                        : <span className="text-muted">—</span>}
                    </td>
                    <td>
                      <span className={`badge ${isAssigned ? 'badge-info' : 'badge-success'}`}>
                        {isAssigned ? 'Assigned' : 'Available'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && filtered.length > ITEMS_PER_PAGE && (
        <div className="assets-list-page__pagination">
          <button
            className="btn btn-secondary btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ← Previous
          </button>
          <span className="assets-list-page__page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
