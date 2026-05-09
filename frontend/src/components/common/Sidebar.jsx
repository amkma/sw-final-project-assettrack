import { NavLink, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import './Sidebar.css'

// SVG icon components for the sidebar navigation
const icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M3 3h6v8H3V3zm8 0h6v4h-6V3zm0 6h6v8h-6V9zM3 13h6v4H3v-4z" />
    </svg>
  ),
  assets: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v2H4V5zm0 4h5v6H4V9zm7 0h5v6h-5V9z" />
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M7 8a3 3 0 100-6 3 3 0 000 6zm7.5-1a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1 14s0-4 6-4 6 4 6 4v1H1v-1zm12.5-2c3.5 0 5.5 2.5 5.5 4v1h-5v-1c0-1.1-.4-2.2-1.2-3.1.7-.5 1.5-.9 2.7-.9z" />
    </svg>
  ),
  reports: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 3h10v2H5V5zm0 4h10v2H5V9zm0 4h6v2H5v-2z" />
    </svg>
  ),
  search: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  ),
  notifications: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  ),
}

export default function Sidebar({ collapsed, onToggle }) {
  const { user } = useAuth()
  const location = useLocation()

  // Role checks: Admin = 2, Manager = 1, Developer = 0
  const isAdminOrManager = user?.roleId >= 1

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: icons.dashboard },
    { to: '/assets', label: 'Assets', icon: icons.assets },
    ...(isAdminOrManager
      ? [{ to: '/users', label: 'Users', icon: icons.users }]
      : []),
    { to: '/reports', label: 'Reports', icon: icons.reports },
    { to: '/search', label: 'Search', icon: icons.search },
    { to: '/notifications', label: 'Notifications', icon: icons.notifications },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="sidebar-overlay"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#4c6ef5" />
              <path d="M12 28V16l8-6 8 6v12H22v-6h-4v6H12z" fill="#fff" />
            </svg>
          </div>
          {!collapsed && <span className="sidebar__brand-text">AssetTrack</span>}
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          <ul className="sidebar__list">
            {navItems.map((item) => (
              <li key={item.to} className="sidebar__item">
                <NavLink
                  to={item.to}
                  end={item.to === '/dashboard'}
                  className={({ isActive }) =>
                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <span className="sidebar__icon">{item.icon}</span>
                  {!collapsed && (
                    <span className="sidebar__label">{item.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse toggle (visible on desktop) */}
        <button
          className="sidebar__toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`sidebar__toggle-icon ${collapsed ? 'sidebar__toggle-icon--flipped' : ''}`}
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>
    </>
  )
}
