## Why

El orador del Discurso Público puede ser un hermano de otra congregación (orador invitado). El sistema actual obliga a seleccionarlo de la lista de publicadores locales, lo que hace imposible registrar oradores visitantes. El administrador necesita poder ingresar el nombre manualmente como texto libre.

## What Changes

- La parte `fds_orador` (Orador Discurso Público) acepta un nombre en texto libre como alternativa a seleccionar de la lista de publicadores
- Se agrega el campo `orador_nombre TEXT NULL` a la tabla `asignaciones_fds` en Supabase
- El modal de asignación muestra un campo de texto para el nombre del orador (en lugar del selector de publicadores para esta parte)
- La vista del programa muestra el nombre manual si está presente, con indicador visual de "orador invitado"
- El título del discurso (`tema`) ya es texto libre — no requiere cambios

## Capabilities

### New Capabilities
- ninguna

### Modified Capabilities
- `public-programa`: actualizar cómo se muestra el orador en la vista pública cuando es invitado

## Impact

- `supabase/migrations/` — nueva migración: agregar `orador_nombre` a `asignaciones_fds`
- `src/core/supabase/types.ts` — agregar `orador_nombre` a `AsignacionFDS`
- `src/shared/components/ModalAsignacion.tsx` — mostrar input de texto para `fds_orador`
- `src/features/programa/fds/components/ProgramaFDSView.tsx` — mostrar nombre manual en tabla
- `src/core/config/programa-fds.ts` — posible flag `tieneOradorManual` en la parte `fds_orador`
