import { supabase } from '@/core/supabase/client'
import { getLunesDeSemana, toISODate } from '@/shared/utils/fechas'
import { PROGRAMA_SEMANA } from '@/core/config/programa-semana'
import type { DashboardStats } from '@/core/supabase/types'

export async function getDashboardStats(): Promise<DashboardStats> {
  const hoy   = new Date()
  const lunes = toISODate(getLunesDeSemana(hoy))

  const { count } = await supabase
    .from('asignaciones_semana')
    .select('id', { count: 'exact', head: true })
    .eq('semana', lunes)

  const asignacionesEstaSemana = count ?? 0
  const totalPartes            = PROGRAMA_SEMANA.filter((p) => !p.opcional).length
  const partesPendientes       = Math.max(0, totalPartes - asignacionesEstaSemana)

  return {
    asignacionesEstaSemana,
    partesPendientesEstaSemana: partesPendientes,
  }
}
