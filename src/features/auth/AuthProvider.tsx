import { createContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/core/supabase/client'
import type { Publicador, PublicadorRol } from '@/core/supabase/types'

interface AuthContextValue {
  user:       User | null
  session:    Session | null
  publicador: Publicador | null
  rol:        PublicadorRol | null
  loading:    boolean
}

export const AuthContext = createContext<AuthContextValue>({
  user:       null,
  session:    null,
  publicador: null,
  rol:        null,
  loading:    true,
})

async function fetchPublicador(email: string): Promise<Publicador | null> {
  const { data, error } = await supabase
    .from('publicadores')
    .select('*')
    .eq('email', email)
    .eq('activo', true)
    .maybeSingle()

  if (error) {
    console.error('Error fetching publicador:', error)
    return null
  }
  return data as Publicador | null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]             = useState<User | null>(null)
  const [session, setSession]       = useState<Session | null>(null)
  const [publicador, setPublicador] = useState<Publicador | null>(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    // Carga sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user?.email) {
        fetchPublicador(session.user.email).then((p) => {
          setPublicador(p)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    // Suscripción a cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user?.email) {
          const p = await fetchPublicador(session.user.email)
          setPublicador(p)
        } else {
          setPublicador(null)
        }
        setLoading(false)
      },
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, publicador, rol: publicador?.rol ?? null, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
