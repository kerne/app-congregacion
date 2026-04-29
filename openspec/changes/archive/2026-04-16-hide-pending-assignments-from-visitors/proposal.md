## Why

El badge "Pendiente" en las partes del programa es información interna del administrador — indica que falta asignar a alguien. Un visitante o acceso público no necesita saber eso: solo debe ver las partes ya confirmadas. Mostrarlo genera confusión y expone el estado interno de gestión a personas ajenas al proceso.

## What Changes

- El badge "Pendiente" **solo se muestra cuando el usuario tiene rol admin** (`canEdit: true`)
- En modo visitante autenticado y en las rutas públicas (`/c/:slug/...`), las partes sin asignación se muestran como una fila vacía (sin badge, sin texto)
- No se cambia ningún dato — es puramente una diferencia de presentación según el rol

## Capabilities

### New Capabilities
- ninguna

### Modified Capabilities
- `public-programa`: agregar requisito de ocultar partes pendientes en vistas públicas y de visitante

## Impact

- `src/features/programa/semana/components/ParteRow.tsx` — condición para el badge "Pendiente"
- `src/features/programa/fds/components/` — mismo ajuste para las partes de fin de semana
- `openspec/specs/public-programa/spec.md` — nuevo requisito de visibilidad
