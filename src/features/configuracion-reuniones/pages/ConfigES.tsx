import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { usePublicadores } from '@/features/publicadores/hooks'
import { SeccionConfigES } from '../components/SeccionConfigES'
import type { PublicadorPublico } from '@/core/supabase/types'

export function ConfigES() {
  const { data: publicadores = [] } = usePublicadores(true)

  const publicadoresPublicos: PublicadorPublico[] = publicadores.map(
    ({ id, nombre, apellido, rol, cargo }) => ({ id, nombre, apellido, rol, cargo }),
  )

  return (
    <div className="space-y-6">
      <Link
        to="/admin/configuracion-reuniones"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a configuración
      </Link>

      <SeccionConfigES publicadores={publicadoresPublicos} />
    </div>
  )
}
