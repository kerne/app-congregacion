export type PublicadorRol = 'publicador' | 'editor' | 'admin'

export interface Publicador {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono: string | null
  rol: PublicadorRol
  activo: boolean
  creado_en: string
}

/** Vista pública — sin datos de contacto */
export type PublicadorPublico = Pick<Publicador, 'id' | 'nombre' | 'apellido' | 'rol'>

export interface AsignacionSemana {
  id: string
  semana: string // YYYY-MM-DD lunes
  parte_id: string
  asignado_id: string
  asistente_id: string | null
  tema: string | null
  sala: 'principal' | 'B' | null
  notas: string | null
  modificado: string
  asignado?: PublicadorPublico
  asistente?: PublicadorPublico
}

export interface AsignacionFDS {
  id: string
  fecha: string // YYYY-MM-DD domingo
  parte_id: string
  asignado_id: string
  asistente_id: string | null
  tema: string | null
  notas: string | null
  modificado: string
  asignado?: PublicadorPublico
  asistente?: PublicadorPublico
}

export interface DashboardStats {
  asignacionesEstaSemana: number
  partesPendientesEstaSemana: number
}

export interface AsignacionPersonal {
  id: string
  fecha: string
  tipo: 'semana' | 'fds'
  parte_id: string
  parte_nombre: string
  rol: 'principal' | 'asistente'
  tema: string | null
}
