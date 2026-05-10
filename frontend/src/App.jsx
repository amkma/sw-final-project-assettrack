import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Layouts
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Guards
import ProtectedRoute from './components/common/ProtectedRoute'
import RoleGuard from './components/common/RoleGuard'

// Landing page
import LandingPage from './pages/LandingPage'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'

// Dashboard
import DashboardPage from './pages/dashboard/DashboardPage'

// Assets
import AssetsListPage from './pages/assets/AssetsListPage'
import AssetDetailPage from './pages/assets/AssetDetailPage'
import AssetFormPage from './pages/assets/AssetFormPage'

// Users
import UsersListPage from './pages/users/UsersListPage'
import UserDetailPage from './pages/users/UserDetailPage'

// Reports
import ReportsListPage from './pages/reports/ReportsListPage'
import ReportFormPage from './pages/reports/ReportFormPage'

// Notifications & Search
import NotificationsPage from './pages/notifications/NotificationsPage'
import SearchPage from './pages/search/SearchPage'

// 404
import NotFoundPage from './pages/NotFoundPage'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Landing Page (public) ─────────────────────── */}
        <Route path="/" element={<LandingPage />} />

        {/* ── Public Auth Routes ─────────────────────────── */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        {/* ── Protected Dashboard Routes ─────────────────── */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard — Admin / Manager only */}
          <Route
            path="/dashboard"
            element={
              <RoleGuard minRole={1}>
                <DashboardPage />
              </RoleGuard>
            }
          />

          {/* Assets — all roles can view */}
          <Route path="/assets" element={<AssetsListPage />} />
          <Route path="/assets/:id" element={<AssetDetailPage />} />

          {/* Assets — Admin only (create / edit) */}
          <Route
            path="/assets/new"
            element={
              <RoleGuard minRole={2}>
                <AssetFormPage />
              </RoleGuard>
            }
          />
          <Route
            path="/assets/:id/edit"
            element={
              <RoleGuard minRole={2}>
                <AssetFormPage />
              </RoleGuard>
            }
          />

          {/* Users — Admin / Manager */}
          <Route
            path="/users"
            element={
              <RoleGuard minRole={1}>
                <UsersListPage />
              </RoleGuard>
            }
          />
          <Route
            path="/users/:id"
            element={
              <RoleGuard minRole={1}>
                <UserDetailPage />
              </RoleGuard>
            }
          />

          {/* Reports — all roles can view (API scopes data per role) */}
          <Route path="/reports" element={<ReportsListPage />} />
          <Route path="/reports/new" element={<ReportFormPage />} />

          {/* Notifications & Search — all roles */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>

        {/* ── 404 Catch-all ──────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
