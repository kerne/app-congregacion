## MODIFIED Requirements

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
