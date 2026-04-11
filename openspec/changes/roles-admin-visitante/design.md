## Context

La app tiene roles definidos en la base de datos (`admin`, `editor` en `publicadores.rol`) y RLS policies que restringen escritura al admin. Sin embargo, el frontend no diferencia la UI: las páginas de programa muestran los mismos controles a todos, y no existe una sección de administración consolidada. El hook `useCurrentUser` ya expone `rol` y `loading`, lo que permite implementar condicionales sin nueva infraestructura.

Estado actual:
- `Sidebar`: muestra todos los items sin distinción de rol
- `EntreSemana` / `FinDeSemana`: renderizan controles de edición para todos
- `/admin/publicadores`: protegida con `RequireRole(['admin'])` — único uso de rol en UI

## Goals / Non-Goals

**Goals:**
- Renderizar controles de edición en páginas de programa solo cuando `rol === 'admin'`
- Agregar sección "Administración" en Sidebar visible solo al admin
- Crear una página `/admin` como panel de acceso rápido para el admin
- Redirigir visitantes que intenten acceder a rutas admin con mensaje informativo

**Non-Goals:**
- No modificar el esquema de DB ni las RLS (ya correctas tras fix-admin-permisos)
- No exponer el rol `editor` en la UI (simplificación deliberada: admin vs visitante)
- No agregar permisos granulares por publicador (fuera de scope)
- No cambiar la lógica de autenticación OAuth

## Decisions

**D1 — Renderizado condicional en páginas de programa**
Los botones/formularios de asignación usan `rol === 'admin'` directamente desde `useCurrentUser()`. Alternativa descartada: prop drilling desde el router → agrega complejidad innecesaria para algo que ya está disponible via contexto.

**D2 — Sidebar con sección admin condicional**
El Sidebar lee `rol` del contexto y renderiza una sección "Administración" solo si `rol === 'admin'`. Incluye links a `/admin` y `/admin/publicadores`. No se oculta la sección con CSS — se excluye del DOM directamente para no filtrar rutas en el HTML.

**D3 — Página `/admin` como hub de administración**
Ruta nueva protegida con `RequireRole(['admin'])`. Muestra cards de acceso rápido: Publicadores, Programa Entre Semana, Programa Fin de Semana. No duplica funcionalidad — solo es un punto de entrada.

**D4 — Simplificación de roles en UI: admin vs visitante**
El rol `editor` existe en DB pero no se expone en la UI en este cambio. El frontend trata como visitante a cualquier usuario que no sea `admin`. Esto es consistente con el modelo de permisos actual donde el admin es el único operador de la app.

## Risks / Trade-offs

- [Rol `editor` invisible en UI] → Aceptado deliberadamente. Si en el futuro se necesita, se agrega como cambio separado. La DB ya soporta el valor.
- [Visitante autenticado vs anónimo tienen la misma UI] → Aceptado. Ambos son solo lectura; no hay beneficio en diferenciarlos en esta versión.
- [Flasheo de UI durante loading] → Mitigación: los controles de edición usan `loading` del contexto — no renderizan hasta que `loading === false`.

## Migration Plan

1. Implementar cambios de frontend (sin deploy previo de DB necesario)
2. Deploy automático a Vercel al mergear a `main`
3. Sin rollback complejo — los cambios son aditivos (agregar condicionales y rutas)
