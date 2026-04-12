## Why

El dashboard del programa de reuniones necesita ser visible públicamente sin requerir login, diferenciando entre la vista de entre semana (martes/jueves) y fin de semana (sábado/domingo). Esto permite que miembros de la congregación accedan al programa sin fricción de autenticación.

## What Changes

- El dashboard principal (`/`) mostrará el programa sin requerir autenticación
- La vista mostrada dependerá del día actual:
  - **Entre semana** (lunes a viernes): muestra el programa `entre-semana`
  - **Fin de semana** (sábado y domingo): muestra el programa `fin-de-semana`
- Las rutas de edición (`/entre-semana`, `/fin-de-semana`) continúan protegidas por autenticación (solo admin)
- El rol de usuario no cambia: admin puede editar, el resto solo visualiza
- **No se elimina el sistema de auth**, solo se expone la vista de lectura del dashboard sin requerir login

## Capabilities

### New Capabilities
- `public-dashboard`: Vista pública del programa de reuniones, sin autenticación requerida, con selección automática de vista según el día de la semana

### Modified Capabilities
- `app-congregacion`: El flujo de navegación cambia — el dashboard raíz es ahora público; el guard de auth aplica solo a rutas de edición

## Impact

- `src/App.tsx` o router principal: ajustar guards de autenticación para excluir la ruta `/`
- `src/pages/` o componente de dashboard: debe funcionar sin sesión de usuario (no llamar a `supabase.auth.getUser()` de forma bloqueante)
- Supabase RLS: las tablas `asignaciones_semana` y `asignaciones_fds` necesitan políticas de lectura pública (`SELECT` permitido sin autenticación) o se usa `anon` key con permisos de lectura
- No hay breaking changes en la API ni en las rutas de admin
