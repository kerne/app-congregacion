import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/utils/query-keys'
import { getDashboardStats } from './api'

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn:  getDashboardStats,
  })
}
