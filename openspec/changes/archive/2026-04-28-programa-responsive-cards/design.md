## Context

La tabla del programa usa `<table>/<tr>/<td>` con dos columnas fijas. En desktop funciona bien. En mobile, los temas largos del SMT (3-4 líneas) expanden las filas verticalmente y comprimen los nombres en la columna derecha. La solución es aplicar `display: block` a los elementos de tabla en mobile para que cada fila se comporte como una card.

**Técnica:** Tailwind responsive display (`block md:table-row`, `hidden md:table-cell`, etc.) permite cambiar el layout sin duplicar HTML.

**Colores de sección actuales:**
- apertura: slate
- tesoros: amber
- smt: blue
- nvc: emerald
- cierre: slate

## Goals / Non-Goals

**Goals:**
- Cards en mobile con borde lateral del color de sección, tema como texto principal, asignado + asistente stacked abajo
- Desktop sin cambios — tabla actual intacta
- Botón de edición en esquina superior derecha de la card en mobile; columna de acciones normal en desktop

**Non-Goals:**
- Cambiar el layout del `ProgramaFDSView` (fin de semana) — queda para otro change si se decide
- Animaciones o transiciones

## Decisions

### `display: block` con Tailwind responsive
Usar clases `block md:table-row` / `block md:table-cell` / `block md:table-row-group` en los elementos de tabla. Cada `<tr>` se convierte en block en mobile, permitiendo styling como card. No requiere duplicar JSX.

**Alternativa descartada:** dos componentes separados (mobile/desktop) con `hidden md:block`. Duplica lógica y aumenta superficie de mantenimiento.

### Contenido duplicado en mobile dentro del primer `<td>`
En mobile, el asignado y el asistente se muestran dentro del primer `<td>` (con `md:hidden`). En desktop, el segundo `<td>` los muestra normalmente (`hidden md:table-cell`). El botón de edición sigue la misma estrategia.

### Campo `border` en `SECCION_COLORS`
Agrega `border: string` a cada entrada para mantener los colores de acento centralizados en la config.

### Contenedor outer sin borde en mobile
El `div` wrapper de `ProgramaSemanaView` pierde su `border` y `rounded-lg` en mobile — en mobile no tiene sentido un borde sobre las cards.

## Risks / Trade-offs

- **`colSpan` no aplica en `block`**: El header de sección (`<td colSpan={3}>`) necesita `w-full` explícito en mobile para ocupar todo el ancho.
- **Riesgo bajo**: los cambios son CSS-only en el frontend, no afectan datos ni lógica.
