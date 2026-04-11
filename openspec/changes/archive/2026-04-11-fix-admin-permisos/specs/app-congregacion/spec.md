## MODIFIED Requirements

### Requirement: Autenticación y acceso por rol — normalización de email
El sistema SHALL comparar emails de forma case-insensitive en todas las capas (SQL y cliente) para garantizar que el rol del usuario se resuelve correctamente independientemente de la capitalización.

#### Scenario: Admin con email en mayúsculas puede operar
- **WHEN** un usuario con rol `admin` en la tabla `publicadores` tiene email con capitalización mixta (ej. `Admin@ejemplo.com`)
- **THEN** el sistema DEBE resolver su rol correctamente como `admin`
- **AND** DEBE poder insertar y actualizar publicadores y asignaciones

#### Scenario: get_user_rol retorna rol correcto con diferencia de capitalización
- **WHEN** `auth.users.email` difiere en capitalización respecto a `publicadores.email`
- **THEN** la función `get_user_rol()` DEBE retornar el rol correcto (no NULL)
- **AND** las RLS policies DEBEN evaluar correctamente las operaciones del usuario

#### Scenario: fetchPublicador normaliza email antes de la query
- **WHEN** el sistema autentica a un usuario y busca su publicador correspondiente
- **THEN** el email DEBE compararse en minúsculas en ambos lados de la query
