## ADDED Requirements

### Requirement: Filtrado de publicadores por cargo elegible por parte
Cada parte del programa (entre semana y fin de semana) SHALL declarar estáticamente qué cargos son elegibles. El `PublicadorSelector` SHALL recibir una lista pre-filtrada y mostrar únicamente publicadores con cargo elegible.

#### Scenario: Parte con cargos restringidos — selector filtrado
- **WHEN** el administrador abre el modal de asignación para una parte que tiene `cargosPermitidos` definidos
- **THEN** el selector de publicador muestra únicamente publicadores activos cuyo `cargo` está en la lista `cargosPermitidos`

#### Scenario: Parte sin restricción de cargo — selector muestra todos
- **WHEN** el administrador abre el modal de asignación para una parte sin `cargosPermitidos` definidos (lista vacía o ausente)
- **THEN** el selector muestra todos los publicadores activos sin filtrar

#### Scenario: Publicador con cargo null — excluido de partes con filtro
- **WHEN** un publicador no tiene `cargo` asignado y la parte tiene `cargosPermitidos` definidos
- **THEN** ese publicador NO aparece en el selector de esa parte

#### Scenario: Asistente de parte SMT no se filtra por cargo
- **WHEN** el administrador selecciona el asistente para una parte de estudiantes (SMT)
- **THEN** el selector de asistente muestra todos los publicadores activos sin restricción de cargo

---

### Requirement: Panel de Configuración de Reuniones
El sistema SHALL proveer una página en `/admin/configuracion-reuniones` accesible solo para administradores. La página SHALL mostrar el programa completo de ambas reuniones (entre semana y fin de semana) con la semana/fecha actual preseleccionada, y permitir asignar publicadores a cada parte con selectores filtrados por cargo.

#### Scenario: Acceso restringido a administradores
- **WHEN** un usuario sin rol `admin` intenta acceder a `/admin/configuracion-reuniones`
- **THEN** el sistema redirige o muestra mensaje de acceso denegado

#### Scenario: Vista inicial con semana/fecha actual
- **WHEN** el administrador navega al panel de configuración
- **THEN** la vista carga la semana actual (lunes) para entre semana y el próximo día de reunión FDS

#### Scenario: Asignación desde el panel — entre semana
- **WHEN** el administrador hace clic en una parte de la reunión entre semana y selecciona un publicador elegible
- **THEN** la asignación se persiste en `asignaciones_semana` y el panel refleja el nombre asignado

#### Scenario: Asignación desde el panel — fin de semana
- **WHEN** el administrador hace clic en una parte de la reunión fin de semana y selecciona un publicador elegible
- **THEN** la asignación se persiste en `asignaciones_fds` y el panel refleja el nombre asignado

#### Scenario: Eliminación de asignación desde el panel
- **WHEN** el administrador abre el modal de una parte ya asignada y hace clic en "Quitar asignación"
- **THEN** la asignación se elimina de DB y la parte vuelve a mostrar estado "Pendiente"

#### Scenario: Navegación entre semanas desde el panel
- **WHEN** el administrador usa los controles de navegación de semana
- **THEN** el panel recarga las asignaciones para la semana seleccionada manteniendo el foco en la reunión activa

---

### Requirement: Acceso rápido al panel desde AdminPanel
El `AdminPanel` SHALL incluir un card de acceso al panel de configuración de reuniones junto a los accesos existentes.

#### Scenario: Card visible para administradores
- **WHEN** un administrador accede al panel de administración (`/admin`)
- **THEN** ve un card "Configuración de reuniones" con enlace a `/admin/configuracion-reuniones`
