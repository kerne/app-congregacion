import { Pencil, UserCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/utils/cn'
import type { ParteSemana, SeccionSemana } from '@/core/config/programa-semana'
import { SECCION_COLORS } from '@/core/config/programa-semana'
import type { AsignacionSemana } from '@/core/supabase/types'

interface ParteRowProps {
  parte:          ParteSemana
  asignacion?:    AsignacionSemana       // sala principal (o sin sala)
  asignacionB?:   AsignacionSemana       // sala B
  canEdit:        boolean
  onEdit:         (parte: ParteSemana, asignacion?: AsignacionSemana, salaHint?: 'principal' | 'B') => void
  seccion:        SeccionSemana
  embedded?:      { parte: ParteSemana; asignacion?: AsignacionSemana }[]
}

// ── Persona asignada (una línea) ─────────────────────────────────────────────

function PersonaLine({ asignacion }: { asignacion: AsignacionSemana }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-sm">
        <UserCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="font-medium">
          {asignacion.asignado
            ? `${asignacion.asignado.apellido}, ${asignacion.asignado.nombre}`
            : <span className="text-muted-foreground italic">Sin asignar</span>}
        </span>
      </div>
      {asignacion.asistente && (
        <div className="flex items-center gap-1.5 text-xs text-foreground/70 pl-5">
          <UserCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{asignacion.asistente.apellido}, {asignacion.asistente.nombre}</span>
        </div>
      )}
    </div>
  )
}

// ── Slot de sala (principal o B) — siempre visible para tieneSala ────────────

