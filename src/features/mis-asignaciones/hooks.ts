import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/utils/query-keys'
import { useCongregacion } from '@/features/congregacion/useCongregacion'
import { getMisAsignaciones } from './api'

export function useMisAsignaciones(publicadorId: string | undefined) {
  const { congregacionId } = useCongregacion()
  return useQuery({
    queryKey: queryKeys.misAsignaciones.porPublicador(congregacionId!, publicadorId ?? ''),
    queryFn:  () => getMisAsignaciones(congregacionId!, publicadorId!),
    enabled:  !!congregacionId && !!publicadorId,
  })
}
