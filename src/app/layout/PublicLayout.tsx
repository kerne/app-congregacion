import { Outlet, NavLink, Link, useParams, Navigate } from 'react-router-dom'
import { LogIn, Calendar, Star } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/utils/cn'
import { usePublicCongregacion } from '@/features/congregacion/usePublicCongregacion'

export function PublicLayout() {
  const { slug } = useParams<{ slug: string }>()
  const { congregacionId, nombre, isLoading, isError } = usePublicCongregacion(slug)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  if (isError || !congregacionId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Congregación no encontrada</h1>
          <p className="mt-2 text-muted-foreground">El link que seguiste no es válido o fue modificado.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    )
  }

  const tabs = [
    { to: `/c/${slug}/entre-semana`, label: 'Entre Semana', icon: Calendar },
    { to: `/c/${slug}/fin-de-semana`, label: 'Fin de Semana', icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary-foreground">
                  {nombre?.charAt(0)?.toUpperCase() ?? 'C'}
                </span>
              </div>
              <span className="font-semibold text-sm">{nombre}</span>
            </div>
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <Link to="/login">
                <LogIn className="h-4 w-4" />
                Iniciar sesión
              </Link>
            </Button>
          </div>
          <nav className="flex gap-1 -mb-px">
            {tabs.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet context={{ congregacionId, nombre }} />
      </main>
    </div>
  )
}

export function PublicSlugRedirect() {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate to={`/c/${slug}/entre-semana`} replace />
}
