import { useNavigate } from 'react-router-dom'
import './AssetCard.css'

/**
 * AssetCard — grid/card view for a single asset.
 *
 * @param {Object} asset — asset data object
 */
export default function AssetCard({ asset }) {
  const navigate = useNavigate()

  const isAssigned = asset.lastOwnerName != null
  const warrantyOk = asset.warrantyEndDate
    ? new Date(asset.warrantyEndDate) > new Date()
    : null

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  return (
    <div
      className="asset-card"
      onClick={() => navigate(`/assets/${asset.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/assets/${asset.id}`)}
    >
      {/* Header */}
      <div className="asset-card__header">
        <div className="asset-card__type-badge">
          {asset.type || 'Asset'}
        </div>
        <span className={`badge ${isAssigned ? 'badge-info' : 'badge-success'}`}>
          {isAssigned ? 'Assigned' : 'Available'}
        </span>
      </div>

      {/* Body */}
      <div className="asset-card__body">
        <h4 className="asset-card__model">
          {asset.brand} {asset.model}
        </h4>
        <p className="asset-card__sn">SN: {asset.sn}</p>
      </div>

      {/* Footer meta */}
      <div className="asset-card__footer">
        <div className="asset-card__meta">
          <span className="asset-card__meta-label">Purchased</span>
          <span>{formatDate(asset.purchaseDate)}</span>
        </div>
        <div className="asset-card__meta">
          <span className="asset-card__meta-label">Warranty</span>
          <span className={warrantyOk === false ? 'text-danger' : warrantyOk === true ? 'text-success' : ''}>
            {formatDate(asset.warrantyEndDate)}
          </span>
        </div>
        {isAssigned && (
          <div className="asset-card__meta">
            <span className="asset-card__meta-label">Assigned to</span>
            <span>{asset.lastOwnerName}</span>
          </div>
        )}
      </div>
    </div>
  )
}
