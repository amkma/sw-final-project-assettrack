import { Outlet } from 'react-router-dom'
import './AuthLayout.css'

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__background">
        <div className="auth-layout__shape auth-layout__shape--1"></div>
        <div className="auth-layout__shape auth-layout__shape--2"></div>
        <div className="auth-layout__shape auth-layout__shape--3"></div>
      </div>

      <div className="auth-layout__container">
        <div className="auth-layout__brand">
          <div className="auth-layout__logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#4c6ef5" />
              <path d="M12 28V16l8-6 8 6v12H22v-6h-4v6H12z" fill="#fff" />
            </svg>
          </div>
          <h1 className="auth-layout__title">AssetTrack</h1>
          <p className="auth-layout__subtitle">Hardware Asset Management</p>
        </div>

        <div className="auth-layout__card">
          <Outlet />
        </div>

        <p className="auth-layout__footer">
          &copy; {new Date().getFullYear()} AssetTrack. All rights reserved.
        </p>
      </div>
    </div>
  )
}
