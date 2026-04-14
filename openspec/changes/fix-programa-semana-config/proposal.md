## Why

El config de programa-semana no refleja la estructura real de la reunión entre semana. Tiene partes que no existen (`lector_tesoros`, `mejores_maestros`) y le faltan partes reales (`lectura_biblia`, `lector_estudio`, `oracion_final`).

## What Changes

- **Eliminar** `lector_tesoros` y `mejores_maestros` del config y seed
- **Agregar** `lectura_biblia` (sección tesoros, estudiante con sala, sin asistente)
- **Agregar** `lector_estudio` (sección nvc, antes del estudio de congregación)
- **Agregar** `oracion_final` (sección cierre, hermano designado)
- **Actualizar** seed y reset.sql para reflejar los nuevos IDs

## Capabilities

### New Capabilities
### Modified Capabilities

## Impact

- `src/core/config/programa-semana.ts` — config de partes
- `supabase/seed.sql` — asignaciones dummy
- `supabase/reset.sql` — no afectado (no tiene partes hardcodeadas)
- Asignaciones existentes con `lector_tesoros` o `mejores_maestros` quedarán huérfanas (la base se resetea)
