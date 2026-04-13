import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import { crearCongregacion } from '@/features/congregacion/api'

const schema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  numero: z.string().optional(),
  circuito: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function CrearCongregacion() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setSubmitting(true)
    try {
      await crearCongregacion({
        nombre: data.nombre,
        numero: data.numero || null,
        circuito: data.circuito || null,
      })
      toast.success('Congregación creada correctamente')
      // Force reload to re-fetch miembros in CongregacionProvider
      window.location.href = '/'
    } catch (err) {
      toast.error('Error al crear la congregación')
      console.error(err)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/onboarding')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Crear congregación</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la congregación *</Label>
            <Input
              id="nombre"
              placeholder="Ej: Congregación Centro"
              {...register('nombre')}
            />
            {errors.nombre && (
              <p className="text-sm text-destructive">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              placeholder="Ej: 12345"
              {...register('numero')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="circuito">Circuito</Label>
            <Input
              id="circuito"
              placeholder="Ej: AR-15"
              {...register('circuito')}
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Creando...' : 'Crear congregación'}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center">
          Serás el administrador de esta congregación y podrás invitar a otros miembros.
        </p>
      </div>
    </div>
  )
}
