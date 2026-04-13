import { Calendar, Star, BookOpen, Users, LayoutGrid } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/shared/components/ui/badge'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import { useMyPublicador } from '@/features/congregacion/useMyPublicador'

interface QuickCard {
  to: string
  icon: React.ElementType
  label: string
  description: string
  role?: 'auth' | 'admin'
}

const QUICK_CARDS: QuickCard[] = [
  {
    to: '/entre-semana',
    icon: Calendar,
    label: 'Entre Semana',
    description: 'Programa de la reunión entre semana',
  },
  {
    to: '/fin-de-semana',
    icon: Star,
    label: 'Fin de Semana',
    description: 'Programa de la reunión de fin de semana',
  },
  {
    to: '/mis-asignaciones',
    icon: BookOpen,
    label: 'Mis Asignaciones',
    description: 'Consultá tus próximas asignaciones',
    role: 'auth',
  },
  {
    to: '/admin/publicadores',
    icon: Users,
    label: 'Publicadores',
    description: 'Gestionar publicadores, roles y estado',
    role: 'admin',
  },
  {
    to: '/admin',
    icon: LayoutGrid,
    label: 'Administración',
    description: 'Panel de administración de la congregación',
    role: 'admin',
  },
]

export function Dashboard() {
  const { user, isAdmin } = useCurrentUser()
  const { data: myPublicador } = useMyPublicador()

  const displayName = myPublicador?.nombre
    ?? user?.user_metadata?.full_name?.split(' ')[0]
    ?? user?.email?.split('@')[0]

  const visibleCards = QUICK_CARDS.filter((card) => {
    if (card.role === 'auth' && !user) return false
    if (card.role === 'admin' && !isAdmin()) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {user ? `Hola, ${displayName}` : 'Programa de Reuniones'}
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumen de la congregación
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCards.map(({ to, icon: Icon, label, description, role }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col gap-3 rounded-lg border p-5 transition-colors hover:bg-accent hover:border-accent-foreground/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{label}</span>
                {role === 'admin' && (
                  <Badge variant="secondary" className="text-[10px] h-4">Admin</Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
