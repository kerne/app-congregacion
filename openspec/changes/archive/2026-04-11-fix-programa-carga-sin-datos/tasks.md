## 1. Fix capa API — null safety

- [x] 1.1 En `src/features/programa/semana/api.ts`: cambiar `return data as AsignacionSemana[]` por `return (data ?? []) as AsignacionSemana[]`
- [x] 1.2 En `src/features/programa/fds/api.ts`: cambiar `return data as AsignacionFDS[]` por `return (data ?? []) as AsignacionFDS[]`

## 2. Fix hooks — remover closure stale y enabled innecesario

- [x] 2.1 En `src/features/programa/semana/hooks.ts`: remover `semana` del hook `useUpsertAsignacionSemana` — pasar `semana` como parte del payload de mutación
- [x] 2.2 En `src/features/programa/semana/hooks.ts`: remover `semana` del hook `useDeleteAsignacionSemana` — pasar `semana` como parte del payload de mutación
- [x] 2.3 En `src/features/programa/semana/hooks.ts`: remover `enabled: !!semana` de `useProgramaSemana`
- [x] 2.4 En `src/features/programa/fds/hooks.ts`: remover `fecha` del hook `useUpsertAsignacionFDS` — pasar `fecha` como parte del payload de mutación
- [x] 2.5 En `src/features/programa/fds/hooks.ts`: remover `fecha` del hook `useDeleteAsignacionFDS` — pasar `fecha` como parte del payload de mutación
- [x] 2.6 En `src/features/programa/fds/hooks.ts`: remover `enabled: !!fecha` de `useProgramaFDS`

## 3. Fix páginas — call sites y manejo de error

- [x] 3.1 En `EntreSemana.tsx`: actualizar call site de `useUpsertAsignacionSemana` — remover `semana` del hook, pasar `semana` en `mutateAsync`
- [x] 3.2 En `EntreSemana.tsx`: actualizar call site de `useDeleteAsignacionSemana` — remover `semana` del hook, pasar `semana` en `mutateAsync`
- [x] 3.3 En `EntreSemana.tsx`: agregar rama `isError` con `EmptyState` y botón "Reintentar" (`refetch`)
- [x] 3.4 En `FinDeSemana.tsx`: actualizar call site de `useUpsertAsignacionFDS` — remover `fecha` del hook, pasar `fecha` en `mutateAsync`
- [x] 3.5 En `FinDeSemana.tsx`: actualizar call site de `useDeleteAsignacionFDS` — remover `fecha` del hook, pasar `fecha` en `mutateAsync`
- [x] 3.6 En `FinDeSemana.tsx`: agregar rama `isError` con `EmptyState` y botón "Reintentar" (`refetch`)
