## Context

Actualmente el badge "Pendiente" en `ParteRow.tsx` y `ProgramaFDSView.tsx` se renderiza siempre que no haya asignación, independientemente del rol del usuario. La prop `canEdit` ya fluye hasta ambos componentes y es `true` solo para admins — es la señal correcta para condicionar la visibilidad.

No hay cambios de base de datos ni de RLS: las asignaciones pendientes simplemente no existen como filas en Supabase, por lo que no hay datos sensibles que ocultar a nivel de query. El cambio es puramente de presentación.

## Goals / Non-Goals

**Goals:**
- Ocultar el badge "Pendiente" para visitantes autenticados y rutas públicas (`/c/:slug/...`)
- Mantener el badge visible para el admin (`canEdit: true`)
- Aplicar el cambio en ambas vistas: entre semana (`ParteRow`) y fin de semana (`ProgramaFDSView`)

**Non-Goals:**
- Cambios en RLS o queries de Supabase
- Ocultar filas completas (la parte sigue visible, solo sin el badge)
- Cambios en el flujo de autenticación

## Decisions

### Usar `canEdit` como señal de visibilidad
`canEdit` ya existe, ya se propaga correctamente, y semánticamente cubre el caso: si no podés editar, no necesitás saber que algo está pendiente.

**Alternativa descartada:** agregar una nueva prop `showPending`. Innecesario — `canEdit` cubre exactamente este caso de uso sin añadir superficie de API.

### Celda vacía en lugar de guión o texto alternativo
Cuando no hay asignación y el usuario no es admin, la celda queda en blanco. Un guión ("—") o texto como "Por asignar" también expone que la parte no tiene asignado, lo cual sigue siendo información de gestión interna.

## Risks / Trade-offs

- **Riesgo bajo**: cambio de 2 líneas en 2 componentes, sin lógica nueva
- **Trade-off visual**: en la vista de visitante, las partes sin asignar pueden parecer que simplemente no tienen asignado todavía — que es exactamente lo que queremos mostrar
