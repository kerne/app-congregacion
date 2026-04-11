import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/utils/query-keys'
import { getAsignacionesSemana, upsertAsignacionSemana, deleteAsignacionSemana } from './api'
import type { AsignacionFormData } from '@/shared/components/ModalAsignacion'

export function useProgramaSemana(semana: string) {
  return useQuery({
    queryKey: queryKeys.asignacionesSemana.semana(semana),
    queryFn:  () => getAsignacionesSemana(semana),
    enabled:  !!semana,
  })
}

export function useUpsertAsignacionSemana(semana: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ parteId, data, asignacionId }: { parteId: string; data: AsignacionFormData; asignacionId?: string }) =>
      upsertAsignacionSemana(semana, parteId, data, asignacionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.asignacionesSemana.semana(semana) })
      toast.success('Asignación guardada')
    },
    onError: () => toast.error('Error al guardar asignación'),
  })
}

export function useDeleteAsignacionSemana(semana: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAsignacionSemana(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.asignacionesSemana.semana(semana) })
      toast.success('Asignación eliminada')
    },
    onError: () => toast.error('Error al eliminar asignación'),
  })
}
