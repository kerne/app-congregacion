import { supabase } from '@/core/supabase/client'
import type { Congregacion } from '@/core/supabase/types'

export interface CreateCongregacionData {
  nombre: string
  slug: string
  numero?: string | null
  circuito?: string | null
}

export async function crearCongregacion(
  data: CreateCongregacionData,
): Promise<Congregacion> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  // 1. Crear la congregación
  const { data: congregacion, error: congError } = await supabase
    .from('congregaciones')
    .insert({
      nombre: data.nombre,
      slug: data.slug,
      numero: data.numero || null,
      circuito: data.circuito || null,
      creado_por: user.id,
    })
    .select()
    .single()

  if (congError) throw congError

  // 2. Auto-asignarse como admin
  const { error: miembroError } = await supabase
    .from('miembros')
    .insert({
      user_id: user.id,
      congregacion_id: congregacion.id,
      rol: 'admin',
    })

  if (miembroError) throw miembroError

  // 3. Crear publicador para el admin
  const nombre = user.user_metadata?.full_name?.split(' ')[0] ?? ''
  const apellido = user.user_metadata?.full_name?.split(' ').slice(1).join(' ') ?? ''

  const { error: pubError } = await supabase
    .from('publicadores')
    .insert({
      nombre: nombre || 'Admin',
      apellido: apellido || '',
      email: user.email?.toLowerCase() ?? null,
      rol: 'admin',
      congregacion_id: congregacion.id,
      activo: true,
    })

  if (pubError) throw pubError

  return congregacion as Congregacion
}
