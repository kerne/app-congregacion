import { BookOpen } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { EmptyState } from '@/shared/components/EmptyState'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import { useMisAsignaciones } from '../hooks'
import { AsignacionesSkeleton } from '../components/AsignacionesSkeleton'
import { formatFechaCorta, parseFecha } from '@/shared/utils/fechas'
import type { AsignacionPersonal } from '@/core/supabase/types'

function AsignacionCard({ a }: { a: AsignacionPersonal }) {
  return (
    <div className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
      <div className="space-y-1">
        <p className="text-sm font-medium">{a.parte_nombre}</p>
        {a.tema && <p className="text-xs text-muted-foreground italic">"{a.tema}"</p>}
        <div className="flex items-center gap-2">
          <Badge variant={a.tipo === 'semana' ? 'secondary' : 'outline'} className="text-xs">
            {a.tipo === 'semana' ? 'Entre semana' : 'Fin de semana'}
          </Badge>
          <Badge variant={a.rol === 'principal' ? 'default' : 'secondary'} className="text-xs">
            {a.rol === 'principal' ? 'Principal' : 'Asistente'}
          </Badge>
        </div>
      </div>
      <div className="text-right shrink-0 ml-3">
        <p className="text-sm font-medium capitalize">{formatFechaCorta(parseFecha(a.fecha))}</p>
      </div>
    </div>
  )
}

export function MisAsignaciones() {
  const { publicador } = useCurrentUser()
  const { data: asignaciones = [], isLoading } = useMisAsignaciones(publicador?.id)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Mis Asignaciones</h1>
        <p className="text-sm text-muted-foreground">Tus próximas participaciones en las reuniones</p>
      </div>

      {isLoading ? (
        <AsignacionesSkeleton />
      ) : asignaciones.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No tenés asignaciones próximas"
          description="No hay partes asignadas para las próximas semanas. El editor te notificará cuando tengas una."
        />
      ) : (
        <div className="space-y-2">
          {asignaciones.map((a) => (
            <AsignacionCard key={`${a.tipo}-${a.id}`} a={a} />
          ))}
        </div>
      )}
    </div>
  )
}
