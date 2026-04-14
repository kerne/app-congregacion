## Context

Config actual tiene 13 partes, varias incorrectas. Se alinea con la estructura real de la reunión.

## Goals / Non-Goals

**Goals:** Config refleja fielmente las partes asignables de la reunión entre semana.
**Non-Goals:** Modelar canciones, oraciones de apertura, o info no-asignable.

## Decisions

- `lectura_biblia`: sección `tesoros`, `tieneSala: true`, `tieneAsistente: false`, `tieneTema: true`, cargos TODOS
- `lector_estudio`: sección `nvc`, sin tema, sin asistente, cargos AM
- `oracion_final`: sección `cierre`, sin tema, cargos AM
- Eliminar `lector_tesoros` y `mejores_maestros` — no corresponden a partes reales
