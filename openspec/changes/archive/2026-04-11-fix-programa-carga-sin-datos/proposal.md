## Why

Las páginas "Entre semana" y "Fin de semana" quedan mostrando el skeleton infinitamente o cargan pero muestran la tabla vacía sin datos. La investigación reveló cuatro bugs en la capa de datos y la UI: la API puede retornar `null` en lugar de `[]`, los errores de Supabase nunca se muestran al usuario, y las mutaciones no invalidan el cache correctamente al navegar entre semanas.

## What Changes

- **Fix null en API**: Las funciones `getAsignacionesSemana` y `getAsignacionesFDS` retornan `data ?? []` en lugar de castear `null` como array
- **Manejo de estado de error en UI**: EntreSemana y FinDeSemana muestran un estado de error cuando la query falla, en lugar de tabla vacía silenciosa
- **Mutaciones con parámetro en lugar de closure**: `useUpsertAsignacionSemana` y `useDeleteAsignacionSemana` reciben la fecha/semana directamente en `mutationFn`, no en el closure del hook, para garantizar que el cache correcto se invalida
- **Remover `enabled: !!semana`**: La fecha inicial nunca es falsy (se inicializa en el `useState`), la condición es innecesaria y puede causar queries deshabilitadas en transiciones de estado

## Capabilities

### New Capabilities

*(ninguna — este cambio es solo bugfixes)*

### Modified Capabilities

- `app-congregacion`: Correcciones en carga del programa — comportamiento correcto ante errores y datos vacíos

## Impact

- **Archivos afectados**:
  - `src/features/programa/semana/api.ts`
  - `src/features/programa/fds/api.ts`
  - `src/features/programa/semana/hooks.ts`
  - `src/features/programa/fds/hooks.ts`
  - `src/features/programa/semana/pages/EntreSemana.tsx`
  - `src/features/programa/fds/pages/FinDeSemana.tsx`
- **Sin cambios de backend**: No afecta Supabase, RLS, ni schemas
- **Sin breaking changes**: Las interfaces de los hooks no cambian externamente
