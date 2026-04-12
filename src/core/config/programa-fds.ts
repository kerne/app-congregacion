import type { CargoCongregacion } from '@/core/supabase/types'

export type SeccionFDS = 'apertura' | 'discurso' | 'atalaya' | 'cierre'

export interface ParteFDS {
  id: string
  nombre: string
  seccion: SeccionFDS
  tieneTema: boolean
  tieneAsistente: boolean
  cargosPermitidos: CargoCongregacion[]
}

const AM: CargoCongregacion[] = ['anciano', 'siervo_ministerial']

export const PROGRAMA_FDS: ParteFDS[] = [
  { id: 'fds_presidente',         nombre: 'Presidente',              seccion: 'apertura', tieneTema: false, tieneAsistente: false, cargosPermitidos: AM },
  { id: 'fds_orador',             nombre: 'Orador Discurso Público', seccion: 'discurso', tieneTema: true,  tieneAsistente: false, cargosPermitidos: AM },
  { id: 'fds_presidente_atalaya', nombre: 'Presidente Atalaya',      seccion: 'atalaya',  tieneTema: false, tieneAsistente: false, cargosPermitidos: AM },
  { id: 'fds_lector_atalaya',     nombre: 'Lector Atalaya',          seccion: 'atalaya',  tieneTema: false, tieneAsistente: false, cargosPermitidos: AM },
  { id: 'fds_oracion_final',      nombre: 'Oración Final',           seccion: 'cierre',   tieneTema: false, tieneAsistente: false, cargosPermitidos: AM },
]

export const SECCION_FDS_NOMBRES: Record<SeccionFDS, string> = {
  apertura: 'Apertura',
  discurso: 'Discurso Público',
  atalaya:  'Atalaya',
  cierre:   'Cierre',
}

export const SECCION_FDS_COLORS: Record<SeccionFDS, { header: string; row: string }> = {
  apertura: { header: 'bg-slate-100 text-slate-700',    row: 'bg-white hover:bg-slate-50'   },
  discurso: { header: 'bg-violet-100 text-violet-800',  row: 'bg-white hover:bg-violet-50'  },
  atalaya:  { header: 'bg-sky-100 text-sky-800',        row: 'bg-white hover:bg-sky-50'     },
  cierre:   { header: 'bg-slate-100 text-slate-700',    row: 'bg-white hover:bg-slate-50'   },
}

export const PARTES_FDS_POR_SECCION = PROGRAMA_FDS.reduce<Record<SeccionFDS, ParteFDS[]>>(
  (acc, parte) => {
    acc[parte.seccion] = [...(acc[parte.seccion] ?? []), parte]
    return acc
  },
  {} as Record<SeccionFDS, ParteFDS[]>,
)

export const SECCIONES_FDS_ORDEN: SeccionFDS[] = ['apertura', 'discurso', 'atalaya', 'cierre']
