import { Pencil, UserCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/utils/cn'
import type { ParteSemana, SeccionSemana } from '@/core/config/programa-semana'
import { SECCION_COLORS } from '@/core/config/programa-semana'
import type { AsignacionSemana } from '@/core/supabase/types'

interface ParteRowProps {
  parte:          ParteSemana
  asignacion?:    AsignacionSemana
  canEdit:        boolean
  onEdit:         (parte: ParteSemana, asignacion?: AsignacionSemana) => void
  seccion:        SeccionSemana
}

export function ParteRow({ parte, asignacion, canEdit, onEdit, seccion }: ParteRowProps) {
  const colors = SECCION_COLORS[seccion]

  return (
    <tr
      className={cn(
        'border-t transition-colors',
        colors.row,
        parte.opcional && 'opacity-75',
      )}
    >
      {/* Parte */}
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{parte.nombre}</span>
          {parte.opcional && (
            <span className="text-xs text-muted-foreground">(opcional)</span>
          )}
          {parte.duracionMin > 0 && (
            <span className="text-xs text-muted-foreground hidden md:inline">
              {parte.duracionMin} min
            </span>
          )}
        </div>
      </td>

      {/* Asignado */}
      <td className="px-4 py-2.5">
        {asignacion ? (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-sm">
              <UserCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>
                {asignacion.asignado?.apellido}, {asignacion.asignado?.nombre}
              </span>
              {asignacion.sala === 'B' && (
                <Badge variant="outline" className="text-xs h-4">Sala B</Badge>
              )}
            </div>
            {asignacion.asistente && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <UserCircle className="h-3 w-3 shrink-0" />
                Asistente: {asignacion.asistente.apellido}, {asignacion.asistente.nombre}
              </div>
            )}
            {asignacion.tema && (
              <div className="text-xs text-muted-foreground italic truncate max-w-[200px]">
                "{asignacion.tema}"
              </div>
            )}
          </div>
        ) : (
          <Badge variant="warning" className="text-xs">Pendiente</Badge>
        )}
      </td>

      {/* Acciones */}
      {canEdit && (
        <td className="px-4 py-2.5 text-right">
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
}
