import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/utils/query-keys'
import { getMisAsignaciones } from './api'

export function useMisAsignaciones(publicadorId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.misAsignaciones.porPublicador(publicadorId ?? ''),
    queryFn:  () => getMisAsignaciones(publicadorId!),
    enabled:  !!publicadorId,
  })
}
