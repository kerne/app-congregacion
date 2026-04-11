import { useContext } from 'react'
import { AuthContext } from './AuthProvider'

export function useCurrentUser() {
  const ctx = useContext(AuthContext)

  return {
    ...ctx,
    isAdmin:      () => ctx.rol === 'admin',
    isEditor:     () => ctx.rol === 'editor' || ctx.rol === 'admin',
    isPublicador: () => ctx.rol !== null,
    isAnon:       () => ctx.user === null,
  }
}
