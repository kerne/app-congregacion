import { supabase } from '@/core/supabase/client'
import type { AsignacionSemana } from '@/core/supabase/types'
import type { AsignacionFormData } from '@/shared/components/ModalAsignacion'

const SELECT_ASIGNACION = `
  *,
  asignado:asignado_id (id, nombre, apellido, rol),
  asistente:asistente_id (id, nombre, apellido, rol)
`

export async function getAsignacionesSemana(semana: string): Promise<AsignacionSemana[]> {
  const { data, error } = await supabase
    .from('asignaciones_semana')
    .select(SELECT_ASIGNACION)
    .eq('semana', semana)

  if (error) throw error
  return data as AsignacionSemana[]
}

export async function upsertAsignacionSemana(
  semana: string,
  parteId: string,
  data: AsignacionFormData,
  asignacionId?: string,
): Promise<void> {
  const payload = {
    semana,
    parte_id:     parteId,
    asignado_id:  data.asignado_id,
    asistente_id: data.asistente_id || null,
    tema:         data.tema || null,
    sala:         data.sala || null,
    modificado:   new Date().toISOString(),
  }

  if (asignacionId) {
    const { error } = await supabase
      .from('asignaciones_semana')
      .update(payload)
      .eq('id', asignacionId)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('asignaciones_semana')
      .insert(payload)
    if (error) throw error
  }
}

export async function deleteAsignacionSemana(id: string): Promise<void> {
  const { error } = await supabase
    .from('asignaciones_semana')
    .delete()
    .eq('id', id)
  if (error) throw error
}
