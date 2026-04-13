import { Menu, LogOut, LogIn } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import { supabase } from '@/core/supabase/client'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface HeaderProps {
  onMenuClick: () => void
}

const ROL_LABELS: Record<string, string> = {
  admin:      'Admin',
  editor:     'Editor',
  publicador: 'Publicador',
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, rol } = useCurrentUser()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      localStorage.removeItem('congregacion_activa')
      toast.success('Sesión cerrada')
      navigate('/login')
    } catch (err) {
      console.error('signOut error:', err)
      toast.error('Error al cerrar sesión')
    }
  }

  const displayName = user?.user_metadata?.full_name
    ?? user?.email
    ?? 'Visitante'

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 gap-4">
      {/* Hamburger (mobile) */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      {/* Usuario */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium">{displayName}</span>
              {rol && (
                <Badge variant="secondary" className="text-xs h-5">
                  {ROL_LABELS[rol] ?? rol}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Cerrar sesión">
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/login')}>
            <LogIn className="h-4 w-4" />
            Iniciar sesión
          </Button>
        )}
      </div>
    </header>
  )
}
