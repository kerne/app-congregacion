export type PublicadorRol = 'publicador' | 'editor' | 'admin'

export type MiembroRol = 'publicador' | 'editor' | 'admin'

export type CargoCongregacion = 'anciano' | 'siervo_ministerial' | 'publicador' | 'publicadora'

export interface Congregacion {
  id: string
  nombre: string
  slug: string
  numero: string | null
  circuito: string | null
  creado_por: string | null
  creado_en: string
}

export interface Miembro {
  id: string
  user_id: string
  congregacion_id: string
  rol: MiembroRol
  activo: boolean
  creado_en: string
  congregacion?: Congregacion
}

export interface Publicador {
  id: string
  nombre: string
  apellido: string
  email: string | null
  telefono: string | null
  rol: PublicadorRol
  cargo: CargoCongregacion | null
  activo: boolean
  congregacion_id: string
  creado_en: string
}

/** Vista pública — sin datos de contacto */
export type PublicadorPublico = Pick<Publicador, 'id' | 'nombre' | 'apellido' | 'rol' | 'cargo'>

export interface AsignacionSemana {
  id: string
  semana: string // YYYY-MM-DD lunes
  parte_id: string
  asignado_id: string
  asistente_id: string | null
  tema: string | null
  sala: 'principal' | 'B' | null
  notas: string | null
  congregacion_id: string
  modificado: string
  asignado?: PublicadorPublico
  asistente?: PublicadorPublico
}

export interface AsignacionFDS {
  id: string
  fecha: string // YYYY-MM-DD domingo
  parte_id: string
  asignado_id: string | null
  asistente_id: string | null
  orador_nombre: string | null
  tema: string | null
  notas: string | null
  congregacion_id: string
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
