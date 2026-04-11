import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/utils/query-keys'
import {
  getPublicadores,
  createPublicador,
  updatePublicador,
  toggleActivo,
  type CreatePublicadorData,
  type UpdatePublicadorData,
} from './api'

export function usePublicadores(soloActivos = true) {
  return useQuery({
    queryKey: queryKeys.publicadores.list(soloActivos),
    queryFn:  () => getPublicadores(soloActivos),
  })
}

export function useCreatePublicador() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePublicadorData) => createPublicador(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.publicadores.all })
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
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePublicadorData }) =>
      updatePublicador(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.publicadores.all })
      toast.success('Publicador actualizado')
    },
    onError: () => toast.error('Error al actualizar publicador'),
  })
}

export function useToggleActivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) =>
      toggleActivo(id, activo),
    onSuccess: (_, { activo }) => {
      qc.invalidateQueries({ queryKey: queryKeys.publicadores.all })
      toast.success(activo ? 'Publicador activado' : 'Publicador desactivado')
    },
    onError: () => toast.error('Error al cambiar estado del publicador'),
  })
}
