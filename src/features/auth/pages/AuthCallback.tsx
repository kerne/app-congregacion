import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/core/supabase/client'
import { toast } from 'sonner'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.exchangeCodeForSession(window.location.search)
      .then(({ error }) => {
        if (error) {
          toast.error('Error al autenticar: ' + error.message)
          navigate('/login')
          return
        }
        const returnTo = sessionStorage.getItem('returnTo') ?? '/'
        sessionStorage.removeItem('returnTo')
        navigate(returnTo, { replace: true })
      })
      .catch((err) => {
        console.error('exchangeCodeForSession error:', err)
        toast.error('Error inesperado al autenticar')
        navigate('/login')
      })
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
