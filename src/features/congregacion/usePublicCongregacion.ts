import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/core/supabase/client'

interface PublicCongregacion {
  congregacionId: string | null
  nombre: string | null
  slug: string | null
  isLoading: boolean
  isError: boolean
}

export function usePublicCongregacion(slug: string | undefined): PublicCongregacion {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-congregacion', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('congregaciones')
        .select('id, nombre, slug')
        .eq('slug', slug!)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 60, // 1 hour — slug→id is stable
  })

  return {
    congregacionId: data?.id ?? null,
    nombre: data?.nombre ?? null,
    slug: data?.slug ?? null,
    isLoading,
    isError,
  }
}
