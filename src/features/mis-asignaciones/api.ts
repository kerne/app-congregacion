import { supabase } from '@/core/supabase/client'
import { toISODate } from '@/shared/utils/fechas'
import { PROGRAMA_SEMANA } from '@/core/config/programa-semana'
import { PROGRAMA_FDS } from '@/core/config/programa-fds'
import type { AsignacionPersonal } from '@/core/supabase/types'

export async function getMisAsignaciones(congregacionId: string, publicadorId: string): Promise<AsignacionPersonal[]> {
  const hoy = toISODate(new Date())

  const [semanaRes, fdsRes] = await Promise.all([
    supabase
      .from('asignaciones_semana')
      .select('id, semana, parte_id, asignado_id, asistente_id, tema')
      .eq('congregacion_id', congregacionId)
      .or(`asignado_id.eq.${publicadorId},asistente_id.eq.${publicadorId}`)
      .gte('semana', hoy)
      .order('semana'),

    supabase
      .from('asignaciones_fds')
      .select('id, fecha, parte_id, asignado_id, asistente_id, tema')
      .eq('congregacion_id', congregacionId)
      .or(`asignado_id.eq.${publicadorId},asistente_id.eq.${publicadorId}`)
      .gte('fecha', hoy)
      .order('fecha'),
  ])

  if (semanaRes.error) throw semanaRes.error
  if (fdsRes.error) throw fdsRes.error

  const partesSemana = Object.fromEntries(PROGRAMA_SEMANA.map((p) => [p.id, p.nombre]))
  const partesFDS    = Object.fromEntries(PROGRAMA_FDS.map((p) => [p.id, p.nombre]))

  const asignacionesSemana: AsignacionPersonal[] = (semanaRes.data ?? []).map((a) => ({
    id:          a.id,
    fecha:       a.semana,
    tipo:        'semana',
    parte_id:    a.parte_id,
    parte_nombre: partesSemana[a.parte_id] ?? a.parte_id,
    rol:         a.asignado_id === publicadorId ? 'principal' : 'asistente',
    tema:        a.tema,
  }))

  const asignacionesFDS: AsignacionPersonal[] = (fdsRes.data ?? []).map((a) => ({
    id:          a.id,
    fecha:       a.fecha,
    tipo:        'fds',
    parte_id:    a.parte_id,
    parte_nombre: partesFDS[a.parte_id] ?? a.parte_id,
    rol:         a.asignado_id === publicadorId ? 'principal' : 'asistente',
    tema:        a.tema,
  }))

  return [...asignacionesSemana, ...asignacionesFDS].sort((a, b) =>
    a.fecha.localeCompare(b.fecha),
  )
}
