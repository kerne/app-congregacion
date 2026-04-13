import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Plus, Users } from 'lucide-react'

export function Onboarding() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">C</span>
          </div>
          <h1 className="text-xl font-semibold text-center">Bienvenido</h1>
          <p className="text-sm text-muted-foreground text-center">
            Para comenzar, creá tu congregación o unite a una existente.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full gap-2"
            onClick={() => navigate('/onboarding/crear')}
          >
            <Plus className="h-4 w-4" />
            Crear congregación
          </Button>

          <Button
            variant="outline"
            className="w-full gap-2"
            disabled
            title="Próximamente"
          >
            <Users className="h-4 w-4" />
            Unirme a una congregación
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          La opción de unirse estará disponible próximamente mediante código de invitación.
        </p>
      </div>
    </div>
  )
}
