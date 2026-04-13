import { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import { CongregacionContext } from '@/features/congregacion/CongregacionProvider'

export function useCurrentUser() {
  const auth = useContext(AuthContext)
  const cong = useContext(CongregacionContext)

  return {
    user: auth.user,
    session: auth.session,
    loading: auth.loading || cong.loading,
    rol: cong.rol,
    congregacionId: cong.congregacionId,
    congregacion: cong.congregacion,
    miembro: cong.miembro,
    needsOnboarding: cong.needsOnboarding,
    isAdmin:      () => cong.rol === 'admin',
    isEditor:     () => cong.rol === 'editor' || cong.rol === 'admin',
    isPublicador: () => cong.rol !== null,
    isAnon:       () => auth.user === null,
  }
}
