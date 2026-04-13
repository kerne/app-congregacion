import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/utils/query-keys'
import { useCongregacion } from '@/features/congregacion/useCongregacion'
import { getDashboardStats } from './api'

export function useDashboardStats() {
  const { congregacionId } = useCongregacion()
  return useQuery({
    queryKey: queryKeys.dashboard.stats(congregacionId!),
    queryFn:  () => getDashboardStats(congregacionId!),
    enabled:  !!congregacionId,
  })
}
