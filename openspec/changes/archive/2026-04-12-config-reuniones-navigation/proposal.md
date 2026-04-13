## Why

La pantalla de Configuración de Reuniones actualmente muestra las dos secciones (Entre Semana y Fin de Semana) apiladas verticalmente en una sola página. Esto obliga al usuario a hacer scroll para alternar entre reuniones y genera una interfaz pesada. Se necesita una navegación independiente donde cada tipo de reunión tenga su propia vista, accesible desde un menú de cards o sub-rutas.

## What Changes

- Convertir la página monolítica `ConfiguracionReuniones` en un layout con navegación por cards
- Cada card lleva a una sub-ruta dedicada: `/admin/configuracion-reuniones/entre-semana` y `/admin/configuracion-reuniones/fin-de-semana`
- La ruta base `/admin/configuracion-reuniones` muestra las cards de navegación
- Agregar sub-rutas anidadas en el router para cada sección
- Reutilizar los componentes `SeccionConfigES` y `SeccionConfigFDS` existentes sin modificarlos

## Capabilities

### New Capabilities
- `config-reuniones-nav`: Navegación independiente por tipo de reunión en la pantalla de configuración, con cards como punto de entrada y sub-rutas dedicadas para cada sección

### Modified Capabilities

## Impact

- `src/features/configuracion-reuniones/pages/ConfiguracionReuniones.tsx` — se refactoriza como layout con cards
- `src/app/router.tsx` — se agregan sub-rutas anidadas bajo `admin/configuracion-reuniones`
- Nuevas páginas wrapper para cada sección (Entre Semana y Fin de Semana)
- No hay cambios en base de datos, RLS, ni APIs
- No hay breaking changes
