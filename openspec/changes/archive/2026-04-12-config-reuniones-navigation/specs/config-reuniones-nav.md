## Capability: config-reuniones-nav

### Requirements

1. La ruta `/admin/configuracion-reuniones` muestra una vista de selección con 2 cards
2. Cada card muestra: ícono representativo, título ("Entre Semana" / "Fin de Semana"), y descripción breve
3. Las cards son clicables y navegan a sus respectivas sub-rutas
4. La ruta `/admin/configuracion-reuniones/entre-semana` muestra la configuración de la reunión entre semana
5. La ruta `/admin/configuracion-reuniones/fin-de-semana` muestra la configuración de la reunión fin de semana
6. Cada sub-ruta incluye un enlace/botón para volver a la vista de cards
7. Cada sub-ruta carga los publicadores activos y los pasa al componente de sección correspondiente
8. Las sub-rutas son accesibles directamente por URL (deep-linking)

### Scenarios

**Scenario: Navegación desde cards**
- Given el usuario está en `/admin/configuracion-reuniones`
- When hace click en la card "Entre Semana"
- Then navega a `/admin/configuracion-reuniones/entre-semana`
- And ve la configuración de la reunión entre semana con navegador de semanas

**Scenario: Volver a cards**
- Given el usuario está en `/admin/configuracion-reuniones/entre-semana`
- When hace click en "Volver"
- Then navega a `/admin/configuracion-reuniones`
- And ve las 2 cards de selección

**Scenario: Deep-link directo**
- Given el usuario accede directamente a `/admin/configuracion-reuniones/fin-de-semana`
- Then ve la configuración de la reunión fin de semana
- And puede volver a la vista de cards
