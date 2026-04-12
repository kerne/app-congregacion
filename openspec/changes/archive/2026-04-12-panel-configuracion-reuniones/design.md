## Context

La tabla `publicadores` tiene un campo `rol` con valores `publicador | editor | admin` que controla el **acceso a la app**. No existe ningún campo que modele el **cargo en la congregación** (anciano, siervo ministerial, etc.). El `PublicadorSelector` muestra todos los publicadores indiscriminadamente. Las configuraciones de programa (`programa-semana.ts`, `programa-fds.ts`) son arrays TS estáticos sin información de elegibilidad por cargo.

## Goals / Non-Goals

**Goals:**
- Agregar campo `cargo` a `publicadores` (DB + tipos + CRUD + UI)
- Declarar `cargosPermitidos` por parte en los configs TS estáticos
- Filtrar `PublicadorSelector` según `cargosPermitidos` de la parte activa
- Crear página `/admin/configuracion-reuniones` con vista unificada de ambas reuniones y selectores filtrados
- Agregar acceso desde el `AdminPanel`

**Non-Goals:**
- Hacer `cargosPermitidos` configurable desde la UI (queda hardcoded en TS)
- Modificar las páginas existentes `/entre-semana` y `/fin-de-semana`
- Restricciones de género en partes específicas (p. ej. partes SMT solo publicadoras)

## Decisions

### D1 — `cargo` como columna en `publicadores`, no tabla separada

**Elegido**: columna `cargo TEXT CHECK (cargo IN ('anciano', 'siervo_ministerial', 'publicador', 'publicadora'))` nullable.

**Alternativa descartada**: tabla `cargos` con FK. Overkill para un valor que es enum fijo del dominio JW. Una congregación no inventa nuevos cargos.

**Rationale**: una columna nullable es la migración más simple, compatible con registros existentes (no rompe nada), y se puede completar retroactivamente con script.

---

### D2 — `cargosPermitidos` en config TS estático, no en DB

**Elegido**: agregar `cargosPermitidos: CargoCongregacion[]` a `ParteSemana` y `ParteFDS` en los archivos de configuración existentes.

**Alternativa descartada**: tabla `config_partes(parte_id, cargo)` en DB con UI de edición. Requiere más tablas, más RLS, más queries, y el admin de una congregación típica nunca necesita cambiar qué cargos pueden dar el Estudio Bíblico.

**Rationale**: la estructura del programa JW es estable institucionalmente. Un cambio en elegibilidad sería un cambio de requerimiento, no de configuración en producción.

---

### D3 — `cargo` expuesto en la vista pública de publicadores

**Elegido**: incluir `cargo` en `COLS_PUBLICAS` y en `PublicadorPublico`.

**Rationale**: el filtrado del `PublicadorSelector` ocurre en el frontend; para poder filtrar necesita conocer el cargo. La vista de visitante también se beneficia de mostrar el cargo junto al nombre en las asignaciones.

**Implicancia RLS**: la política `public_read` de `publicadores` ya permite leer `id, nombre, apellido, rol` a usuarios autenticados. Agregar `cargo` no es información sensible.

---

### D4 — Panel de Configuración como nueva feature separada

**Elegido**: nueva feature en `src/features/configuracion-reuniones/` con su propia página, hooks y componentes.

**Alternativa descartada**: modificar las páginas existentes de entre-semana/fin-de-semana. Las páginas existentes están orientadas a navegar semana a semana; el panel de configuración tiene una vista "atemporal" del programa.

**Rationale**: separación de responsabilidades. Las páginas de programa navegan asignaciones por semana/fecha. El panel de configuración presenta la estructura del programa como un todo para asignar publicadores.

---

### D5 — El panel de configuración reutiliza `ModalAsignacion` existente

El modal ya soporta `ParteSemana | ParteFDS`, `publicadores[]`, y callbacks de save/delete. Solo hace falta pasarle una lista de publicadores pre-filtrada por `cargosPermitidos`.

## Risks / Trade-offs

- **Datos incompletos en producción**: los publicadores existentes tendrán `cargo = NULL`. El filtrado funcionará igual (si `cargosPermitidos` está definido y el publicador no tiene cargo, no aparecerá en el selector). Requiere completar los cargos vía script o edición manual antes de usar el panel. → **Mitigación**: documentar el paso en las tasks; proveer el script de seed.
- **`cargo` vs `rol` — confusión semántica**: hay dos conceptos de rol en el mismo dominio. El form de Publicadores debe usar labels muy claros: "Cargo en la congregación" vs "Rol en la app". → **Mitigación**: labels explícitos en UI.
- **Asistentes en partes SMT no se filtran igual**: el asistente de una parte de estudiantes puede ser cualquier publicador/a, no solo los del cargo del orador. El `ModalAsignacion` pasa la misma lista para `asignado` y `asistente`. → **Mitigación**: agregar prop `cargosAsistente` opcional a `ModalAsignacion`; si está vacío, muestra todos.
- **Parte `cierre` repite al presidente**: el presidente que abre la reunión es el mismo que la cierra, pero se asignan como partes separadas. No se modela restricción de "mismo publicador" — queda a criterio del admin. → Sin acción requerida.

## Migration Plan

1. Deploy migration `006_cargo_publicadores.sql` (nullable — no rompe nada existente)
2. Completar cargos de publicadores existentes via script o admin UI
3. Deploy frontend con nueva columna, filtros y panel

**Rollback**: revertir la migración con `ALTER TABLE publicadores DROP COLUMN cargo` — los queries TS que usan `cargo` devolverán undefined sin crashear (campo optional en el tipo).
