## Context

El modal `ModalAsignacion` usa `asignado_id` (obligatorio, FK a `publicadores`) para todas las partes. Para `fds_orador` esto impide registrar oradores visitantes de otras congregaciones. Se necesita una vía de ingreso manual de nombre sin vincularlo a un publicador local.

**Estado actual:**
- `asignaciones_fds.asignado_id` es `NOT NULL` (FK a `publicadores`)
- `ModalAsignacion` siempre muestra `PublicadorSelector` para el campo principal
- No existe campo de texto libre para el nombre del orador

## Goals / Non-Goals

**Goals:**
- Permitir ingresar el nombre del orador del Discurso Público como texto libre
- El campo `orador_nombre` tiene prioridad sobre `asignado_id` para display
- Cuando se usa nombre manual, `asignado_id` puede ser null
- Indicar visualmente "orador invitado" en la tabla del programa

**Non-Goals:**
- Cambiar otras partes del programa (solo `fds_orador`)
- Sistema de oradores visitantes con historial o base de datos propia
- Modificar cómo funciona el selector de publicadores para las demás partes

## Decisions

### Campo `orador_nombre TEXT NULL` en `asignaciones_fds`
Agregar el campo a la tabla en lugar de reutilizar `notas`. Semánticamente distinto y permite queries claras.

**Alternativa descartada:** usar el campo `notas` existente. Mezcla datos de naturaleza diferente y complica el display.

### `asignado_id` pasa a nullable en `asignaciones_fds`
Cuando se usa nombre manual, no hay publicador local asociado. La constraint pasa de `NOT NULL` a `CHECK (asignado_id IS NOT NULL OR orador_nombre IS NOT NULL)` — siempre hay al menos uno de los dos.

**Alternativa descartada:** mantener `asignado_id NOT NULL` y usar un publicador "placeholder". Introduce datos falsos en la base.

### Flag `tieneOradorManual: boolean` en `ParteFDS`
Agrega una señal explícita en la config para que el modal sepa cuándo mostrar texto libre en lugar del selector. Solo `fds_orador` lo tendrá en `true`.

**Alternativa:** detectar por `parte.id === 'fds_orador'` inline. Más frágil y hardcodea un ID en la lógica de UI.

### Modal muestra solo input de texto para `fds_orador`
Cuando `parte.tieneOradorManual === true`, el campo "Publicador" se reemplaza por un `<Input>` de texto libre controlado por `orador_nombre`. Se elimina el selector de publicadores para esta parte.

### Display: badge "Invitado" cuando `orador_nombre` está presente
En `ProgramaFDSView`, si `asignacion.orador_nombre` existe, se muestra como nombre con un badge pequeño "Invitado" para diferenciar visualmente de un publicador local.

## Risks / Trade-offs

- **Migración con ALTER TABLE**: hacer `asignado_id` nullable requiere DROP CONSTRAINT + ADD CONSTRAINT. Bajo riesgo en Supabase con datos reales — la migración es aditiva.
- **`AsignacionFormData` diverge por tipo de parte**: el schema de Zod necesita manejar que `asignado_id` sea opcional cuando `orador_nombre` está presente. Se resuelve con un schema discriminado o con `refine()`.

## Migration Plan

1. Migración SQL: `ALTER TABLE asignaciones_fds ALTER COLUMN asignado_id DROP NOT NULL` + `ADD COLUMN orador_nombre TEXT` + constraint CHECK
2. Actualizar tipos TypeScript (`AsignacionFDS`)
3. Actualizar config (`programa-fds.ts`)
4. Actualizar modal (`ModalAsignacion`)
5. Actualizar vista (`ProgramaFDSView`)
6. Verificar que las asignaciones existentes (con `asignado_id`) siguen funcionando sin cambios
