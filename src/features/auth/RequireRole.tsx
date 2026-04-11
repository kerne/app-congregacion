import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useCurrentUser } from './useCurrentUser'
import type { PublicadorRol } from '@/core/supabase/types'

interface RequireRoleProps {
  roles: PublicadorRol[]
  children: React.ReactNode
}

export function RequireRole({ roles, children }: RequireRoleProps) {
  const { rol, loading, user } = useCurrentUser()

  const hasAccess = !loading && rol !== null && roles.includes(rol)

  useEffect(() => {
    if (!loading && user && !hasAccess) {
      toast.error('No tenés acceso a esta sección')
    }
  }, [loading, user, hasAccess])

  if (loading) return null

  if (!user) return <Navigate to="/login" replace />

  if (!hasAccess) return <Navigate to="/" replace />

  return <>{children}</>
}