function SalaSlot({
  label,
  asignacion,
  canEdit,
  onEditClick,
}: {
  label: string
  asignacion?: AsignacionSemana
  canEdit: boolean
  onEditClick: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-1 first:pt-0 last:pb-0">
      <div className="flex items-start gap-2 min-w-0">
        <span className="text-xs text-muted-foreground shrink-0 pt-0.5 w-20">{label}</span>
        <div className="min-w-0">
          {asignacion
            ? <PersonaLine asignacion={asignacion} />
            : canEdit
              ? <Badge variant="warning" className="text-xs">Pendiente</Badge>
              : null}
        </div>
      </div>
      {canEdit && (
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={onEditClick} title={`Asignar ${label}`}>
          <Pencil className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

// ── Display para partes sin sala (comportamiento original) ───────────────────

function AsignadoSimple({
  asignacion,
  canEdit,
}: {
  asignacion?: AsignacionSemana
  canEdit: boolean
}) {
  if (asignacion) return <PersonaLine asignacion={asignacion} />
  if (canEdit) return <Badge variant="warning" className="text-xs">Pendiente</Badge>
  return null
}

// ── Row principal ─────────────────────────────────────────────────────────────

export function ParteRow({ parte, asignacion, asignacionB, canEdit, onEdit, seccion, embedded }: ParteRowProps) {
  const colors = SECCION_COLORS[seccion]

  const temaDisplay = asignacion?.tema ?? asignacionB?.tema

  return (
    <tr
      className={cn(
        'md:table-row md:border-t md:border-l-0 md:rounded-none md:shadow-none md:mx-0 md:my-0',
        colors.row,
        'block mx-3 my-1.5 rounded-lg border border-l-4 shadow-sm overflow-hidden transition-colors',
        colors.border,
        parte.opcional && 'opacity-75',
      )}
    >
      {/* Parte + tema */}
      <td className="block md:table-cell px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {temaDisplay ? (
              <div>
                <span className="text-sm font-medium">{temaDisplay}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-muted-foreground">{parte.nombre}</span>
                  {parte.opcional && <span className="text-xs text-muted-foreground">(opcional)</span>}
                  {parte.duracionMin > 0 && (
                    <span className="text-xs text-muted-foreground hidden md:inline">· {parte.duracionMin} min</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{parte.nombre}</span>
                {parte.opcional && <span className="text-xs text-muted-foreground">(opcional)</span>}
                {parte.duracionMin > 0 && (
                  <span className="text-xs text-muted-foreground hidden md:inline">{parte.duracionMin} min</span>
                )}
              </div>
            )}
          </div>

          {/* Botón editar mobile — solo para partes sin sala */}
          {canEdit && !parte.tieneSala && (
            <div className="md:hidden shrink-0 -mt-0.5 -mr-1">
              <Button variant="ghost" size="icon" className="h-7 w-7"
                onClick={() => onEdit(parte, asignacion)} title="Asignar">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Asignado mobile */}
        <div className="md:hidden mt-2 pt-2 border-t border-border/40">
          {parte.tieneSala ? (
            <div className="space-y-1 divide-y divide-border/30">
              <SalaSlot
                label="Principal"
                asignacion={asignacion}
                canEdit={canEdit}
                onEditClick={() => onEdit(parte, asignacion, 'principal')}
              />
              <SalaSlot
                label="Sala B"
                asignacion={asignacionB}
                canEdit={canEdit}
                onEditClick={() => onEdit(parte, asignacionB, 'B')}
              />
            </div>
          ) : (
            <AsignadoSimple asignacion={asignacion} canEdit={canEdit} />
          )}
        </div>

        {/* Partes embebidas mobile */}
        {embedded && embedded.length > 0 && (
          <div className="md:hidden mt-2 space-y-2">
            {embedded.map(({ parte: ep, asignacion: ea }) => (
              <div key={ep.id} className="pt-2 border-t border-border/40">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{ep.nombre}</span>
                  {canEdit && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 -mt-0.5 -mr-1"
                      onClick={() => onEdit(ep, ea)} title="Asignar">
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="mt-1">
                  <AsignadoSimple asignacion={ea} canEdit={canEdit} />
                </div>
              </div>
            ))}
          </div>
        )}
      </td>

      {/* Asignado desktop */}
      <td className="hidden md:table-cell px-4 py-3">
        <div className="space-y-3">
          {parte.tieneSala ? (
            <div className="space-y-1 divide-y divide-border/30">
              <SalaSlot
                label="Principal"
                asignacion={asignacion}
                canEdit={canEdit}
                onEditClick={() => onEdit(parte, asignacion, 'principal')}
              />
              <SalaSlot
                label="Sala B"
                asignacion={asignacionB}
                canEdit={canEdit}
                onEditClick={() => onEdit(parte, asignacionB, 'B')}
              />
            </div>
          ) : (
            <>
              <AsignadoSimple asignacion={asignacion} canEdit={canEdit} />
              {embedded && embedded.map(({ parte: ep, asignacion: ea }) => (
                <div key={ep.id} className="pt-2 border-t border-border/30">
                  <div className="text-xs text-muted-foreground mb-1">{ep.nombre}</div>
                  <AsignadoSimple asignacion={ea} canEdit={canEdit} />
                </div>
              ))}
            </>
          )}
        </div>
      </td>

      {/* Acciones desktop — solo para partes sin sala */}
      {!parte.tieneSala && canEdit && (
        <td className="hidden md:table-cell px-4 py-3 text-right align-top">
          <div className="space-y-3">
            <Button variant="ghost" size="icon" className="h-8 w-8"
              onClick={() => onEdit(parte, asignacion)} title="Asignar">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            {embedded && embedded.map(({ parte: ep, asignacion: ea }) => (
              <div key={ep.id} className="pt-2 border-t border-border/30 flex justify-end">
                <Button variant="ghost" size="icon" className="h-8 w-8"
                  onClick={() => onEdit(ep, ea)} title="Asignar">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </td>
      )}
      {/* Celda vacía para mantener layout cuando tieneSala (los botones están inline) */}
      {parte.tieneSala && canEdit && <td className="hidden md:table-cell" />}
    </tr>
  )
}
