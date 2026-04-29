import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { NavSemana } from '@/shared/components/NavSemana'
import { ModalAsignacion } from '@/shared/components/ModalAsignacion'
import { TableSkeleton } from '@/shared/components/TableSkeleton'
import { EmptyState } from '@/shared/components/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { ProgramaSemanaView } from '../components/ProgramaSemanaView'
import { useProgramaSemana, useUpsertAsignacionSemana, useDeleteAsignacionSemana } from '../hooks'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import { usePublicadores } from '@/features/publicadores/hooks'
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

export function EntreSemana() {
  const [semana, setSemana] = useState(() => toISODate(getLunesDeSemana(new Date())))
  const [modal, setModal]   = useState<{ parte: ParteSemana; asignacion?: AsignacionSemana; salaHint?: 'principal' | 'B' } | null>(null)

  const { isEditor, loading } = useCurrentUser()
  const { data: asignaciones = [], isLoading, isError, refetch } = useProgramaSemana(semana)
  const { data: publicadores = [] } = usePublicadores(true)
  const upsert  = useUpsertAsignacionSemana()
  const eliminar = useDeleteAsignacionSemana()

  const publicadoresPublicos: PublicadorPublico[] = publicadores.map(
    ({ id, nombre, apellido, rol, cargo }) => ({ id, nombre, apellido, rol, cargo }),
  )

  function handleEdit(parte: ParteSemana, asignacion?: AsignacionSemana, salaHint?: 'principal' | 'B') {
    setModal({ parte, asignacion, salaHint })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Reunión Entre Semana</h1>
            {!loading && !isEditor() && (
              <Badge variant="secondary">Solo lectura</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground capitalize">
            {formatRangoSemana(parseFecha(semana))}
          </p>
        </div>
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
          description="Hubo un error al cargar los datos. Verificá tu conexión e intentá nuevamente."
          action={<Button variant="outline" onClick={() => refetch()}>Reintentar</Button>}
        />
      ) : (
        <ProgramaSemanaView
          asignaciones={asignaciones}
          canEdit={isEditor()}
          onEdit={handleEdit}
          emptyMessage={
            isEditor()
              ? 'No hay asignaciones — empezá asignando partes'
              : 'El programa de esta semana no está disponible aún'
          }
        />
      )}

      {modal && (
        <ModalAsignacion
          open={!!modal}
          onClose={() => setModal(null)}
          parte={modal.parte}
          asignacionActual={modal.asignacion ?? (modal.salaHint ? { sala: modal.salaHint } : undefined)}
          publicadores={publicadoresPublicos}
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
