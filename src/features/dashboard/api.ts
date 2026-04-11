import { supabase } from '@/core/supabase/client'
import { getLunesDeSemana, toISODate } from '@/shared/utils/fechas'
import { PROGRAMA_SEMANA } from '@/core/config/programa-semana'
import type { DashboardStats } from '@/core/supabase/types'

export async function getDashboardStats(): Promise<DashboardStats> {
  const hoy   = new Date()
  const lunes = toISODate(getLunesDeSemana(hoy))

  const [pubRes, asigRes] = await Promise.all([
    supabase
      .from('publicadores')
      .select('id', { count: 'exact', head: true })
      .eq('activo', true),

    supabase
      .from('asignaciones_semana')
      .select('id', { count: 'exact', head: true })
      .eq('semana', lunes),
  ])

  const publicadoresActivos     = pubRes.count ?? 0
  const asignacionesEstaSemana  = asigRes.count ?? 0
  const totalPartes             = PROGRAMA_SEMANA.filter((p) => !p.opcional).length
  const partesPendientes        = Math.max(0, totalPartes - asignacionesEstaSemana)

  return {
    publicadoresActivos,
    asignacionesEstaSemana,
    partesPendientesEstaSemana: partesPendientes,
  }
}
