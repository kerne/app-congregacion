import { Pencil, UserCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/utils/cn'
import {
  PROGRAMA_FDS,
  PARTES_FDS_POR_SECCION,
  SECCIONES_FDS_ORDEN,
  SECCION_FDS_NOMBRES,
  SECCION_FDS_COLORS,
} from '@/core/config/programa-fds'
import type { ParteFDS } from '@/core/config/programa-fds'
import type { AsignacionFDS } from '@/core/supabase/types'

interface ProgramaFDSViewProps {
  asignaciones: AsignacionFDS[]
  canEdit:      boolean
  onEdit:       (parte: ParteFDS, asignacion?: AsignacionFDS) => void
}

export function ProgramaFDSView({ asignaciones, canEdit, onEdit }: ProgramaFDSViewProps) {
  const asigByParteId = Object.fromEntries(asignaciones.map((a) => [a.parte_id, a]))

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Parte</th>
            <th className="text-left px-4 py-3 font-medium">Asignado</th>
            {canEdit && <th className="w-12" />}
          </tr>
        </thead>
        {SECCIONES_FDS_ORDEN.map((seccion) => {
          const partes = PARTES_FDS_POR_SECCION[seccion] ?? []
          const colors = SECCION_FDS_COLORS[seccion]
          return (
            <tbody key={seccion}>
              <tr>
                <td
                  colSpan={canEdit ? 3 : 2}
                  className={cn('px-4 py-2 text-xs font-semibold uppercase tracking-wide', colors.header)}
                >
                  {SECCION_FDS_NOMBRES[seccion]}
                </td>
              </tr>
              {partes.map((parte) => {
                const asignacion = asigByParteId[parte.id]
                return (
                  <tr
                    key={parte.id}
                    className={cn('border-t transition-colors', colors.row)}
                  >
                    <td className="px-4 py-2.5">
                      <span className="text-sm font-medium">{parte.nombre}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      {asignacion ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-sm">
                            <UserCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            {asignacion.asignado?.nombre} {asignacion.asignado?.apellido}
                          </div>
                          {asignacion.tema && (
                            <div className="text-xs text-muted-foreground italic">
                              "{asignacion.tema}"
                            </div>
                          )}
                        </div>
                      ) : (
                        <Badge variant="warning" className="text-xs">Pendiente</Badge>
                      )}
                    </td>
                    {canEdit && (
                      <td className="px-4 py-2.5 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(parte, asignacion)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          )
        })}
      </table>
    </div>
  )
}

// Re-export PROGRAMA_FDS para uso en la página
export { PROGRAMA_FDS }
