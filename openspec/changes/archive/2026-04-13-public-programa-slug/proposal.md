## Why

Los visitantes anónimos no pueden ver el programa de reuniones de una congregación. Hoy el sistema requiere autenticación + membresía para resolver `congregacionId`, y las RLS policies solo permiten lectura a miembros. El admin necesita poder compartir un link público (ej: `/c/norte-quilmes/entre-semana`) para que cualquier persona vea el programa sin registrarse.

## What Changes

- **Nuevo campo `slug`** en tabla `congregaciones`: TEXT UNIQUE, generado automáticamente desde el nombre al crear la congregación (kebab-case). Migración para asignar slug a congregaciones existentes.
- **Nuevas rutas públicas**: `/c/:slug/entre-semana` y `/c/:slug/fin-de-semana` que resuelven el slug a `congregacion_id` y muestran el programa en modo solo lectura.
- **Nuevas RLS policies anon**: permitir SELECT en `congregaciones` (solo slug+nombre), `asignaciones_semana`, `asignaciones_fds`, y `publicadores` (solo nombre+apellido) para usuarios no autenticados, filtrado por `congregacion_id`.
- **UI para copiar link público**: en el panel de admin, el administrador puede ver y copiar el link público de su congregación.
- **Hook `useSlugResolver`**: resuelve slug → congregacionId consultando Supabase.

## Capabilities

### New Capabilities
- `public-programa`: Acceso público al programa de reuniones vía slug en URL, sin autenticación requerida. Incluye resolución de slug, rutas públicas, policies anon, y UI de link sharing.

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

- **Supabase schema**: ALTER TABLE `congregaciones` (nuevo campo `slug`), nueva migración
- **RLS policies**: 4 nuevas policies `anon` (congregaciones, publicadores, asignaciones_semana, asignaciones_fds)
- **Router**: nuevas rutas bajo `/c/:slug/*`
- **Componentes**: nuevos wrappers públicos para EntreSemana/FinDeSemana (sin modal de edición), o reutilización con `canEdit={false}`
- **AdminPanel**: nuevo botón/sección para copiar link público
- **Rollback**: DROP COLUMN slug + DROP policies anon. Las rutas públicas dejan de funcionar pero el resto de la app no se ve afectado.
