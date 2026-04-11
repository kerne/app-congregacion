# Spec — admin-panel (source of truth)

**Origin**: roles-admin-visitante
**Synced**: 2026-04-11 (rediseno-vistas-admin-visitante)

---

## SPEC-01 — Panel de Administración

### Requirement: Panel de administración accesible solo al admin
El sistema SHALL proveer una página `/admin` que sirva como punto de entrada centralizado para las tareas administrativas, mostrando el estado operativo de la semana actual además de accesos rápidos. Solo usuarios con `rol === 'admin'` DEBEN poder acceder.

#### Scenario: Admin accede al panel con semana con datos
- **WHEN** un usuario con rol `admin` navega a `/admin` y existen asignaciones para la semana actual
- **THEN** el sistema DEBE mostrar el número de partes sin asignar en Entre Semana esta semana
- **AND** DEBE mostrar el número de partes sin asignar en el próximo domingo de Fin de Semana
- **AND** DEBE mostrar accesos rápidos a Publicadores, Programa Entre Semana y Programa Fin de Semana

#### Scenario: Admin accede al panel con semana sin datos
- **WHEN** un usuario con rol `admin` navega a `/admin` y no hay asignaciones cargadas para la semana actual
- **THEN** el sistema DEBE mostrar "0 partes pendientes" sin mostrar error
- **AND** DEBE mostrar los accesos rápidos normalmente

#### Scenario: Visitante intenta acceder al panel
- **WHEN** un usuario sin rol `admin` intenta navegar a `/admin`
- **THEN** el sistema DEBE redirigirlo a `/` y mostrar un mensaje "No tenés acceso a esta sección"

---

## SPEC-02 — Sidebar con Sección de Administración

### Requirement: Sección de administración en el Sidebar
El Sidebar SHALL mostrar una sección "Administración" con links a `/admin` y `/admin/publicadores` únicamente cuando el usuario autenticado tiene `rol === 'admin'`.

#### Scenario: Sidebar para admin
- **WHEN** el usuario tiene `rol === 'admin'`
- **THEN** el Sidebar DEBE mostrar la sección "Administración" con los links correspondientes

#### Scenario: Sidebar para visitante
- **WHEN** el usuario no tiene `rol === 'admin'` (incluye anónimo y autenticado sin rol)
- **THEN** el Sidebar NO DEBE renderizar la sección "Administración" ni sus links en el DOM

---

## SPEC-03 — Controles de Edición en Programa

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
