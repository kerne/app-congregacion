## ADDED Requirements

### Requirement: Ingreso manual del orador del Discurso Público
El sistema SHALL permitir al administrador ingresar el nombre del Orador del Discurso Público como texto libre (`orador_nombre`), en lugar de seleccionarlo de la lista de publicadores locales. Cuando `orador_nombre` está presente, se considera orador invitado y tiene prioridad para display.

#### Scenario: Admin ingresa orador invitado
- **WHEN** el admin abre el modal de asignación para "Orador Discurso Público"
- **THEN** el modal muestra un campo de texto libre para el nombre del orador
- **AND** no muestra el selector de publicadores locales

#### Scenario: Admin guarda orador invitado con nombre manual
- **WHEN** el admin ingresa un nombre en el campo de texto y guarda
- **THEN** la asignación se persiste con `orador_nombre` y `asignado_id = null`

#### Scenario: Admin edita asignación existente con orador local
- **WHEN** el admin abre el modal de una asignación existente con `asignado_id` no nulo
- **THEN** el campo de texto muestra el nombre existente del publicador local (apellido, nombre)
- **AND** el admin puede sobreescribirlo con un nombre manual

#### Scenario: Vista del programa muestra orador invitado con indicador
- **WHEN** una asignación tiene `orador_nombre` no nulo
- **THEN** la tabla muestra el texto de `orador_nombre` con un badge "Invitado"

#### Scenario: Vista del programa muestra orador local normalmente
- **WHEN** una asignación tiene `asignado_id` pero `orador_nombre` es null
- **THEN** la tabla muestra el nombre del publicador local (apellido, nombre) sin badge

#### Scenario: Constraint de integridad — al menos un campo de orador
- **WHEN** se intenta guardar una asignación de `fds_orador` sin `asignado_id` ni `orador_nombre`
- **THEN** el sistema rechaza la operación (validación en frontend y constraint en DB)
