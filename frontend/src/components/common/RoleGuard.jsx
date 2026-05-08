import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

/**
 * RoleGuard — restricts access based on the user's roleId.
 *
 * @param {number} minRole  — the minimum roleId required (0=Developer, 1=Manager, 2=Admin)
 *
 * Usage:
 *   <RoleGuard minRole={2}> … Admin-only content … </RoleGuard>
 *   <RoleGuard minRole={1}> … Manager + Admin content … </RoleGuard>
 */
export default function RoleGuard({ children, minRole = 0 }) {
  const { user } = useAuth()

  const userRole = user?.roleId ?? 0

  if (userRole < minRole) {
    return (
      <div className="access-denied">
        <div className="access-denied__icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="var(--danger)" strokeWidth="3" fill="var(--danger-light)" />
            <path
              d="M22 22l20 20M42 22L22 42"
              stroke="var(--danger)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2 className="access-denied__title">Access Denied</h2>
        <p className="access-denied__message">
          You don&apos;t have permission to view this page.
        </p>
        <Link to="/" className="btn btn-primary">
          Go to Dashboard
        </Link>
      </div>
    )
  }

  return children
}
