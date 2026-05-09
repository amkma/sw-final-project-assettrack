import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getAssetById, findSpare } from '../../api/assetApi'
import { getHistoryByAsset } from '../../api/historyApi'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './AssetDetailPage.css'

export default function AssetDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const isAdmin = user?.roleId === 2
  const isAdminOrManager = user?.roleId >= 1

  const [asset, setAsset] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [spareResult, setSpareResult] = useState(null)
  const [spareFinding, setSpareFinding] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [assetRes, historyRes] = await Promise.allSettled([
          getAssetById(id),
          getHistoryByAsset(id),
        ])
        if (assetRes.status === 'fulfilled') setAsset(assetRes.value.data)
        if (historyRes.status === 'fulfilled') setHistory(historyRes.value.data?.content || historyRes.value.data || [])
      } catch {
        // API not available
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  // ── Warranty status ────────────────────────────────────

  function getWarrantyStatus(dateStr) {
    if (!dateStr) return { label: 'Unknown', color: 'neutral' }
    const end = new Date(dateStr)
    const now = new Date()
    const thirtyDays = new Date(now)
    thirtyDays.setDate(now.getDate() + 30)

    if (end < now) return { label: 'Expired', color: 'danger' }
    if (end <= thirtyDays) return { label: 'Expiring Soon', color: 'warning' }
    return { label: 'Valid', color: 'success' }
  }

  // ── Helpers ────────────────────────────────────────────

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  async function handleFindSpare() {
    if (!asset?.type) return
    setSpareFinding(true)
    setSpareResult(null)
    try {
      const res = await findSpare(asset.type)
      setSpareResult(res.data)
    } catch {
      setSpareResult('none')
    } finally {
      setSpareFinding(false)
    }
  }

  // ── Loading / Not Found ────────────────────────────────

  if (loading) {
    return <LoadingSpinner message="Loading asset details…" />
  }

  if (!asset) {
    return (
      <div className="empty-state">
        <h3>Asset not found</h3>
        <p>The asset you are looking for does not exist or has been removed.</p>
        <Link to="/assets" className="btn btn-primary mt-4">Back to Assets</Link>
      </div>
    )
  }

  const warranty = getWarrantyStatus(asset.warrantyEndDate)
  const isAssigned = asset.lastOwnerName != null

  return (
    <div className="asset-detail animate-fade-in">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm mb-2" onClick={() => navigate('/assets')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 010 .708L5.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clipRule="evenodd" />
            </svg>
            Back to Assets
          </button>
          <h1 className="page-title">{asset.brand} {asset.model}</h1>
          <p className="page-subtitle">Serial Number: <code>{asset.sn}</code></p>
        </div>
        <div className="asset-detail__header-actions">
          {isAdmin && (
            <Link to={`/assets/${id}/edit`} className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.146.854a.5.5 0 01.708 0l2.292 2.292a.5.5 0 010 .708l-9.5 9.5a.5.5 0 01-.233.131l-3.5 1a.5.5 0 01-.617-.617l1-3.5a.5.5 0 01.131-.233l9.5-9.5z" />
              </svg>
              Edit Asset
            </Link>
          )}
          {isAdminOrManager && (
            <button className="btn btn-secondary" onClick={() => navigate(`/assets/${id}/edit`)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 4a.5.5 0 01.5.5V7H11a.5.5 0 010 1H8.5v2.5a.5.5 0 01-1 0V8H5a.5.5 0 010-1h2.5V4.5A.5.5 0 018 4z" />
                <path d="M3 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V2a2 2 0 00-2-2H3zm0 1h10a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z" />
              </svg>
              Reassign
            </button>
          )}
          <Link to="/reports/new" className="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 118 1a7 7 0 010 14zM7 5v4h2V5H7zm0 5v2h2v-2H7z" />
            </svg>
            Report Issue
          </Link>
        </div>
      </div>

      <div className="asset-detail__grid">
        {/* ── Asset Info Card ───────────────────────────── */}
        <div className="card asset-detail__info">
          <div className="card-header">
            <h3 className="card-title">Asset Information</h3>
            <span className={`badge badge-${warranty.color}`}>{warranty.label}</span>
          </div>
          <div className="card-body">
            <div className="asset-detail__fields">
              <div className="asset-detail__field">
                <span className="asset-detail__field-label">Serial Number</span>
                <span className="asset-detail__field-value">
                  <code>{asset.sn}</code>
                </span>
              </div>
              <div className="asset-detail__field">
                <span className="asset-detail__field-label">Type</span>
                <span className="asset-detail__field-value">
                  <span className="badge badge-neutral">{asset.type || '—'}</span>
                </span>
              </div>
              <div className="asset-detail__field">
                <span className="asset-detail__field-label">Brand</span>
                <span className="asset-detail__field-value">{asset.brand || '—'}</span>
              </div>
              <div className="asset-detail__field">
                <span className="asset-detail__field-label">Model</span>
                <span className="asset-detail__field-value">{asset.model || '—'}</span>
              </div>
              <div className="asset-detail__field">
                <span className="asset-detail__field-label">Purchase Date</span>
                <span className="asset-detail__field-value">{formatDate(asset.purchaseDate)}</span>
              </div>
              <div className="asset-detail__field">
                <span className="asset-detail__field-label">Warranty End</span>
                <span className={`asset-detail__field-value text-${warranty.color}`}>
                  {formatDate(asset.warrantyEndDate)}
                </span>
              </div>
            </div>

            {/* Warranty indicator bar */}
            <div className={`asset-detail__warranty-bar asset-detail__warranty-bar--${warranty.color}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                {warranty.color === 'success' && (
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.354 5.354l-4 4a.5.5 0 01-.708 0l-2-2a.5.5 0 11.708-.708L7 9.293l3.646-3.647a.5.5 0 01.708.708z" />
                )}
                {warranty.color === 'warning' && (
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5h2v4H7V5zm0 5h2v2H7v-2z" />
                )}
                {warranty.color === 'danger' && (
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm2.354 4.646a.5.5 0 010 .708L8.707 8l1.647 1.646a.5.5 0 01-.708.708L8 8.707l-1.646 1.647a.5.5 0 01-.708-.708L7.293 8 5.646 6.354a.5.5 0 01.708-.708L8 7.293l1.646-1.647a.5.5 0 01.708 0z" />
                )}
                {warranty.color === 'neutral' && (
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5h2v4H7V5zm0 5h2v2H7v-2z" />
                )}
              </svg>
              <span>
                {warranty.color === 'success' && 'Warranty is active'}
                {warranty.color === 'warning' && 'Warranty expires within 30 days'}
                {warranty.color === 'danger' && 'Warranty has expired'}
                {warranty.color === 'neutral' && 'No warranty information'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Current Owner Card ────────────────────────── */}
        <div className="card asset-detail__owner">
          <div className="card-header">
            <h3 className="card-title">Current Owner</h3>
          </div>
          <div className="card-body">
            {isAssigned ? (
              <div className="asset-detail__owner-info">
                <div className="avatar avatar-lg">
                  {asset.lastOwnerName?.[0]}
                </div>
                <div>
                  <p className="font-semibold" style={{ margin: 0 }}>
                    {asset.lastOwnerName}
                  </p>
                </div>
              </div>
            ) : (
              <div className="asset-detail__unassigned">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ opacity: 0.3 }}>
                  <circle cx="20" cy="20" r="18" stroke="var(--gray-400)" strokeWidth="2" />
                  <path d="M20 12v8l5 3" stroke="var(--gray-400)" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="text-muted">This asset is not currently assigned.</p>
              </div>
            )}
          </div>

          {/* Find Spare */}
          <div className="asset-detail__spare">
            <button
              className="btn btn-secondary btn-sm w-full"
              onClick={handleFindSpare}
              disabled={spareFinding}
            >
              {spareFinding ? 'Searching…' : `Find Spare ${asset.type || 'Asset'}`}
            </button>
            {spareResult && spareResult !== 'none' && (
              <div className="asset-detail__spare-result">
                <p className="text-sm font-medium text-success">Spare found!</p>
                <p className="text-sm">
                  {spareResult.brand} {spareResult.model} — SN: <code>{spareResult.sn}</code>
                </p>
                <Link to={`/assets/${spareResult.id}`} className="btn btn-ghost btn-sm mt-1">
                  View Asset →
                </Link>
              </div>
            )}
            {spareResult === 'none' && (
              <p className="text-sm text-muted mt-2">No spare {asset.type || 'asset'} available.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Allocation History ──────────────────────────── */}
      <div className="card asset-detail__history">
        <div className="card-header">
          <h3 className="card-title">Allocation History</h3>
          <span className="badge badge-neutral">{history.length} entries</span>
        </div>
        <div className="card-body">
          {history.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8) 0' }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ marginBottom: 'var(--space-3)', opacity: 0.35 }}>
                <circle cx="24" cy="24" r="22" stroke="var(--gray-300)" strokeWidth="2" />
                <path d="M24 14v12l8 4" stroke="var(--gray-400)" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h3>No history yet</h3>
              <p>Allocation records will appear here once the asset is transferred.</p>
            </div>
          ) : (
            <div className="asset-detail__timeline">
              {history.map((entry, idx) => (
                <div key={entry.id || idx} className="asset-detail__timeline-item">
                  <div className="asset-detail__timeline-marker">
                    <div className="asset-detail__timeline-dot" />
                    {idx < history.length - 1 && <div className="asset-detail__timeline-line" />}
                  </div>
                  <div className="asset-detail__timeline-content">
                    <div className="asset-detail__timeline-header">
                      <span className="font-semibold text-sm">
                        {entry.note || 'Asset transferred'}
                      </span>
                      <span className="text-xs text-muted">
                        {formatDate(entry.assignedAt)}
                      </span>
                    </div>
                    <div className="asset-detail__timeline-body">
                      {entry.userId && (
                        <span className="asset-detail__timeline-user">
                          <span className="text-muted">Assigned User ID:</span>{' '}
                          {entry.userId}
                        </span>
                      )}
                      {entry.returnedAt && (
                        <span className="text-xs text-muted">
                          Returned: {formatDate(entry.returnedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
