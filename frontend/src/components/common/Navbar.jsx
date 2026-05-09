import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getUnreadCount } from '../../api/notificationApi'
import './Navbar.css'

export default function Navbar({ onMenuToggle }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef(null)

  // Fetch unread count initially and when navigating
  useEffect(() => {
    if (user?.id) {
      getUnreadCount(user.id)
        .then(res => setUnreadCount(res.data || 0))
        .catch(err => console.warn('Failed to fetch unread count', err))
    }
  }, [user?.id, location.pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  // Build initials from user name
  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '?'

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : 'User'

  const roleName =
    user?.roleId === 2 ? 'Admin' : user?.roleId === 1 ? 'Manager' : 'Developer'

  return (
    <header className="navbar">
      {/* Left: hamburger (mobile) + page breadcrumb area */}
      <div className="navbar__left">
        <button
          className="navbar__menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
            <path d="M3 5h16v2H3V5zm0 5h16v2H3v-2zm0 5h16v2H3v-2z" />
          </svg>
        </button>
      </div>

      {/* Right: notification bell + user dropdown */}
      <div className="navbar__right">
        {/* Notification bell */}
        <Link to="/notifications" className="navbar__icon-btn" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          {unreadCount > 0 && (
            <span className="navbar__badge" aria-label={`${unreadCount} unread`}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User dropdown */}
        <div className="navbar__user" ref={dropdownRef}>
          <button
            className="navbar__user-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <span className="avatar avatar-sm">{initials}</span>
            <div className="navbar__user-info">
              <span className="navbar__user-name">{displayName}</span>
              <span className="navbar__user-role">{roleName}</span>
            </div>
            <svg
              className={`navbar__chevron ${dropdownOpen ? 'navbar__chevron--open' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 6.293a1 1 0 011.414 0L8 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="navbar__dropdown animate-fade-in">
              <div className="navbar__dropdown-header">
                <span className="avatar avatar-md">{initials}</span>
                <div>
                  <p className="navbar__dropdown-name">{displayName}</p>
                  <p className="navbar__dropdown-email">{user?.email || ''}</p>
                </div>
              </div>
              <div className="navbar__dropdown-divider" />
              <button
                className="navbar__dropdown-item navbar__dropdown-item--danger"
                onClick={handleLogout}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M6 2a1 1 0 00-1 1v2a1 1 0 002 0V4h5v8H7v-1a1 1 0 10-2 0v2a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1H6z" />
                  <path d="M1.293 7.293a1 1 0 000 1.414l2 2a1 1 0 001.414-1.414L3.414 8l1.293-1.293a1 1 0 00-1.414-1.414l-2 2z" />
                  <path d="M8 7H3v2h5V7z" />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
