import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { NavSemana } from '@/shared/components/NavSemana'
import { ModalAsignacion } from '@/shared/components/ModalAsignacion'
import { TableSkeleton } from '@/shared/components/TableSkeleton'
import { EmptyState } from '@/shared/components/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { ProgramaFDSView } from '../components/ProgramaFDSView'
import { useProgramaFDS, useUpsertAsignacionFDS, useDeleteAsignacionFDS } from '../hooks'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import { usePublicadores } from '@/features/publicadores/hooks'
import {
  getProximoDomingo,
  siguienteDomingo,
  domingoAnterior,
  toISODate,
  formatDomingo,
  parseFecha,
} from '@/shared/utils/fechas'
import type { ParteFDS } from '@/core/config/programa-fds'
import type { AsignacionFDS, PublicadorPublico } from '@/core/supabase/types'

export function FinDeSemana() {
  const [fecha, setFecha] = useState(() => toISODate(getProximoDomingo(new Date())))
  const [modal, setModal] = useState<{ parte: ParteFDS; asignacion?: AsignacionFDS } | null>(null)

  const { isAdmin, loading } = useCurrentUser()
  const { data: asignaciones = [], isLoading, isError, refetch } = useProgramaFDS(fecha)
  const { data: publicadores = [] } = usePublicadores(true)
  const upsert  = useUpsertAsignacionFDS()
  const eliminar = useDeleteAsignacionFDS()

  const publicadoresPublicos: PublicadorPublico[] = publicadores.map(
    ({ id, nombre, apellido, rol }) => ({ id, nombre, apellido, rol }),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Reunión Fin de Semana</h1>
            {!loading && !isAdmin() && (
              <Badge variant="secondary">Solo lectura</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground capitalize">
            {formatDomingo(parseFecha(fecha))}
          </p>
        </div>
        <NavSemana
          label={formatDomingo(parseFecha(fecha))}
          onPrev={() => setFecha(toISODate(domingoAnterior(parseFecha(fecha))))}
          onNext={() => setFecha(toISODate(siguienteDomingo(parseFecha(fecha))))}
          onHoy={() => setFecha(toISODate(getProximoDomingo(new Date())))}
          labelHoy="Este domingo"
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={3} />
      ) : isError ? (
        <EmptyState
          icon={AlertCircle}
          title="No se pudo cargar el programa"
          description="Hubo un error al cargar los datos. Verificá tu conexión e intentá nuevamente."
          action={<Button variant="outline" onClick={() => refetch()}>Reintentar</Button>}
        />
      ) : (
        <ProgramaFDSView
          asignaciones={asignaciones}
          canEdit={isAdmin()}
          onEdit={(parte, asignacion) => setModal({ parte, asignacion })}
          emptyMessage={
            isAdmin()
              ? 'No hay asignaciones — empezá asignando partes'
              : 'El programa de este domingo no está disponible aún'
          }
        />
      )}

      {modal && (
        <ModalAsignacion
          open={!!modal}
          onClose={() => setModal(null)}
          parte={modal.parte}
          asignacionActual={modal.asignacion}
          publicadores={publicadoresPublicos}
          onSave={(data) =>
            upsert.mutateAsync({
              fecha,
              parteId:      modal.parte.id,
              data,
              asignacionId: modal.asignacion?.id,
            })
          }
          onDelete={
            modal.asignacion
              ? () => eliminar.mutateAsync({ id: modal.asignacion!.id, fecha })
              : undefined
          }
          isSaving={upsert.isPending}
          isDeleting={eliminar.isPending}
        />
      )}
    </div>
  )
}
