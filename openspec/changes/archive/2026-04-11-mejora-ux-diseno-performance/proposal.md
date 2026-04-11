## Why

La app funciona correctamente pero la experiencia de usuario es básica: no hay estados de carga visuales (skeletons), no hay feedback visual inmediato tras acciones, las tablas no tienen filtros ni orden, y no se aprovechan optimizaciones de performance disponibles en React y React Query. Con la base técnica ya sólida (shadcn/ui, Radix, React Query), es el momento de pulir la UX sin introducir dependencias nuevas.

## What Changes

- **Skeleton loaders**: Reemplazar texto "Cargando..." por componentes skeleton en tablas y cards
- **Feedback visual en acciones**: Confirmación visual inmediata al guardar/eliminar asignaciones (más allá del spinner en botón)
- **Filtros y búsqueda en Publicadores**: Buscador por nombre + filtro por rol en la tabla de administración
- **Optimizaciones de performance**: `React.memo` en items de listas, `useMemo` para listas filtradas, lazy loading de rutas admin
- **Mejoras de diseño visual**: Tipografía con Inter font, espaciados consistentes, mejor jerarquía visual en Dashboard
- **Estados vacíos mejorados**: Mensajes más descriptivos y accionables en EmptyState
- **Manejo de errores más claro**: Mensajes de error específicos en lugar de toasts genéricos

## Capabilities

### New Capabilities

- `skeleton-ui`: Componentes skeleton para estados de carga en tablas, cards y listas
- `publicadores-filtros`: Búsqueda y filtrado en la tabla de publicadores (admin)

### Modified Capabilities

- `app-congregacion`: Mejoras transversales de diseño, performance y UX que afectan múltiples componentes existentes

## Impact

- **Componentes afectados**: Header, Sidebar, Dashboard, EntreSemana, FinDeSemana, MisAsignaciones, Publicadores, ModalAsignacion, EmptyState
- **Shared UI**: Nuevo componente `skeleton.tsx` en `/shared/components/ui/`
- **Performance**: Lazy loading en `router.tsx`, memoización en componentes de listas
- **Sin cambios de backend**: No afecta Supabase, RLS, ni APIs — cambios puramente frontend
- **Sin breaking changes**: Cambios aditivos y de refactor visual, sin modificar contratos de datos
