import { Link } from 'react-router-dom'
import { Users, Calendar, Star } from 'lucide-react'

const CARDS = [
  {
    to:          '/admin/publicadores',
    icon:        Users,
    label:       'Publicadores',
    description: 'Gestionar publicadores, roles y estado',
  },
  {
    to:          '/entre-semana',
    icon:        Calendar,
    label:       'Entre semana',
    description: 'Asignar partes del programa semanal',
  },
  {
    to:          '/fin-de-semana',
    icon:        Star,
    label:       'Fin de semana',
    description: 'Asignar partes del programa dominical',
  },
]

export function AdminPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Administración</h1>
        <p className="text-sm text-muted-foreground">Accesos rápidos para la gestión de la congregación</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(({ to, icon: Icon, label, description }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col gap-3 rounded-lg border p-5 transition-colors hover:bg-accent hover:border-accent-foreground/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold text-sm">{label}</span>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
