import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/core/supabase/client'
import { toast } from 'sonner'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    async function handleSignIn(userId: string) {
      const { data: miembros } = await supabase
        .from('miembros')
        .select('id')
        .eq('user_id', userId)
        .eq('activo', true)
        .limit(1)

      if (!miembros || miembros.length === 0) {
        navigate('/onboarding', { replace: true })
        return
      }

      const returnTo = sessionStorage.getItem('returnTo') ?? '/'
      sessionStorage.removeItem('returnTo')
      navigate(returnTo, { replace: true })
    }

    // La sesión puede ya existir si Supabase hizo el exchange antes de que
    // montara el componente — en ese caso onAuthStateChange nunca dispara SIGNED_IN
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) handleSignIn(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          handleSignIn(session.user.id)
        }
      },
    )

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
