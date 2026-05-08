import { useState, useEffect } from 'react'
import { getNotifications, markAsRead } from '../../api/notificationApi'
import { groupByDate } from '../../utils/helpers'
import NotificationCard from '../../components/cards/NotificationCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './NotificationsPage.css'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getNotifications()
        setNotifications(res.data || [])
      } catch {
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  async function handleMarkRead(id) {
    try {
      await markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
    } catch {
      // handle silently
    }
  }

  function handleMarkAllRead() {
    const unread = notifications.filter((n) => !n.isRead)
    unread.forEach((n) => handleMarkRead(n.id))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const grouped = groupByDate(notifications, 'date')
  const dateKeys = Object.keys(grouped)

  return (
    <div className="notifications-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.354 4.354a.5.5 0 00-.708-.708L6 10.293 3.354 7.646a.5.5 0 10-.708.708l3 3a.5.5 0 00.708 0l7-7z" />
            </svg>
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading notifications…" />
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ marginBottom: 'var(--space-4)', opacity: 0.35 }}>
            <path d="M28 8a16 16 0 00-16 16v9.586l-1.707 1.707A2 2 0 0011.707 40h32.586a2 2 0 001.414-3.707L44 34.586V24A16 16 0 0028 8z" stroke="var(--gray-400)" strokeWidth="2" />
            <path d="M22 40a6 6 0 1012 0" stroke="var(--gray-400)" strokeWidth="2" />
          </svg>
          <h3>No notifications</h3>
          <p>You&apos;re all caught up. Notifications will appear here.</p>
        </div>
      ) : (
        <div className="notifications-page__list card">
          {dateKeys.map((dateLabel) => (
            <div key={dateLabel} className="notifications-page__group">
              <div className="notifications-page__date-label">{dateLabel}</div>
              {grouped[dateLabel].map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  onMarkRead={handleMarkRead}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
