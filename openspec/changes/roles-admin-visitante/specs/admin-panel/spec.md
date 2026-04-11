## ADDED Requirements

### Requirement: Panel de administración accesible solo al admin
El sistema SHALL proveer una página `/admin` que sirva como punto de entrada centralizado para las tareas administrativas. Solo usuarios con `rol === 'admin'` DEBEN poder acceder.

#### Scenario: Admin accede al panel
- **WHEN** un usuario con rol `admin` navega a `/admin`
- **THEN** el sistema DEBE mostrar una página con accesos rápidos a Publicadores, Programa Entre Semana y Programa Fin de Semana

#### Scenario: Visitante intenta acceder al panel
- **WHEN** un usuario sin rol `admin` intenta navegar a `/admin`
- **THEN** el sistema DEBE redirigirlo a `/` y mostrar un mensaje "No tenés acceso a esta sección"

### Requirement: Sección de administración en el Sidebar
El Sidebar SHALL mostrar una sección "Administración" con links a `/admin` y `/admin/publicadores` únicamente cuando el usuario autenticado tiene `rol === 'admin'`.

#### Scenario: Sidebar para admin
- **WHEN** el usuario tiene `rol === 'admin'`
- **THEN** el Sidebar DEBE mostrar la sección "Administración" con los links correspondientes

#### Scenario: Sidebar para visitante
- **WHEN** el usuario no tiene `rol === 'admin'` (incluye anónimo y autenticado sin rol)
- **THEN** el Sidebar NO DEBE renderizar la sección "Administración" ni sus links en el DOM

### Requirement: Controles de edición en programa solo visibles al admin
Las páginas de programa (Entre Semana y Fin de Semana) SHALL mostrar controles de asignación (botones, formularios, selectores de publicador) únicamente al admin.

#### Scenario: Admin ve controles de edición
- **WHEN** el usuario con rol `admin` accede a `/entre-semana` o `/fin-de-semana`
- **THEN** DEBE ver botones de asignar, editar y eliminar asignaciones

#### Scenario: Visitante ve solo lectura
- **WHEN** un usuario sin rol `admin` accede a `/entre-semana` o `/fin-de-semana`
- **THEN** DEBE ver el programa en modo lectura, sin controles de edición visibles ni accesibles
- **AND** NO DEBE ver ningún botón de asignar, editar o eliminar

#### Scenario: Estado de carga
- **WHEN** `loading === true` en el contexto de auth
- **THEN** los controles de edición NO DEBEN renderizarse hasta que `loading === false`
