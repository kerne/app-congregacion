import { useContext } from 'react'
import { CongregacionContext } from './CongregacionProvider'

export function useCongregacion() {
  const ctx = useContext(CongregacionContext)

  return {
    ...ctx,
    isAdmin: () => ctx.rol === 'admin',
    isEditor: () => ctx.rol === 'editor' || ctx.rol === 'admin',
  }
}
