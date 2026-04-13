import { supabase } from '@/core/supabase/client'
import type { CargoCongregacion, Publicador, PublicadorRol } from '@/core/supabase/types'

export interface CreatePublicadorData {
  nombre:    string
  apellido:  string
  email?:    string | null
  telefono?: string | null
  rol:       PublicadorRol
  cargo?:    CargoCongregacion | null
}

export interface UpdatePublicadorData extends Partial<CreatePublicadorData> {}

const COLS_PUBLICAS = 'id, nombre, apellido, activo, rol, cargo, congregacion_id, creado_en'

export async function getPublicadores(congregacionId: string, soloActivos = true): Promise<Publicador[]> {
  let query = supabase
    .from('publicadores')
    .select(COLS_PUBLICAS)
    .eq('congregacion_id', congregacionId)
    .order('apellido')
    .order('nombre')

  if (soloActivos) query = query.eq('activo', true)

  const { data, error } = await query
  if (error) throw error
  return data as Publicador[]
}

export async function getPublicadoresAdmin(congregacionId: string, soloActivos = true): Promise<Publicador[]> {
  let query = supabase
    .from('publicadores')
    .select('*')
    .eq('congregacion_id', congregacionId)
    .order('apellido')
    .order('nombre')

  if (soloActivos) query = query.eq('activo', true)

  const { data, error } = await query
  if (error) throw error
  return data as Publicador[]
}

export async function createPublicador(congregacionId: string, data: CreatePublicadorData): Promise<Publicador> {
  const { data: created, error } = await supabase
    .from('publicadores')
    .insert({ ...data, activo: true, congregacion_id: congregacionId })
    .select()
    .single()

  if (error) throw error
  return created as Publicador
}

export async function updatePublicador(id: string, data: UpdatePublicadorData): Promise<Publicador> {
  const { data: updated, error } = await supabase
    .from('publicadores')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return updated as Publicador
}

export async function toggleActivo(id: string, activo: boolean): Promise<void> {
  const { error } = await supabase
    .from('publicadores')
    .update({ activo })
    .eq('id', id)

  if (error) throw error
}
