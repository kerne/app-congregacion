import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { NavSemana } from '@/shared/components/NavSemana'
import { ModalAsignacion } from '@/shared/components/ModalAsignacion'
import { TableSkeleton } from '@/shared/components/TableSkeleton'
import { EmptyState } from '@/shared/components/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { ProgramaFDSView } from '@/features/programa/fds/components/ProgramaFDSView'
import { useProgramaFDS, useUpsertAsignacionFDS, useDeleteAsignacionFDS } from '@/features/programa/fds/hooks'
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

interface SeccionConfigFDSProps {
  publicadores: PublicadorPublico[]
}

export function SeccionConfigFDS({ publicadores }: SeccionConfigFDSProps) {
  const [fecha, setFecha] = useState(() => toISODate(getProximoDomingo(new Date())))
  const [modal, setModal] = useState<{ parte: ParteFDS; asignacion?: AsignacionFDS } | null>(null)

  const { data: asignaciones = [], isLoading, isError, refetch } = useProgramaFDS(fecha)
  const upsert   = useUpsertAsignacionFDS()
  const eliminar = useDeleteAsignacionFDS()

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold">Fin de Semana</h2>
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
          description="Verificá tu conexión e intentá nuevamente."
          action={<Button variant="outline" onClick={() => refetch()}>Reintentar</Button>}
        />
      ) : (
        <ProgramaFDSView
          asignaciones={asignaciones}
          canEdit
          onEdit={(parte, asignacion) => setModal({ parte, asignacion })}
        />
      )}

      {modal && (
        <ModalAsignacion
          open={!!modal}
          onClose={() => setModal(null)}
          parte={modal.parte}
          asignacionActual={modal.asignacion}
          publicadores={publicadores}
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
