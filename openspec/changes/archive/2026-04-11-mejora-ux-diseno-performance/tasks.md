## 1. Infraestructura base

- [x] 1.1 Agregar Inter font via Google Fonts en `index.html` (preconnect + stylesheet link)
- [x] 1.2 Actualizar `tailwind.config.ts` para configurar `fontFamily.sans` con Inter
- [x] 1.3 Crear componente `Skeleton` en `/src/shared/components/ui/skeleton.tsx` (animate-pulse + bg-muted)

## 2. Skeleton loaders

- [x] 2.1 Crear `DashboardSkeleton` — 3 cards placeholder para stats del Dashboard
- [x] 2.2 Implementar skeleton en Dashboard: reemplazar texto de carga con `DashboardSkeleton`
- [x] 2.3 Crear `TableSkeleton` — filas placeholder con columnas para tablas de programa
- [x] 2.4 Implementar skeleton en EntreSemana: reemplazar "Cargando..." con `TableSkeleton`
- [x] 2.5 Implementar skeleton en FinDeSemana: reemplazar "Cargando..." con `TableSkeleton`
- [x] 2.6 Crear `AsignacionesSkeleton` — 4 items placeholder para Mis Asignaciones
- [x] 2.7 Implementar skeleton en MisAsignaciones: reemplazar estado de carga
- [x] 2.8 Crear `PublicadoresSkeleton` — 6 filas placeholder (nombre, rol, estado)
- [x] 2.9 Implementar skeleton en Publicadores: reemplazar estado de carga

## 3. Filtros en Publicadores

- [x] 3.1 Agregar estado local `searchQuery` y `rolFilter` en la página Publicadores
- [x] 3.2 Agregar input de búsqueda por nombre sobre la tabla de Publicadores
- [x] 3.3 Agregar selector de filtro por rol (Todos / Admin / Editor / Publicador)
- [x] 3.4 Implementar `useMemo` para lista filtrada combinando searchQuery + rolFilter
- [x] 3.5 Mostrar contador "X de Y publicadores" bajo los controles de filtro
- [x] 3.6 Actualizar EmptyState de Publicadores para incluir botón "Limpiar búsqueda" cuando hay filtros activos

## 4. Performance — lazy loading y memoización

- [x] 4.1 Convertir import de Publicadores en `router.tsx` a `React.lazy`
- [x] 4.2 Envolver ruta admin con `<Suspense fallback={<PublicadoresSkeleton />}>`
- [x] 4.3 Aplicar `useCallback` en `onSubmit` de `ModalAsignacion`
- [x] 4.4 Aplicar `useCallback` en `handleDelete` de `ModalAsignacion`
- [x] 4.5 Aplicar `useMemo` en la lista filtrada de `PublicadorSelector`

## 5. Mejoras visuales — Dashboard y estados vacíos

- [x] 5.1 Actualizar Dashboard stats cards: valores con `text-2xl font-bold`, etiquetas con `text-sm text-muted-foreground`
- [x] 5.2 Revisar y ajustar espaciado y alineación de accesos rápidos del Dashboard
- [x] 5.3 Actualizar mensaje de EmptyState en MisAsignaciones para reflejar período actual
