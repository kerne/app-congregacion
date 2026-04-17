import { useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { PublicadorSelector } from './PublicadorSelector'
import type { ParteSemana } from '@/core/config/programa-semana'
import type { ParteFDS } from '@/core/config/programa-fds'
import type { CargoCongregacion, PublicadorPublico } from '@/core/supabase/types'

const schema = z.object({
  asignado_id:   z.string().optional(),
  orador_nombre: z.string().optional(),
  asistente_id:  z.string().optional(),
  tema:          z.string().optional(),
  sala:          z.enum(['principal', 'B']).optional(),
}).refine(
  (d) => d.asignado_id || d.orador_nombre,
  { message: 'Requerido', path: ['orador_nombre'] },
)

export type AsignacionFormData = z.infer<typeof schema>

interface ModalAsignacionProps {
  open: boolean
  onClose: () => void
  parte: ParteSemana | ParteFDS
  asignacionActual?: {
    asignado_id?: string | null
    asistente_id?: string | null
    orador_nombre?: string | null
    tema?: string | null
    sala?: string | null
  }
  publicadores: PublicadorPublico[]
  onSave: (data: AsignacionFormData) => Promise<void>
  onDelete?: () => Promise<void>
  isSaving?: boolean
  isDeleting?: boolean
  cargosAsistente?: CargoCongregacion[]
}

export function ModalAsignacion({
  open,
  onClose,
  parte,
  asignacionActual,
  publicadores,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
  cargosAsistente,
}: ModalAsignacionProps) {
  const tieneOradorManual = 'tieneOradorManual' in parte ? parte.tieneOradorManual : false
  const tieneSala = 'tieneSala' in parte ? parte.tieneSala : false

  const { control, handleSubmit, formState: { errors }, reset } = useForm<AsignacionFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      asignado_id:   asignacionActual?.asignado_id ?? undefined,
      orador_nombre: asignacionActual?.orador_nombre ?? undefined,
      asistente_id:  asignacionActual?.asistente_id ?? undefined,
      tema:          asignacionActual?.tema ?? undefined,
      sala:          (asignacionActual?.sala as 'principal' | 'B' | undefined) ?? undefined,
    },
  })

  const onSubmit = useCallback(async (data: AsignacionFormData) => {
    await onSave(data)
    reset()
    onClose()
  }, [onSave, onClose, reset])

  const handleDelete = useCallback(async () => {
    if (!onDelete) return
    await onDelete()
    reset()
    onClose()
  }, [onDelete, onClose, reset])

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{parte.nombre}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Orador manual (solo para fds_orador) */}
          {tieneOradorManual ? (
            <div className="space-y-1.5">
              <Label>Orador *</Label>
              <Controller
                control={control}
                name="orador_nombre"
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="Nombre del orador..."
                  />
                )}
              />
              {errors.orador_nombre && (
                <p className="text-xs text-destructive">{errors.orador_nombre.message}</p>
              )}
            </div>
          ) : (
            /* Selector de publicadores para todas las demás partes */
            <div className="space-y-1.5">
              <Label>Publicador *</Label>
              <Controller
                control={control}
                name="asignado_id"
                render={({ field }) => (
                  <PublicadorSelector
                    publicadores={publicadores}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    cargosFiltro={parte.cargosPermitidos}
                  />
                )}
              />
              {errors.asignado_id && (
                <p className="text-xs text-destructive">{errors.asignado_id.message}</p>
              )}
            </div>
          )}

          {/* Asistente */}
          {parte.tieneAsistente && (
            <div className="space-y-1.5">
              <Label>Asistente</Label>
              <Controller
                control={control}
                name="asistente_id"
                render={({ field }) => (
                  <PublicadorSelector
                    publicadores={publicadores}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    placeholder="Seleccionar asistente..."
                    cargosFiltro={cargosAsistente}
                  />
                )}
              />
            </div>
          )}

          {/* Tema */}
          {parte.tieneTema && (
            <div className="space-y-1.5">
              <Label>Tema</Label>
              <Controller
                control={control}
                name="tema"
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="Ingresá el tema..."
                  />
                )}
              />
            </div>
          )}

          {/* Sala */}
          {tieneSala && (
            <div className="space-y-1.5">
              <Label>Sala</Label>
              <Controller
                control={control}
                name="sala"
                render={({ field }) => (
                  <Select value={field.value ?? ''} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sala..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="principal">Sala Principal</SelectItem>
                      <SelectItem value="B">Sala B</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            {asignacionActual && onDelete && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting || isSaving}
              >
                <Trash2 className="h-4 w-4" />
                Quitar asignación
              </Button>
            )}
            <div className="flex gap-2 sm:ml-auto">
              <Button type="button" variant="outline" onClick={() => { reset(); onClose() }}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving || isDeleting}>
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
