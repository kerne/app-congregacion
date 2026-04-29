import { PARTES_POR_SECCION, SECCIONES_ORDEN } from '@/core/config/programa-semana'
import type { ParteSemana } from '@/core/config/programa-semana'
import type { AsignacionSemana } from '@/core/supabase/types'
import { SeccionPartes } from './SeccionPartes'

interface ProgramaSemanaViewProps {
  asignaciones: AsignacionSemana[]
  canEdit:      boolean
  onEdit:       (parte: ParteSemana, asignacion?: AsignacionSemana, salaHint?: 'principal' | 'B') => void
  emptyMessage?: string
}

export function ProgramaSemanaView({ asignaciones, canEdit, onEdit, emptyMessage }: ProgramaSemanaViewProps) {
  if (!canEdit && asignaciones.length === 0 && emptyMessage) {
    return (
      <div className="rounded-lg border px-4 py-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="md:rounded-lg md:border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="hidden md:table-header-group bg-muted/50">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Parte</th>
            <th className="text-left px-4 py-3 font-medium">Asignado</th>
            {canEdit && <th className="w-12" />}
          </tr>
        </thead>
        {SECCIONES_ORDEN.map((seccion) => (
          <SeccionPartes
            key={seccion}
            seccion={seccion}
            partes={PARTES_POR_SECCION[seccion] ?? []}
            asignaciones={asignaciones}
            canEdit={canEdit}
            onEdit={onEdit}
          />
        ))}
      </table>
    </div>
  )
}
