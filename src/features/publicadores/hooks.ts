import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/utils/query-keys'
import { useCongregacion } from '@/features/congregacion/useCongregacion'
import {
  getPublicadores,
  getPublicadoresAdmin,
  createPublicador,
  updatePublicador,
  toggleActivo,
  type CreatePublicadorData,
  type UpdatePublicadorData,
} from './api'

export function usePublicadores(soloActivos = true) {
  const { congregacionId } = useCongregacion()
  return useQuery({
    queryKey: queryKeys.publicadores.list(congregacionId!, soloActivos),
    queryFn:  () => getPublicadores(congregacionId!, soloActivos),
    enabled:  !!congregacionId,
  })
}

export function usePublicadoresAdmin(soloActivos = true) {
  const { congregacionId } = useCongregacion()
  return useQuery({
    queryKey: [...queryKeys.publicadores.list(congregacionId!, soloActivos), 'admin'],
    queryFn:  () => getPublicadoresAdmin(congregacionId!, soloActivos),
    enabled:  !!congregacionId,
  })
}

export function useCreatePublicador() {
  const qc = useQueryClient()
  const { congregacionId } = useCongregacion()
  return useMutation({
    mutationFn: (data: CreatePublicadorData) => createPublicador(congregacionId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.publicadores.all(congregacionId!) })
      toast.success('Publicador creado')
    },
    onError: (err: Error) => {
      const msg = err.message.includes('duplicate') || err.message.includes('unique')
        ? 'El email ya está registrado'
        : 'Error al crear publicador'
      toast.error(msg)
    },
  })
}

export function useUpdatePublicador() {
  const qc = useQueryClient()
  const { congregacionId } = useCongregacion()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePublicadorData }) =>
      updatePublicador(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.publicadores.all(congregacionId!) })
      toast.success('Publicador actualizado')
    },
    onError: () => toast.error('Error al actualizar publicador'),
  })
}

export function useToggleActivo() {
  const qc = useQueryClient()
  const { congregacionId } = useCongregacion()
  return useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) =>
      toggleActivo(id, activo),
    onSuccess: (_, { activo }) => {
      qc.invalidateQueries({ queryKey: queryKeys.publicadores.all(congregacionId!) })
      toast.success(activo ? 'Publicador activado' : 'Publicador desactivado')
    },
    onError: () => toast.error('Error al cambiar estado del publicador'),
  })
}
