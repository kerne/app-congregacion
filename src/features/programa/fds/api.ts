import { supabase } from '@/core/supabase/client'
import type { AsignacionFDS } from '@/core/supabase/types'
import type { AsignacionFormData } from '@/shared/components/ModalAsignacion'

const SELECT_ASIGNACION = `
  *,
  asignado:asignado_id (id, nombre, apellido, rol),
  asistente:asistente_id (id, nombre, apellido, rol)
`

export async function getAsignacionesFDS(congregacionId: string, fecha: string): Promise<AsignacionFDS[]> {
  const { data, error } = await supabase
    .from('asignaciones_fds')
    .select(SELECT_ASIGNACION)
    .eq('congregacion_id', congregacionId)
    .eq('fecha', fecha)

  if (error) throw error
  return (data ?? []) as AsignacionFDS[]
}

export async function upsertAsignacionFDS(
  congregacionId: string,
  fecha: string,
  parteId: string,
  data: AsignacionFormData,
  asignacionId?: string,
): Promise<void> {
  const payload = {
    fecha,
    parte_id:        parteId,
    asignado_id:     data.asignado_id,
    asistente_id:    data.asistente_id || null,
    tema:            data.tema || null,
    congregacion_id: congregacionId,
    modificado:      new Date().toISOString(),
  }

  if (asignacionId) {
    const { error } = await supabase
      .from('asignaciones_fds')
      .update(payload)
      .eq('id', asignacionId)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('asignaciones_fds')
      .insert(payload)
    if (error) throw error
  }
}

export async function deleteAsignacionFDS(id: string): Promise<void> {
  const { error } = await supabase
    .from('asignaciones_fds')
    .delete()
    .eq('id', id)
  if (error) throw error
}
