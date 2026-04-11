import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/utils/query-keys'
import { getAsignacionesFDS, upsertAsignacionFDS, deleteAsignacionFDS } from './api'
import type { AsignacionFormData } from '@/shared/components/ModalAsignacion'

export function useProgramaFDS(fecha: string) {
  return useQuery({
    queryKey: queryKeys.asignacionesFds.fecha(fecha),
    queryFn:  () => getAsignacionesFDS(fecha),
    enabled:  !!fecha,
  })
}

export function useUpsertAsignacionFDS(fecha: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ parteId, data, asignacionId }: { parteId: string; data: AsignacionFormData; asignacionId?: string }) =>
      upsertAsignacionFDS(fecha, parteId, data, asignacionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.asignacionesFds.fecha(fecha) })
      toast.success('Asignación guardada')
    },
    onError: () => toast.error('Error al guardar asignación'),
  })
}

export function useDeleteAsignacionFDS(fecha: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAsignacionFDS(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.asignacionesFds.fecha(fecha) })
      toast.success('Asignación eliminada')
    },
    onError: () => toast.error('Error al eliminar asignación'),
  })
}
