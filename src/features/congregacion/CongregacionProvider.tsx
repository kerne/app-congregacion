import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/core/supabase/client'
import type { Congregacion, Miembro, MiembroRol } from '@/core/supabase/types'
import { AuthContext } from '@/features/auth/AuthProvider'

interface CongregacionContextValue {
  congregacionId: string | null
  congregacion: Congregacion | null
  miembro: Miembro | null
  rol: MiembroRol | null
  loading: boolean
  needsOnboarding: boolean
  switchCongregacion: (id: string) => void
}

export const CongregacionContext = createContext<CongregacionContextValue>({
  congregacionId: null,
  congregacion: null,
  miembro: null,
  rol: null,
  loading: true,
  needsOnboarding: false,
  switchCongregacion: () => {},
})

const STORAGE_KEY = 'congregacion_activa'

async function fetchMiembros(userId: string): Promise<Miembro[]> {
  const { data, error } = await supabase
    .from('miembros')
    .select('*, congregacion:congregacion_id(*)')
    .eq('user_id', userId)
    .eq('activo', true)

  if (error) {
    console.error('Error fetching miembros:', error)
    return []
  }
  return (data ?? []) as Miembro[]
}

export function CongregacionProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [miembros, setMiembros] = useState<Miembro[]>([])
  const [activeMiembro, setActiveMiembro] = useState<Miembro | null>(null)
  const [loading, setLoading] = useState(true)

  const switchCongregacion = useCallback((congregacionId: string) => {
    const found = miembros.find((m) => m.congregacion_id === congregacionId)
    if (found) {
      setActiveMiembro(found)
      localStorage.setItem(STORAGE_KEY, congregacionId)
    }
  }, [miembros])

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setMiembros([])
      setActiveMiembro(null)
      setLoading(false)
      return
    }

    fetchMiembros(user.id).then((result) => {
      setMiembros(result)

      if (result.length === 0) {
        setActiveMiembro(null)
        setLoading(false)
        return
      }

      // Restaurar congregación guardada o usar la primera
      const saved = localStorage.getItem(STORAGE_KEY)
      const restored = saved ? result.find((m) => m.congregacion_id === saved) : null
      setActiveMiembro(restored ?? result[0])
      setLoading(false)
    })
  }, [user, authLoading])

  const congregacion = activeMiembro?.congregacion ?? null
  const needsOnboarding = !authLoading && !loading && user !== null && miembros.length === 0

  return (
    <CongregacionContext.Provider
      value={{
        congregacionId: activeMiembro?.congregacion_id ?? null,
        congregacion,
        miembro: activeMiembro,
        rol: activeMiembro?.rol ?? null,
        loading: loading || authLoading,
        needsOnboarding,
        switchCongregacion,
      }}
    >
      {children}
    </CongregacionContext.Provider>
  )
}
