import { formatDate } from '../../utils/helpers'
import './NotificationCard.css'

/**
 * NotificationCard — single notification item.
 *
 * @param {Object}   notification — { id, description, date, isRead }
 * @param {Function} onMarkRead  — called with notification id
 * @param {Function} onDelete    — called with notification id
 */
export default function NotificationCard({ notification, onMarkRead, onDelete }) {
  const isUnread = !notification.isRead

  // Derive icon based on description keywords
  function getIcon() {
    const desc = (notification.description || '').toLowerCase()
    if (desc.includes('warranty') || desc.includes('expir')) {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 6h2v5H9V6zm0 6h2v2H9v-2z" />
        </svg>
      )
    }
    if (desc.includes('assign') || desc.includes('transfer')) {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 8a3 3 0 100-6 3 3 0 000 6zm0 2c-3.3 0-6 1.7-6 4v1h12v-1c0-2.3-2.7-4-6-4zm8-4a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0 2c-2 0-4 1-4 3v1h8v-1c0-2-2-3-4-3z" />
        </svg>
      )
    }
    if (desc.includes('report') || desc.includes('status')) {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 3h10v2H5V5zm0 4h10v2H5V9zm0 4h6v2H5v-2z" />
        </svg>
      )
    }
    // Default bell icon
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
    )
  }

  return (
    <div
      className={`notification-card ${isUnread ? 'notification-card--unread' : ''}`}
    >
      <div className="notification-card__icon">
        {getIcon()}
      </div>
      <div className="notification-card__content">
        <p className="notification-card__text">{notification.description}</p>
        <span className="notification-card__date">{formatDate(notification.date)}</span>
      </div>
      
      <div className="notification-card__actions">
        {isUnread && (
          <button 
            className="btn btn-ghost btn-sm btn-icon" 
            title="Mark as read"
            onClick={() => onMarkRead && onMarkRead(notification.id)}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--success)' }}>
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        <button 
          className="btn btn-ghost btn-sm btn-icon" 
          title="Delete"
          onClick={() => onDelete && onDelete(notification.id)}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--danger)' }}>
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isUnread && <div className="notification-card__dot" />}
    </div>
  )
}
