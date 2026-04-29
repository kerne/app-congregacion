## 1. Config

- [x] 1.1 En `src/core/config/programa-semana.ts`: agregar campo `border: string` a la interfaz y a cada entrada de `SECCION_COLORS` (slate-400, amber-500, blue-500, emerald-500, slate-400)

## 2. Contenedor

- [x] 2.1 En `ProgramaSemanaView.tsx`: quitar `border` y `rounded-lg` del wrapper en mobile (`md:rounded-lg md:border`), ocultar `<thead>` en mobile (`hidden md:table-header-group`)

## 3. Sección header

- [x] 3.1 En `SeccionPartes.tsx`: hacer `<tbody>` block en mobile (`block md:table-row-group`), hacer el `<tr>` del header block (`block md:table-row`), y el `<td>` del header con `block w-full md:table-cell` para que ocupe todo el ancho sin colSpan en mobile

## 4. ParteRow responsive

- [x] 4.1 En `ParteRow.tsx`: hacer `<tr>` block en mobile con card styling — `block md:table-row`, padding lateral, `rounded-lg md:rounded-none`, `border-l-4 md:border-l-0 {colors.border}`, `shadow-sm md:shadow-none`, margen vertical entre cards (`my-1.5 md:my-0`)
- [x] 4.2 En `ParteRow.tsx`: hacer el primer `<td>` (parte/tema) `block md:table-cell`; agregar dentro un bloque `md:hidden` con el asignado + asistente + badge Sala B + badge Pendiente (para mobile)
- [x] 4.3 En `ParteRow.tsx`: agregar botón de edición `md:hidden` dentro del primer `<td>` en mobile, posicionado en flex row con el contenido del tema (justify-between)
- [x] 4.4 En `ParteRow.tsx`: hacer el segundo `<td>` (asignado) `hidden md:table-cell` — solo visible en desktop
- [x] 4.5 En `ParteRow.tsx`: hacer el tercer `<td>` (acciones/editar) `hidden md:table-cell` — solo visible en desktop
