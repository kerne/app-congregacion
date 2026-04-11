## Why

La experiencia actual del visitante es "admin con botones removidos" — no está diseñada para lectura, está degradada desde admin. El panel de administración es navegación disfrazada de panel: tres cards que son links, sin ningún contexto operativo sobre el estado real de la semana. Ningún rol tiene indicación visual de qué modo está usando la app.

## What Changes

- **AdminPanel → Command Center**: agregar stats en tiempo real (partes sin asignar esta semana, estado del próximo domingo) antes de los accesos rápidos
- **Indicador de modo lectura en páginas de programa**: cuando `!isAdmin`, mostrar un badge/chip sutil "Solo lectura" en el header de EntreSemana y FinDeSemana
- **Empty states diferenciados por rol**: cuando el programa de una semana está vacío, el visitante ve "El programa no ha sido cargado todavía" (informativo), el admin ve "No hay asignaciones — empezá asignando partes" (accionable)
- **Sidebar del visitante simplificado**: "Mis asignaciones" no debe aparecer para usuarios no autenticados (actualmente aparece en el DOM y redirige al click); limpiar el footer del sidebar
- **Header de páginas de programa enriquecido**: el admin ve el conteo de partes pendientes de la semana actual inline en el header, como contexto rápido sin tener que entrar al AdminPanel

## Capabilities

### New Capabilities

_(ninguna — todos los cambios son mejoras a capacidades existentes)_

### Modified Capabilities

- `admin-panel`: El panel deja de ser solo navegación y pasa a mostrar estado operativo de la semana actual (partes pendientes Entre Semana y próximo domingo FDS)
- `app-congregacion`: Actualizar SPEC-01.5 (acceso por rol en la interfaz) — agregar requisito de indicador visual de modo lectura para visitantes; actualizar SPEC-03 y SPEC-04 para empty states diferenciados por rol

## Impact

- **Componentes afectados**:
  - `src/features/admin/pages/AdminPanel.tsx` — agregar stats con queries al estado de la semana actual
  - `src/features/programa/semana/pages/EntreSemana.tsx` — badge modo lectura en header
  - `src/features/programa/fds/pages/FinDeSemana.tsx` — badge modo lectura en header
  - `src/app/layout/Sidebar.tsx` — ocultar "Mis asignaciones" cuando `!user`
  - `src/features/programa/semana/components/ProgramaSemanaView.tsx` — empty state diferenciado
  - `src/features/programa/fds/components/ProgramaFDSView.tsx` — empty state diferenciado
- **Sin cambios en Supabase**: las queries de stats reutilizan hooks existentes o añaden queries read-only sobre tablas ya expuestas
- **Sin breaking changes**: todos los cambios son aditivos o mejoran lógica existente
