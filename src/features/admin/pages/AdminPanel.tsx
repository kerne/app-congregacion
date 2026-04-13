import { Link } from 'react-router-dom'
import { Users, Calendar, Star, Clock, Link2 } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { useCongregacion } from '@/features/congregacion/useCongregacion'
import { toast } from 'sonner'
import { useProgramaSemana } from '@/features/programa/semana/hooks'
import { useProgramaFDS } from '@/features/programa/fds/hooks'
import { PROGRAMA_SEMANA } from '@/core/config/programa-semana'
import { PROGRAMA_FDS } from '@/core/config/programa-fds'
import { getLunesDeSemana, getProximoDomingo, toISODate } from '@/shared/utils/fechas'

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
  const { congregacion } = useCongregacion()
  const semanaActual   = toISODate(getLunesDeSemana(new Date()))
  const proximoDomingo = toISODate(getProximoDomingo(new Date()))

  const { data: asignacionesES  = [], isLoading: loadingES  } = useProgramaSemana(semanaActual)
  const { data: asignacionesFDS = [], isLoading: loadingFDS } = useProgramaFDS(proximoDomingo)

  const asigIdsES  = new Set(asignacionesES.map((a) => a.parte_id))
  const asigIdsFDS = new Set(asignacionesFDS.map((a) => a.parte_id))

  const pendientesES  = PROGRAMA_SEMANA.filter((p) => !asigIdsES.has(p.id)).length
  const pendientesFDS = PROGRAMA_FDS.filter((p) => !asigIdsFDS.has(p.id)).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Administración</h1>
        <p className="text-sm text-muted-foreground">Accesos rápidos para la gestión de la congregación</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Esta semana:</span>
          {loadingES ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            <Badge variant={pendientesES > 0 ? 'warning' : 'success'}>
              {pendientesES === 0
                ? 'Todo asignado'
                : `${pendientesES} pendiente${pendientesES !== 1 ? 's' : ''}`}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
          <Star className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Este domingo:</span>
          {loadingFDS ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            <Badge variant={pendientesFDS > 0 ? 'warning' : 'success'}>
              {pendientesFDS === 0
                ? 'Todo asignado'
                : `${pendientesFDS} pendiente${pendientesFDS !== 1 ? 's' : ''}`}
            </Badge>
          )}
        </div>
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

      {/* Link público */}
      {congregacion?.slug && (
        <div className="rounded-lg border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">Link público</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Compartí este link para que los publicadores vean el programa sin necesidad de registrarse.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-muted px-3 py-2 rounded-md truncate">
              {`${window.location.origin}/c/${congregacion.slug}/entre-semana`}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/c/${congregacion.slug}/entre-semana`
                )
                toast.success('Link copiado al portapapeles')
              }}
            >
              Copiar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
