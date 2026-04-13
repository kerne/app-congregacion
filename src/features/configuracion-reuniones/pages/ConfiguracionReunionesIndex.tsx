import { Link } from 'react-router-dom'
import { Calendar, Star } from 'lucide-react'

const CARDS = [
  {
    to: '/admin/configuracion-reuniones/entre-semana',
    icon: Calendar,
    title: 'Entre Semana',
    description: 'Configurá las asignaciones de la reunión entre semana.',
  },
  {
    to: '/admin/configuracion-reuniones/fin-de-semana',
    icon: Star,
    title: 'Fin de Semana',
    description: 'Configurá las asignaciones de la reunión de fin de semana.',
  },
]

export function ConfiguracionReunionesIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración de Reuniones</h1>
        <p className="text-sm text-muted-foreground">
          Seleccioná qué reunión querés configurar.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group flex flex-col gap-3 rounded-lg border bg-background p-6 shadow-sm transition-colors hover:border-primary hover:bg-accent"
          >
            <card.icon className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-lg font-semibold group-hover:text-primary">{card.title}</h2>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
