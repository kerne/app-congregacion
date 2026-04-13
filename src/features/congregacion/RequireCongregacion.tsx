import { Navigate } from 'react-router-dom'
import { useCongregacion } from './useCongregacion'
import { useCurrentUser } from '@/features/auth/useCurrentUser'

export function RequireCongregacion({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useCurrentUser()
  const { congregacionId, loading, needsOnboarding } = useCongregacion()

  if (authLoading || loading) return null

  // Anon users can browse without congregation
  if (!user) return <>{children}</>

  if (needsOnboarding) return <Navigate to="/onboarding" replace />

  if (!congregacionId) return null

  return <>{children}</>
}
