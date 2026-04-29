## 1. Base de datos

- [x] 1.1 Crear migración `010_orador_nombre_fds.sql`: hacer `asignado_id` nullable en `asignaciones_fds`, agregar columna `orador_nombre TEXT NULL`, agregar constraint `CHECK (asignado_id IS NOT NULL OR orador_nombre IS NOT NULL)`

## 2. Tipos y configuración

- [x] 2.1 En `src/core/supabase/types.ts`: agregar `orador_nombre: string | null` a `AsignacionFDS`, hacer `asignado_id` nullable (`string | null`)
- [x] 2.2 En `src/core/config/programa-fds.ts`: agregar campo `tieneOradorManual: boolean` a la interfaz `ParteFDS`, setear `tieneOradorManual: true` en la parte `fds_orador`, `false` en el resto

## 3. Modal de asignación

- [x] 3.1 En `src/shared/components/ModalAsignacion.tsx`: agregar `orador_nombre?: string` al schema Zod y a `AsignacionFormData`, hacer `asignado_id` opcional en el schema
- [x] 3.2 En `ModalAsignacion`: cuando `parte.tieneOradorManual === true`, reemplazar el `PublicadorSelector` por un `<Input>` de texto controlado por `orador_nombre`
- [x] 3.3 En `ModalAsignacion`: agregar `orador_nombre` a `asignacionActual` props y a los `defaultValues` del form

## 4. API y persistencia

- [x] 4.1 En `src/features/programa/fds/api.ts`: incluir `orador_nombre` en el payload del upsert, pasar `asignado_id: null` cuando solo hay `orador_nombre`

## 5. Vista del programa

- [x] 5.1 En `src/features/programa/fds/components/ProgramaFDSView.tsx`: mostrar `asignacion.orador_nombre` si existe (con badge "Invitado"), sino mostrar `asignacion.asignado?.apellido, nombre` como antes
