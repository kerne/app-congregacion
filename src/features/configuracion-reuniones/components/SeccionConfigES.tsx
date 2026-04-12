import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { NavSemana } from '@/shared/components/NavSemana'
import { ModalAsignacion } from '@/shared/components/ModalAsignacion'
import { TableSkeleton } from '@/shared/components/TableSkeleton'
import { EmptyState } from '@/shared/components/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { ProgramaSemanaView } from '@/features/programa/semana/components/ProgramaSemanaView'
import { useProgramaSemana, useUpsertAsignacionSemana, useDeleteAsignacionSemana } from '@/features/programa/semana/hooks'
import {
  getLunesDeSemana,
  siguienteSemana,
  semanaAnterior,
  toISODate,
  formatRangoSemana,
  parseFecha,
} from '@/shared/utils/fechas'
import type { ParteSemana } from '@/core/config/programa-semana'
import type { AsignacionSemana, PublicadorPublico } from '@/core/supabase/types'

interface SeccionConfigESProps {
  publicadores: PublicadorPublico[]
}

export function SeccionConfigES({ publicadores }: SeccionConfigESProps) {
  const [semana, setSemana] = useState(() => toISODate(getLunesDeSemana(new Date())))
  const [modal, setModal]   = useState<{ parte: ParteSemana; asignacion?: AsignacionSemana } | null>(null)

  const { data: asignaciones = [], isLoading, isError, refetch } = useProgramaSemana(semana)
  const upsert   = useUpsertAsignacionSemana()
  const eliminar = useDeleteAsignacionSemana()

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold">Entre Semana</h2>
        <NavSemana
          label={formatRangoSemana(parseFecha(semana))}
          onPrev={() => setSemana(toISODate(semanaAnterior(parseFecha(semana))))}
          onNext={() => setSemana(toISODate(siguienteSemana(parseFecha(semana))))}
          onHoy={() => setSemana(toISODate(getLunesDeSemana(new Date())))}
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} cols={3} />
      ) : isError ? (
        <EmptyState
          icon={AlertCircle}
          title="No se pudo cargar el programa"
          description="Verificá tu conexión e intentá nuevamente."
          action={<Button variant="outline" onClick={() => refetch()}>Reintentar</Button>}
        />
      ) : (
        <ProgramaSemanaView
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
              semana,
              parteId:      modal.parte.id,
              data,
              asignacionId: modal.asignacion?.id,
            })
          }
          onDelete={
            modal.asignacion
              ? () => eliminar.mutateAsync({ id: modal.asignacion!.id, semana })
              : undefined
          }
          isSaving={upsert.isPending}
          isDeleting={eliminar.isPending}
        />
      )}
    </div>
  )
}
