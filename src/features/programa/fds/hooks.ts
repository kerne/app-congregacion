import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/utils/query-keys'
import { useCongregacion } from '@/features/congregacion/useCongregacion'
import { getAsignacionesFDS, upsertAsignacionFDS, deleteAsignacionFDS } from './api'
import type { AsignacionFormData } from '@/shared/components/ModalAsignacion'

export function useProgramaFDS(fecha: string) {
  const { congregacionId } = useCongregacion()
  return useQuery({
    queryKey: queryKeys.asignacionesFds.fecha(congregacionId!, fecha),
    queryFn:  () => getAsignacionesFDS(congregacionId!, fecha),
    enabled:  !!congregacionId,
  })
}

export function useUpsertAsignacionFDS() {
  const qc = useQueryClient()
  const { congregacionId } = useCongregacion()
  return useMutation({
    mutationFn: ({ fecha, parteId, data, asignacionId }: { fecha: string; parteId: string; data: AsignacionFormData; asignacionId?: string }) =>
      upsertAsignacionFDS(congregacionId!, fecha, parteId, data, asignacionId),
    onSuccess: (_, { fecha }) => {
      qc.invalidateQueries({ queryKey: queryKeys.asignacionesFds.fecha(congregacionId!, fecha) })
      toast.success('Asignación guardada')
    },
    onError: () => toast.error('Error al guardar asignación'),
  })
}

export function useDeleteAsignacionFDS() {
  const qc = useQueryClient()
  const { congregacionId } = useCongregacion()
  return useMutation({
    mutationFn: ({ id }: { id: string; fecha: string }) => deleteAsignacionFDS(id),
    onSuccess: (_, { fecha }) => {
      qc.invalidateQueries({ queryKey: queryKeys.asignacionesFds.fecha(congregacionId!, fecha) })
      toast.success('Asignación eliminada')
    },
    onError: () => toast.error('Error al eliminar asignación'),
  })
}
