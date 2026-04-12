## ADDED Requirements

### Requirement: Cargo de congregación en publicadores
La tabla `publicadores` SHALL incluir un campo `cargo` que representa el cargo que el miembro ocupa en la congregación. Los valores válidos son: `anciano`, `siervo_ministerial`, `publicador`, `publicadora`. Este campo es nullable para compatibilidad con registros existentes.

#### Scenario: Publicador sin cargo asignado
- **WHEN** un publicador existe en la tabla sin cargo definido
- **THEN** el campo `cargo` retorna `null` y no causa error en ninguna operación

#### Scenario: Asignación de cargo válido
- **WHEN** el administrador edita un publicador y selecciona un cargo válido
- **THEN** el sistema persiste el cargo en DB y lo refleja en la UI inmediatamente

#### Scenario: Rechazo de cargo inválido
- **WHEN** se intenta guardar un publicador con un valor de `cargo` fuera del enum permitido
- **THEN** la DB rechaza la operación con error de CHECK constraint y la UI muestra error

#### Scenario: RLS — lectura pública del cargo
- **WHEN** un usuario autenticado (visitante o admin) consulta publicadores
- **THEN** el campo `cargo` es visible en la respuesta junto con `id`, `nombre`, `apellido`, `rol`

---

### Requirement: Formulario de publicador muestra cargo separado de rol de app
El formulario de creación y edición de publicadores SHALL presentar dos campos distintos con labels explícitos: "Cargo en la congregación" (campo `cargo`) y "Rol en la app" (campo `rol`), para evitar confusión semántica.

#### Scenario: Creación de publicador con cargo
- **WHEN** el administrador completa el formulario de nuevo publicador incluyendo un cargo
- **THEN** el publicador se crea con ambos valores: `rol` (acceso a app) y `cargo` (congregación)

#### Scenario: Edición de cargo sin cambiar rol de app
- **WHEN** el administrador edita el cargo de un publicador existente sin tocar el campo `rol`
- **THEN** solo `cargo` se actualiza en DB; `rol` permanece sin cambios

#### Scenario: Cargo opcional en creación
- **WHEN** el administrador crea un publicador sin seleccionar cargo
- **THEN** el publicador se crea con `cargo = null` sin error de validación
