export const queryKeys = {
  publicadores: {
    all: ['publicadores'] as const,
    list: (soloActivos: boolean) => ['publicadores', { soloActivos }] as const,
  },
  asignacionesSemana: {
    semana: (semana: string) => ['asignaciones-semana', semana] as const,
  },
  asignacionesFds: {
    fecha: (fecha: string) => ['asignaciones-fds', fecha] as const,
  },
  misAsignaciones: {
    porPublicador: (id: string) => ['mis-asignaciones', id] as const,
  },
  dashboard: {
    stats: ['dashboard-stats'] as const,
  },
}
