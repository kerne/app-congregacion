export const queryKeys = {
  publicadores: {
    all: (cId: string) => ['publicadores', cId] as const,
    list: (cId: string, soloActivos: boolean) => ['publicadores', cId, { soloActivos }] as const,
  },
  asignacionesSemana: {
    semana: (cId: string, semana: string) => ['asignaciones-semana', cId, semana] as const,
  },
  asignacionesFds: {
    fecha: (cId: string, fecha: string) => ['asignaciones-fds', cId, fecha] as const,
  },
  misAsignaciones: {
    porPublicador: (cId: string, id: string) => ['mis-asignaciones', cId, id] as const,
  },
  dashboard: {
    stats: (cId: string) => ['dashboard-stats', cId] as const,
  },
}
