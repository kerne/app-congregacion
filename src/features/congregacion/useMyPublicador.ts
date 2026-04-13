import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/core/supabase/client'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import { useCongregacion } from './useCongregacion'
import type { Publicador } from '@/core/supabase/types'

export function useMyPublicador() {
  const { user } = useCurrentUser()
  const { congregacionId } = useCongregacion()

  return useQuery({
    queryKey: ['my-publicador', congregacionId, user?.email],
    queryFn: async () => {
      if (!user?.email || !congregacionId) return null

      const { data, error } = await supabase
        .from('publicadores')
        .select('*')
        .eq('congregacion_id', congregacionId)
        .eq('email', user.email.toLowerCase())
        .eq('activo', true)
        .maybeSingle()

      if (error) {
        console.error('Error fetching my publicador:', error)
        return null
      }
      return data as Publicador | null
    },
    enabled: !!user?.email && !!congregacionId,
  })
}
