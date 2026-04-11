import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  format,
  nextSunday,
  previousSunday,
  addDays,
  isSunday,
  parseISO,
} from 'date-fns'
import { es } from 'date-fns/locale'

/** Retorna el lunes de la semana que contiene `date` */
export function getLunesDeSemana(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 })
}

/** Retorna el domingo que cierra la semana de `date` */
export function getDomingoDeSemana(date: Date): Date {
  return endOfWeek(date, { weekStartsOn: 1 })
}

/** Retorna el próximo domingo (o el actual si ya es domingo) */
export function getProximoDomingo(date: Date): Date {
  if (isSunday(date)) return date
  return nextSunday(date)
}

/** Retorna el domingo anterior (sin incluir el actual) */
export function getDomingoAnterior(date: Date): Date {
  return previousSunday(date)
}

/** Avanza una semana */
export function siguienteSemana(date: Date): Date {
  return addWeeks(date, 1)
}

/** Retrocede una semana */
export function semanaAnterior(date: Date): Date {
  return subWeeks(date, 1)
}

/** Avanza al siguiente domingo */
export function siguienteDomingo(date: Date): Date {
  return addDays(date, 7)
}

/** Retrocede al domingo anterior */
export function domingoAnterior(date: Date): Date {
  return addDays(date, -7)
}

/** Formatea como "YYYY-MM-DD" para la base de datos */
export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/** Formatea para mostrar en UI: "7 – 13 abr 2026" */
export function formatRangoSemana(lunes: Date): string {
  const domingo = getDomingoDeSemana(lunes)
  const mismoMes = lunes.getMonth() === domingo.getMonth()
  if (mismoMes) {
    return `${format(lunes, 'd')} – ${format(domingo, 'd MMM yyyy', { locale: es })}`
  }
  return `${format(lunes, 'd MMM', { locale: es })} – ${format(domingo, 'd MMM yyyy', { locale: es })}`
}

/** Formatea domingo para mostrar: "13 abr 2026" */
export function formatDomingo(date: Date): string {
  return format(date, "d 'de' MMMM yyyy", { locale: es })
}

/** Formatea fecha corta: "13 abr" */
export function formatFechaCorta(date: Date): string {
  return format(date, 'd MMM', { locale: es })
}

/** Parsea una fecha ISO string a Date */
export function parseFecha(iso: string): Date {
  return parseISO(iso)
}
