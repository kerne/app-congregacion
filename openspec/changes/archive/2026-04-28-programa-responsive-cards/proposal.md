## Why

La tabla del programa usa dos columnas en todas las resoluciones. En mobile, los temas de las partes (especialmente SMT) son textos largos que fuerzan a las filas a crecer mucho, dejando los nombres de los asignados y asistentes apretados y difíciles de leer. El layout de tabla de dos columnas no es el correcto para pantallas pequeñas.

## What Changes

- En mobile (`< md`): cada fila del programa se convierte en una **card** apilada de columna única, con borde lateral del color de sección, tema como texto principal, y asignado + asistente debajo de una línea separadora
- En desktop (`md+`): el layout de tabla actual se mantiene sin cambios
- El `<thead>` se oculta en mobile (no tiene sentido con cards)
- Se agrega un color de borde (`border`) a `SECCION_COLORS` para identificar la sección en cada card
- El botón de edición se posiciona en la esquina superior derecha de la card en mobile

## Capabilities

### New Capabilities
- ninguna

### Modified Capabilities
- `app-congregacion`: mejora de UX mobile en la vista del programa

## Impact

- `src/core/config/programa-semana.ts` — agregar campo `border` a `SECCION_COLORS`
- `src/features/programa/semana/components/ParteRow.tsx` — layout responsive: card en mobile, tabla en desktop
- `src/features/programa/semana/components/ProgramaSemanaView.tsx` — ocultar `<thead>` en mobile, `<tbody>` como `block md:table-row-group`
- `src/features/programa/semana/components/SeccionPartes.tsx` — ajustar el header de sección para mobile
