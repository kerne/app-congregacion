## Why

La app actualmente no diferencia visualmente la experiencia entre un visitante y un administrador: el menú de navegación y las páginas de asignaciones aparecen igual para todos, y no existe una sección de administración integrada que unifique la gestión de publicadores y asignaciones. El admin necesita una experiencia clara y directa para operar sin confusión.

## What Changes

- **Rol admin**: puede ingresar y editar asignaciones entre semana y fin de semana, gestionar publicadores
- **Rol visitante**: acceso de solo lectura al programa; no ve controles de edición
- **Sidebar adaptivo**: muestra sección "Administración" solo a usuarios con rol `admin`
- **Páginas de asignaciones protegidas**: `EntreSemana` y `FinDeSemana` muestran controles de edición únicamente al admin (formularios, botones de asignar, eliminar)
- **Redirección de no-admin**: si un visitante intenta acceder a rutas de admin, se redirige con mensaje informativo

## Capabilities

### New Capabilities

- `admin-panel`: Sección de administración integrada accesible solo para admin — gestión de publicadores y acceso rápido a asignaciones

### Modified Capabilities

- `app-congregacion`: Actualizar SPEC-01 (roles y acceso) — visitante ve solo lectura, admin ve controles de edición en todas las páginas de programa

## Impact

- **Archivos afectados**:
  - `src/app/layout/Sidebar.tsx` — mostrar sección Admin condicionalmente
  - `src/app/router.tsx` — proteger rutas de admin panel
  - `src/features/programa/semana/pages/EntreSemana.tsx` — controles de edición solo visibles al admin
  - `src/features/programa/fds/pages/FinDeSemana.tsx` — controles de edición solo visibles al admin
  - `src/features/dashboard/pages/Dashboard.tsx` — mostrar acciones rápidas admin
- **Sin cambios en Supabase**: el esquema de roles ya existe en la DB (`admin`, `editor` en `publicadores.rol`); los permisos RLS ya cubren la restricción de escritura
- **Sin breaking changes**: el rol `editor` existente en DB se mantiene; el frontend simplifica a `admin` vs visitante (no-admin)
