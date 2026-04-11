## Context

La implementación actual del change `roles-admin-visitante` completó la diferenciación funcional: controles de edición ocultos para visitantes, sección admin condicional en Sidebar, AdminPanel con cards de navegación. Sin embargo la experiencia de cada rol no está *diseñada* — está derivada. El visitante ve la UI del admin con elementos removidos. El admin tiene un panel que es solo una lista de links.

Estado del código:
- `AdminPanel.tsx`: 3 cards estáticas, sin datos de estado operativo
- `ProgramaSemanaView` / `ProgramaFDSView`: tabla genérica, `canEdit` solo afecta la columna de botones
- `Sidebar.tsx`: `requiresAuth` filtra "Mis asignaciones" para no-autenticados — esto FUNCIONA correctamente; el ítem no aparece cuando `!user`
- Empty states en programa: único estado vacío genérico sin distinción de rol

## Goals / Non-Goals

**Goals:**
- AdminPanel muestra stats de estado de la semana actual (partes pendientes ES y FDS)
- Páginas de programa muestran badge "Solo lectura" al visitante para claridad de modo
- Empty states diferenciados: visitante ve mensaje informativo, admin ve mensaje accionable
- Sidebar ya correcto — confirmar comportamiento, no cambiar

**Non-Goals:**
- No rediseñar el layout general ni el sistema de navegación
- No cambiar el diseño de la tabla de programa (columnas, secciones, colores)
- No agregar paginación ni filtros al AdminPanel
- No tocar la lógica de autenticación ni RLS
- No agregar modo "edición inline" (el modal actual es suficiente)

## Decisions

**D1 — Stats del AdminPanel mediante hooks existentes**
El AdminPanel leerá el programa de la semana actual y el próximo domingo usando los hooks `useProgramaSemana` y `useProgramaFDS` ya disponibles. Calcula partes sin asignado en el cliente a partir del array retornado. Alternativa descartada: nueva query SQL dedicada → agrega complejidad innecesaria cuando los hooks ya traen los datos.

**D2 — Badge "Solo lectura" como chip en el header de página**
Cuando `!isAdmin()`, se muestra un `<Badge variant="secondary">Solo lectura</Badge>` inline junto al título de la página. No es un banner ni un modal de aviso — es un indicador discreto y persistente. Alternativa descartada: banner superior → demasiado intrusivo para algo que el visitante ya "sabe".

**D3 — Empty states como prop de ProgramaSemanaView / ProgramaFDSView**
Se agrega una prop `emptyMessage?: string` a los componentes de vista. Si `canEdit` es true, el mensaje es accionable ("No hay asignaciones — asigná partes"); si false, es informativo ("El programa de esta semana no está disponible aún"). La lógica de qué mensaje mostrar vive en las pages, no en los view components — los view components son presentacionales.

**D4 — Sidebar: confirmar comportamiento actual**
La revisión del código confirma que `Mis asignaciones` ya tiene `requiresAuth: true` y es filtrado cuando `!user`. No hay trabajo aquí. El prop `requiresAuth` funciona correctamente.

## Risks / Trade-offs

- [Stats del AdminPanel hacen 2 queries extras] → Aceptado. Son las mismas queries que usaría si el admin fuera directo a esas páginas. Con React Query el caché las reutiliza si ya fueron cargadas.
- [La semana "actual" puede estar vacía sin que sea un error] → El contador de pendientes muestra "0 pendientes" sin confundir al admin — se cuida el copy.
- [Badge "Solo lectura" agrega ruido visual a la experiencia visitante frecuente] → El badge usa `variant="secondary"` (tono bajo), no es intrusivo.

## Migration Plan

1. Implementar cambios de frontend (sin deploy previo de DB necesario)
2. Deploy automático a Vercel al mergear a `main`
3. Sin rollback complejo — todos los cambios son aditivos
