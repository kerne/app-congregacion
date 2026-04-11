import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/utils/query-keys'
import { getAsignacionesSemana, upsertAsignacionSemana, deleteAsignacionSemana } from './api'
import type { AsignacionFormData } from '@/shared/components/ModalAsignacion'

export function useProgramaSemana(semana: string) {
  return useQuery({
    queryKey: queryKeys.asignacionesSemana.semana(semana),
    queryFn:  () => getAsignacionesSemana(semana),
  })
}

export function useUpsertAsignacionSemana() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ semana, parteId, data, asignacionId }: { semana: string; parteId: string; data: AsignacionFormData; asignacionId?: string }) =>
      upsertAsignacionSemana(semana, parteId, data, asignacionId),
    onSuccess: (_, { semana }) => {
      qc.invalidateQueries({ queryKey: queryKeys.asignacionesSemana.semana(semana) })
      toast.success('Asignación guardada')
    },
    onError: () => toast.error('Error al guardar asignación'),
  })
}

export function useDeleteAsignacionSemana() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; semana: string }) => deleteAsignacionSemana(id),
    onSuccess: (_, { semana }) => {
      qc.invalidateQueries({ queryKey: queryKeys.asignacionesSemana.semana(semana) })
      toast.success('Asignación eliminada')
    },
    onError: () => toast.error('Error al eliminar asignación'),
  })
}
