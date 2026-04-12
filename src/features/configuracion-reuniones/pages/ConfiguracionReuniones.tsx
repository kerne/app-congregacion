import { usePublicadores } from '@/features/publicadores/hooks'
import { SeccionConfigES } from '../components/SeccionConfigES'
import { SeccionConfigFDS } from '../components/SeccionConfigFDS'
import type { PublicadorPublico } from '@/core/supabase/types'

export function ConfiguracionReuniones() {
  const { data: publicadores = [] } = usePublicadores(true)

  const publicadoresPublicos: PublicadorPublico[] = publicadores.map(
    ({ id, nombre, apellido, rol, cargo }) => ({ id, nombre, apellido, rol, cargo }),
  )

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Configuración de Reuniones</h1>
        <p className="text-sm text-muted-foreground">
          Asigná publicadores a cada parte del programa. Los selectores filtran por cargo elegible.
        </p>
      </div>

      <SeccionConfigES publicadores={publicadoresPublicos} />

      <div className="border-t" />

      <SeccionConfigFDS publicadores={publicadoresPublicos} />
    </div>
  )
}
