import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

/**
 * ProtectedRoute — wraps any route that requires authentication.
 * If the user is not logged in, they are redirected to /login
 * and the originally-requested path is preserved via `state.from`.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // While the auth state is still being restored from localStorage, show nothing
  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
