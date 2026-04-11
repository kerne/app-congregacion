## MODIFIED Requirements

### Requirement: Acceso por rol en la interfaz
El sistema SHALL diferenciar visualmente la interfaz según el rol del usuario autenticado. Un usuario con `rol === 'admin'` DEBE tener acceso completo a las funciones de gestión. Un visitante (anónimo o autenticado sin rol admin) DEBE tener acceso de solo lectura al programa.

#### Scenario: Acceso anónimo
- **WHEN** un visitante accede a la URL de la app sin autenticación
- **THEN** DEBE poder ver el programa de la semana actual en modo lectura
- **AND** NO DEBE ver controles de edición de asignaciones
- **AND** NO DEBE ver la sección "Administración" en el Sidebar
- **AND** DEBE ver un botón de "Iniciar sesión" accesible

#### Scenario: Login con Google — usuario registrado como admin
- **WHEN** un usuario con rol `admin` en la tabla `publicadores` completa el flujo OAuth
- **THEN** el sistema DEBE asignarle el rol `admin` en el contexto de la app
- **AND** DEBE mostrar la sección "Administración" en el Sidebar
- **AND** DEBE mostrar controles de edición en las páginas de programa

#### Scenario: Login con Google — usuario no registrado
- **WHEN** un usuario completa el flujo OAuth pero su email no está en `publicadores`
- **THEN** el sistema DEBE tratarlo como visitante (solo lectura)
- **AND** NO DEBE mostrar controles de edición ni sección de administración
