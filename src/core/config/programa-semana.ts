import type { CargoCongregacion } from '@/core/supabase/types'

export type SeccionSemana = 'apertura' | 'tesoros' | 'smt' | 'nvc' | 'cierre'

export interface ParteSemana {
  id: string
  nombre: string
  seccion: SeccionSemana
  tieneAsistente: boolean
  tieneTema: boolean
  tieneSala: boolean
  opcional: boolean
  duracionMin: number
  cargosPermitidos: CargoCongregacion[]
}

const AM: CargoCongregacion[] = ['anciano', 'siervo_ministerial']
const TODOS: CargoCongregacion[] = ['anciano', 'siervo_ministerial', 'publicador', 'publicadora']

export const PROGRAMA_SEMANA: ParteSemana[] = [
  { id: 'presidente',           nombre: 'Presidente',                        seccion: 'apertura', tieneAsistente: false, tieneTema: false, tieneSala: false, opcional: false, duracionMin: 0,  cargosPermitidos: AM    },
  { id: 'lector_tesoros',       nombre: 'Lector (Tesoros)',                   seccion: 'apertura', tieneAsistente: false, tieneTema: false, tieneSala: false, opcional: false, duracionMin: 0,  cargosPermitidos: AM    },
  { id: 'discurso_tesoros',     nombre: 'Discurso',                           seccion: 'tesoros',  tieneAsistente: false, tieneTema: true,  tieneSala: false, opcional: false, duracionMin: 10, cargosPermitidos: AM    },
  { id: 'mejores_maestros',     nombre: 'Seamos Mejores Maestros',            seccion: 'tesoros',  tieneAsistente: false, tieneTema: true,  tieneSala: false, opcional: false, duracionMin: 8,  cargosPermitidos: AM    },
  { id: 'busqueda_tesoros',     nombre: 'Búsqueda de Tesoros Bíblicos',       seccion: 'tesoros',  tieneAsistente: false, tieneTema: false, tieneSala: false, opcional: false, duracionMin: 10, cargosPermitidos: AM    },
  { id: 'smt_parte1',           nombre: 'Parte de Estudiantes 1',             seccion: 'smt',      tieneAsistente: true,  tieneTema: true,  tieneSala: true,  opcional: false, duracionMin: 4,  cargosPermitidos: TODOS },
  { id: 'smt_parte2',           nombre: 'Parte de Estudiantes 2',             seccion: 'smt',      tieneAsistente: true,  tieneTema: true,  tieneSala: true,  opcional: false, duracionMin: 4,  cargosPermitidos: TODOS },
  { id: 'smt_parte3',           nombre: 'Parte de Estudiantes 3',             seccion: 'smt',      tieneAsistente: true,  tieneTema: true,  tieneSala: true,  opcional: true,  duracionMin: 4,  cargosPermitidos: TODOS },
  { id: 'smt_parte4',           nombre: 'Parte de Estudiantes 4',             seccion: 'smt',      tieneAsistente: true,  tieneTema: true,  tieneSala: true,  opcional: true,  duracionMin: 4,  cargosPermitidos: TODOS },
  { id: 'nvc_parte1',           nombre: 'Parte Vida Cristiana 1',             seccion: 'nvc',      tieneAsistente: false, tieneTema: true,  tieneSala: false, opcional: false, duracionMin: 10, cargosPermitidos: AM    },
  { id: 'nvc_parte2',           nombre: 'Parte Vida Cristiana 2',             seccion: 'nvc',      tieneAsistente: false, tieneTema: true,  tieneSala: false, opcional: true,  duracionMin: 10, cargosPermitidos: AM    },
  { id: 'estudio_congregacion', nombre: 'Estudio Bíblico de la Congregación', seccion: 'nvc',      tieneAsistente: false, tieneTema: true,  tieneSala: false, opcional: false, duracionMin: 30, cargosPermitidos: ['anciano'] },
  { id: 'cierre',               nombre: 'Cierre (Presidente)',                seccion: 'cierre',   tieneAsistente: false, tieneTema: false, tieneSala: false, opcional: false, duracionMin: 0,  cargosPermitidos: AM    },
]

export const SECCION_NOMBRES: Record<SeccionSemana, string> = {
  apertura: 'Apertura',
  tesoros: 'Tesoros de la Biblia',
  smt: 'Seamos Mejores Maestros',
  nvc: 'Nuestra Vida Cristiana',
  cierre: 'Cierre',
}

export const SECCION_COLORS: Record<SeccionSemana, { header: string; row: string }> = {
  apertura: { header: 'bg-slate-100 text-slate-700',   row: 'bg-white hover:bg-slate-50' },
  tesoros:  { header: 'bg-amber-100 text-amber-800',   row: 'bg-white hover:bg-amber-50' },
  smt:      { header: 'bg-blue-100 text-blue-800',     row: 'bg-white hover:bg-blue-50'  },
  nvc:      { header: 'bg-emerald-100 text-emerald-800', row: 'bg-white hover:bg-emerald-50' },
  cierre:   { header: 'bg-slate-100 text-slate-700',   row: 'bg-white hover:bg-slate-50' },
}

export const PARTES_POR_SECCION = PROGRAMA_SEMANA.reduce<Record<SeccionSemana, ParteSemana[]>>(
  (acc, parte) => {
    acc[parte.seccion] = [...(acc[parte.seccion] ?? []), parte]
    return acc
  },
  {} as Record<SeccionSemana, ParteSemana[]>,
)

export const SECCIONES_ORDEN: SeccionSemana[] = ['apertura', 'tesoros', 'smt', 'nvc', 'cierre']
