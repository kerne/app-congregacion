import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/core/supabase/client'
import { toast } from 'sonner'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Con detectSessionInUrl: true (default) + flowType: 'pkce',
    // Supabase maneja el intercambio del code automáticamente.
    // Solo escuchamos el evento SIGNED_IN y navegamos.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const returnTo = sessionStorage.getItem('returnTo') ?? '/'
        sessionStorage.removeItem('returnTo')
        navigate(returnTo, { replace: true })
      }
    })

    // Fallback: si el intercambio falla, redirigir al login
    const timeout = setTimeout(() => {
      toast.error('No se pudo completar la autenticación')
      navigate('/login', { replace: true })
    }, 10_000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Iniciando sesión...</p>
      </div>
    </div>
  )
}
