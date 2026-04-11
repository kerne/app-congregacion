import { useState } from 'react'
import { NavSemana } from '@/shared/components/NavSemana'
import { ModalAsignacion } from '@/shared/components/ModalAsignacion'
import { TableSkeleton } from '@/shared/components/TableSkeleton'
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

  const { isEditor } = useCurrentUser()
  const { data: asignaciones = [], isLoading } = useProgramaFDS(fecha)
  const { data: publicadores = [] }            = usePublicadores(true)
  const upsert  = useUpsertAsignacionFDS(fecha)
  const eliminar = useDeleteAsignacionFDS(fecha)

  const publicadoresPublicos: PublicadorPublico[] = publicadores.map(
    ({ id, nombre, apellido, rol }) => ({ id, nombre, apellido, rol }),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Reunión Fin de Semana</h1>
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
      ) : (
        <ProgramaFDSView
          asignaciones={asignaciones}
          canEdit={isEditor()}
          onEdit={(parte, asignacion) => setModal({ parte, asignacion })}
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
              parteId:      modal.parte.id,
              data,
              asignacionId: modal.asignacion?.id,
            })
          }
          onDelete={
            modal.asignacion
              ? () => eliminar.mutateAsync(modal.asignacion!.id)
              : undefined
          }
          isSaving={upsert.isPending}
          isDeleting={eliminar.isPending}
        />
      )}
    </div>
  )
}
