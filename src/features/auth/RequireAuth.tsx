import { Navigate, useLocation } from 'react-router-dom'
import { useCurrentUser } from './useCurrentUser'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useCurrentUser()
  const location = useLocation()

  if (loading) return null

  if (!user) {
    sessionStorage.setItem('returnTo', location.pathname)
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
