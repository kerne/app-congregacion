import { SECCION_COLORS, SECCION_NOMBRES } from '@/core/config/programa-semana'
import type { ParteSemana, SeccionSemana } from '@/core/config/programa-semana'
import type { AsignacionSemana } from '@/core/supabase/types'
import { ParteRow } from './ParteRow'
import { cn } from '@/shared/utils/cn'

interface SeccionPartesProps {
  seccion:     SeccionSemana
  partes:      ParteSemana[]
  asignaciones: AsignacionSemana[]
  canEdit:     boolean
  onEdit:      (parte: ParteSemana, asignacion?: AsignacionSemana) => void
}

export function SeccionPartes({ seccion, partes, asignaciones, canEdit, onEdit }: SeccionPartesProps) {
  const colors = SECCION_COLORS[seccion]
  const asigByParteId = Object.fromEntries(
    asignaciones.map((a) => [a.parte_id, a]),
  )

  return (
    <tbody className="block md:table-row-group">
      <tr className="block md:table-row">
        <td
          colSpan={canEdit ? 3 : 2}
          className={cn('block w-full md:table-cell px-4 py-2 text-xs font-semibold uppercase tracking-wide', colors.header)}
        >
          {SECCION_NOMBRES[seccion]}
        </td>
      </tr>
      {partes.map((parte) => (
        <ParteRow
          key={parte.id}
          parte={parte}
          asignacion={asigByParteId[parte.id]}
          canEdit={canEdit}
          onEdit={onEdit}
          seccion={seccion}
        />
      ))}
    </tbody>
  )
}
