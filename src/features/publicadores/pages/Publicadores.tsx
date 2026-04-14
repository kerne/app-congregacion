import { useState, useMemo } from 'react'
import { UserPlus, Pencil, UserCheck, UserX, Users, Search, X } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog'
import { EmptyState } from '@/shared/components/EmptyState'
import { PublicadoresSkeleton } from '../components/PublicadoresSkeleton'
import { usePublicadoresAdmin, useCreatePublicador, useUpdatePublicador, useToggleActivo } from '../hooks'
import type { CargoCongregacion, Publicador, PublicadorRol } from '@/core/supabase/types'

// ─── Schema ────────────────────────────────────────────────────────────────
const schema = z.object({
  nombre:   z.string().min(1, 'Requerido'),
  apellido: z.string().min(1, 'Requerido'),
  email:    z.string().email('Email inválido').optional().or(z.literal('')),
  telefono: z.string().optional(),
  rol:      z.enum(['publicador', 'editor', 'admin']),
  cargo:    z.enum(['anciano', 'siervo_ministerial', 'publicador', 'publicadora']).optional(),
})
type FormData = z.infer<typeof schema>

// ─── Modal ─────────────────────────────────────────────────────────────────
function ModalPublicador({
  open,
  onClose,
  publicador,
}: {
  open: boolean
  onClose: () => void
  publicador?: Publicador
}) {
  const crear    = useCreatePublicador()
  const actualizar = useUpdatePublicador()
  const esEdicion  = !!publicador

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre:   publicador?.nombre   ?? '',
      apellido: publicador?.apellido ?? '',
      email:    publicador?.email    ?? '',
      telefono: publicador?.telefono ?? '',
      rol:      publicador?.rol      ?? 'publicador',
      cargo:    publicador?.cargo    ?? undefined,
    },
  })

  async function onSubmit(data: FormData) {
    if (esEdicion && publicador) {
      await actualizar.mutateAsync({ id: publicador.id, data })
    } else {
      await crear.mutateAsync(data)
    }
    reset()
    onClose()
  }

  const isPending = crear.isPending || actualizar.isPending

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{esEdicion ? 'Editar publicador' : 'Nuevo publicador'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nombre *</Label>
              <Controller control={control} name="nombre"
                render={({ field }) => <Input {...field} />}
              />
              {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Apellido *</Label>
              <Controller control={control} name="apellido"
                render={({ field }) => <Input {...field} />}
              />
              {errors.apellido && <p className="text-xs text-destructive">{errors.apellido.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Email *</Label>
            <Controller control={control} name="email"
              render={({ field }) => <Input type="email" {...field} disabled={esEdicion} />}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Teléfono</Label>
            <Controller control={control} name="telefono"
              render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="+54 11 1234-5678" />}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Cargo en la congregación</Label>
            <Controller control={control} name="cargo"
              render={({ field }) => (
                <Select value={field.value ?? ''} onValueChange={(v) => field.onChange(v || undefined)}>
                  <SelectTrigger><SelectValue placeholder="Sin cargo asignado" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anciano">Anciano</SelectItem>
                    <SelectItem value="siervo_ministerial">Siervo ministerial</SelectItem>
                    <SelectItem value="publicador">Publicador</SelectItem>
                    <SelectItem value="publicadora">Publicadora</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Rol en la app *</Label>
            <Controller control={control} name="rol"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publicador">Publicador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────
const ROL_VARIANT: Record<PublicadorRol, 'default' | 'secondary' | 'warning'> = {
  admin:      'default',
  editor:     'warning',
  publicador: 'secondary',
}

const CARGO_LABEL: Record<CargoCongregacion, string> = {
  anciano:           'Anciano',
  siervo_ministerial: 'Siervo min.',
  publicador:        'Publicador',
  publicadora:       'Publicadora',
}

export function Publicadores() {
  const [showInactivos, setShowInactivos] = useState(false)
  const [modalOpen, setModalOpen]         = useState(false)
  const [editando, setEditando]           = useState<Publicador | undefined>()
  const [searchQuery, setSearchQuery]     = useState('')
  const [rolFilter, setRolFilter]         = useState<PublicadorRol | 'todos'>('todos')

  const { data: publicadores = [], isLoading } = usePublicadoresAdmin(!showInactivos)
  const toggleActivo = useToggleActivo()

  const publicadoresFiltrados = useMemo(() => {
    return publicadores.filter((p) => {
      const matchNombre = `${p.nombre} ${p.apellido}`.toLowerCase().includes(searchQuery.toLowerCase())
      const matchRol    = rolFilter === 'todos' || p.rol === rolFilter
      return matchNombre && matchRol
    })
  }, [publicadores, searchQuery, rolFilter])

  const hayFiltrosActivos = searchQuery !== '' || rolFilter !== 'todos'

  function handleEditar(p: Publicador) {
    setEditando(p)
    setModalOpen(true)
  }

  function handleNuevo() {
    setEditando(undefined)
    setModalOpen(true)
  }

  function limpiarFiltros() {
    setSearchQuery('')
    setRolFilter('todos')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Publicadores</h1>
          <p className="text-sm text-muted-foreground">Gestión de miembros de la congregación</p>
        </div>
        <Button onClick={handleNuevo}>
          <UserPlus className="h-4 w-4" />
          Nuevo publicador
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={rolFilter} onValueChange={(v) => setRolFilter(v as PublicadorRol | 'todos')}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los roles</SelectItem>
            <SelectItem value="publicador">Publicador</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
          <input
            type="checkbox"
            checked={showInactivos}
            onChange={(e) => setShowInactivos(e.target.checked)}
            className="rounded"
          />
          Mostrar inactivos
        </label>
      </div>

      {/* Contador */}
      {!isLoading && publicadores.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {hayFiltrosActivos
            ? `${publicadoresFiltrados.length} de ${publicadores.length} publicadores`
            : `${publicadores.length} publicadores`}
        </p>
      )}

      {/* Tabla */}
      {isLoading ? (
        <PublicadoresSkeleton />
      ) : publicadores.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No hay publicadores"
          description="Agregá el primer publicador para comenzar"
          action={<Button onClick={handleNuevo}><UserPlus className="h-4 w-4" />Nuevo publicador</Button>}
        />
      ) : publicadoresFiltrados.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Sin resultados"
          description="No se encontraron publicadores para tu búsqueda"
          action={
            <Button variant="outline" onClick={limpiarFiltros}>
              <X className="h-4 w-4" />
              Limpiar búsqueda
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Nombre</th>
                <th className="text-left p-3 font-medium hidden sm:table-cell">Email</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Cargo</th>
                <th className="text-left p-3 font-medium">Rol app</th>
                <th className="text-left p-3 font-medium">Estado</th>
                <th className="text-right p-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {publicadoresFiltrados.map((p) => (
                <tr key={p.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{p.apellido}, {p.nombre}</td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">{p.email}</td>
                  <td className="p-3 hidden md:table-cell">
                    {p.cargo ? (
                      <span className="text-sm">{CARGO_LABEL[p.cargo]}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge variant={ROL_VARIANT[p.rol]}>{p.rol}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant={p.activo ? 'success' : 'outline'}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditar(p)} title="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActivo.mutate({ id: p.id, activo: !p.activo })}
                        title={p.activo ? 'Desactivar' : 'Activar'}
                      >
                        {p.activo
                          ? <UserX className="h-4 w-4 text-destructive" />
                          : <UserCheck className="h-4 w-4 text-emerald-600" />
                        }
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalPublicador
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        publicador={editando}
      />
    </div>
  )
}
