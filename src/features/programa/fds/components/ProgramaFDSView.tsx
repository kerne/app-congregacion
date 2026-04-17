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
  emptyMessage?: string
}

export function ProgramaFDSView({ asignaciones, canEdit, onEdit, emptyMessage }: ProgramaFDSViewProps) {
  if (!canEdit && asignaciones.length === 0 && emptyMessage) {
    return (
      <div className="rounded-lg border px-4 py-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  const asigByParteId = Object.fromEntries(asignaciones.map((a) => [a.parte_id, a]))

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
        {SECCIONES_FDS_ORDEN.map((seccion) => {
          const partes = PARTES_FDS_POR_SECCION[seccion] ?? []
          const colors = SECCION_FDS_COLORS[seccion]
          return (
            <tbody key={seccion} className="block md:table-row-group">
              <tr className="block md:table-row">
                <td
                  colSpan={canEdit ? 3 : 2}
                  className={cn('block w-full md:table-cell px-4 py-2 text-xs font-semibold uppercase tracking-wide', colors.header)}
                >
                  {SECCION_FDS_NOMBRES[seccion]}
                </td>
              </tr>
              {partes.map((parte) => {
                const asignacion = asigByParteId[parte.id]
                return (
                  <tr
                    key={parte.id}
                    className={cn(
                      // Desktop: tabla normal
                      'md:table-row md:border-t md:border-l-0 md:rounded-none md:shadow-none md:mx-0 md:my-0',
                      colors.row,
                      // Mobile: card
                      'block mx-3 my-1.5 rounded-lg border border-l-4 shadow-sm overflow-hidden transition-colors',
                      colors.border,
                    )}
                  >
                    {/* Parte + tema — full row en mobile, primera columna en desktop */}
                    <td className="block md:table-cell px-4 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium">{parte.nombre}</span>
                        </div>

                        {/* Botón editar — solo mobile */}
                        {canEdit && (
                          <div className="md:hidden shrink-0 -mt-0.5 -mr-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => onEdit(parte, asignacion)}
                              title="Asignar"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Asignado + tema — solo mobile */}
                      <div className="md:hidden mt-2 pt-2 border-t border-border/40">
                        {asignacion ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-sm">
                              <UserCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              {asignacion.orador_nombre ? (
                                <span className="flex items-center gap-1.5 font-medium">
                                  {asignacion.orador_nombre}
                                  <Badge variant="outline" className="text-xs h-4">Invitado</Badge>
                                </span>
                              ) : (
                                <span className="font-medium">
                                  {asignacion.asignado?.apellido}, {asignacion.asignado?.nombre}
                                </span>
                              )}
                            </div>
                            {asignacion.tema && (
                              <div className="text-xs text-muted-foreground italic pl-5">
                                "{asignacion.tema}"
                              </div>
                            )}
                          </div>
                        ) : canEdit ? (
                          <Badge variant="warning" className="text-xs">Pendiente</Badge>
                        ) : null}
                      </div>
                    </td>

                    {/* Asignado — solo desktop */}
                    <td className="hidden md:table-cell px-4 py-3">
                      {asignacion ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-sm">
                            <UserCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            {asignacion.orador_nombre ? (
                              <span className="flex items-center gap-1.5 font-medium">
                                {asignacion.orador_nombre}
                                <Badge variant="outline" className="text-xs h-4">Invitado</Badge>
                              </span>
                            ) : (
                              <span className="font-medium">
                                {asignacion.asignado?.apellido}, {asignacion.asignado?.nombre}
                              </span>
                            )}
                          </div>
                          {asignacion.tema && (
                            <div className="text-xs text-muted-foreground italic pl-5">
                              "{asignacion.tema}"
                            </div>
                          )}
                        </div>
                      ) : canEdit ? (
                        <Badge variant="warning" className="text-xs">Pendiente</Badge>
                      ) : null}
                    </td>

                    {/* Acciones — solo desktop */}
                    {canEdit && (
                      <td className="hidden md:table-cell px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(parte, asignacion)}
                          title="Asignar"
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
