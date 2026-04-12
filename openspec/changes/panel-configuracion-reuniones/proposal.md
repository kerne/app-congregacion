## Why

Los publicadores de la congregación tienen distintos cargos (anciano, siervo ministerial, publicador, publicadora) que determinan qué partes del programa pueden realizar. Actualmente el sistema no modela este concepto, por lo que al asignar una parte el selector muestra a todos los miembros sin distinción. Esto obliga al administrador a recordar de memoria quién puede hacer qué, aumenta el riesgo de asignaciones incorrectas y no refleja la estructura real de la congregación.

## What Changes

- **Nuevo campo `cargo`** en la tabla `publicadores` con valores: `anciano`, `siervo_ministerial`, `publicador`, `publicadora`. Este campo es independiente del campo `rol` existente (que controla acceso a la app).
- **Filtrado por cargo** en el `PublicadorSelector`: cada parte del programa declara qué cargos son elegibles; el selector solo muestra candidatos válidos.
- **Panel de Configuración de Reuniones** (`/admin/configuracion-reuniones`): página admin que presenta el programa completo (entre semana + fin de semana) con el selector de publicador ya filtrado por cargo. Permite asignar publicadores a cada parte directamente desde una vista unificada.
- **Actualización del form de Publicadores**: el formulario de creación/edición expone el campo `cargo` como selector separado del campo `rol`.

## Capabilities

### New Capabilities

- `cargo-publicador`: Modelo de cargo de congregación para publicadores. Columna `cargo` en DB, tipo TypeScript `CargoCongregacion`, actualización del CRUD y del form de admin.
- `configuracion-reuniones`: Panel admin unificado que muestra entre semana y fin de semana con filtrado de publicadores por cargo por parte. Ruta `/admin/configuracion-reuniones`.

### Modified Capabilities

_(ninguna — los cambios son aditivos; las vistas existentes de entre-semana y fin-de-semana no se modifican)_

## Impact

- **DB**: nueva migración `ALTER TABLE publicadores ADD COLUMN cargo TEXT CHECK (cargo IN ('anciano', 'siervo_ministerial', 'publicador', 'publicadora'))` (nullable inicialmente)
- **RLS**: la política de lectura pública actual expone solo `id, nombre, apellido, rol`; hay que evaluar si `cargo` debe quedar expuesto públicamente (necesario para que el selector filtrado funcione en vistas de visitante)
- **Tipos TS**: `src/core/supabase/types.ts` — nuevo tipo `CargoCongregacion`, actualización de `Publicador` y `PublicadorPublico`
- **Config estática**: `src/core/config/programa-semana.ts` y `src/core/config/programa-fds.ts` — agregar `cargosPermitidos: CargoCongregacion[]` a cada `ParteSemana`/`ParteFDS`
- **Componentes**: `PublicadorSelector`, `ModalAsignacion`, form en `Publicadores.tsx`
- **Nueva feature**: `src/features/configuracion-reuniones/`
- **Router**: nueva ruta en `src/app/router.tsx`
- **Rollback**: la columna `cargo` es nullable → si se revierte, los registros sin cargo siguen funcionando; el filtrado simplemente no aplica
