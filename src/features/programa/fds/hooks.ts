import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/utils/query-keys'
import { getAsignacionesFDS, upsertAsignacionFDS, deleteAsignacionFDS } from './api'
import type { AsignacionFormData } from '@/shared/components/ModalAsignacion'

export function useProgramaFDS(fecha: string) {
  return useQuery({
    queryKey: queryKeys.asignacionesFds.fecha(fecha),
    queryFn:  () => getAsignacionesFDS(fecha),
  })
}

export function useUpsertAsignacionFDS() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ fecha, parteId, data, asignacionId }: { fecha: string; parteId: string; data: AsignacionFormData; asignacionId?: string }) =>
      upsertAsignacionFDS(fecha, parteId, data, asignacionId),
    onSuccess: (_, { fecha }) => {
      qc.invalidateQueries({ queryKey: queryKeys.asignacionesFds.fecha(fecha) })
      toast.success('Asignación guardada')
    },
    onError: () => toast.error('Error al guardar asignación'),
  })
}

export function useDeleteAsignacionFDS() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; fecha: string }) => deleteAsignacionFDS(id),
    onSuccess: (_, { fecha }) => {
      qc.invalidateQueries({ queryKey: queryKeys.asignacionesFds.fecha(fecha) })
      toast.success('Asignación eliminada')
    },
    onError: () => toast.error('Error al eliminar asignación'),
  })
}
