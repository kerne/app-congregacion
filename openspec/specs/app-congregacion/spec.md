# Spec — app-congregacion (source of truth)

**Origin**: platform-v1
**Archived**: 2026-04-11

---

## SPEC-01 — Autenticación y Roles

### Escenarios

**SPEC-01.1 — Acceso anónimo**
```
DADO que un visitante accede a la URL de la app sin autenticación
CUANDO la app carga
ENTONCES DEBE poder ver el programa de la semana actual
  Y NO DEBE ver datos de contacto (teléfono, email) de los publicadores
  Y DEBE ver un botón de "Iniciar sesión" accesible
```

**SPEC-01.2 — Login con Google**
```
DADO que un usuario hace click en "Iniciar sesión con Google"
CUANDO completa el flujo de OAuth
ENTONCES el sistema DEBE verificar su email contra la tabla publicadores
  Y si el email está registrado y activo, DEBE asignarle el rol correspondiente
  Y si el email NO está registrado, DEBE tratarlo como visitante autenticado (solo lectura)
  Y DEBE redirigir al dashboard tras un login exitoso
```

**SPEC-01.3 — Sesión caducada**
```
DADO que la sesión de un usuario ha caducado
CUANDO intenta realizar cualquier acción
ENTONCES el sistema DEBE detectar el error de autenticación
  Y DEBE redirigir a la pantalla de login sin crashear la app
  Y DEBE mostrar un mensaje informativo, no un error técnico
```

**SPEC-01.4 — Primer uso del sistema**
```
DADO que no existe ningún publicador con rol admin en la base de datos
CUANDO se ejecuta la función de bootstrap (crearPrimerAdmin)
ENTONCES DEBE crearse el primer usuario con rol admin
  Y el sistema DEBE funcionar normalmente a partir de ese punto
```

---

## SPEC-02 — Gestión de Publicadores

### SPEC-02.1 — Crear publicador
```
DADO que el usuario tiene rol admin
CUANDO ingresa nombre, apellido, email y rol de un nuevo publicador y confirma
ENTONCES el sistema DEBE crear el registro en la tabla publicadores
  Y DEBE mostrar el nuevo publicador en la lista
  Y si el email ya existe, DEBE mostrar error de duplicación sin crear el registro
```

### SPEC-02.2 — Editar publicador
```
DADO que el usuario tiene rol admin
CUANDO edita los datos de un publicador existente
ENTONCES los cambios DEBEN persistir en base de datos
  Y el publicador DEBE aparecer actualizado en todos los selectores
```

### SPEC-02.3 — Desactivar publicador
```
DADO que el usuario tiene rol admin
CUANDO desactiva un publicador
ENTONCES el publicador DEBE marcarse como inactivo (no eliminado)
  Y NO DEBE aparecer en los selectores de asignación de nuevas partes
  Y DEBE seguir apareciendo en la lista de publicadores del admin (filtrable)
  Y sus asignaciones históricas DEBEN mantenerse intactas
```

### SPEC-02.4 — Cambio de rol
```
DADO que el usuario tiene rol admin
CUANDO cambia el rol de un publicador
ENTONCES el cambio DEBE reflejarse inmediatamente en los permisos de esa persona
  Y si degrada a un editor a publicador, sus accesos de escritura DEBEN removerse
```

### SPEC-02.5 — Control de acceso
```
DADO que el usuario tiene rol editor o publicador
CUANDO intenta acceder a la sección de administración de publicadores
ENTONCES DEBE ser redirigido con un mensaje de "Sin acceso"
  Y el backend DEBE rechazar cualquier mutación enviada directamente (RLS)
```

---

## SPEC-03 — Programa Entre Semana

### SPEC-03.1 — Vista del programa semanal
```
DADO que cualquier usuario accede a "Entre semana"
CUANDO la página carga
ENTONCES DEBE mostrar el programa de la semana actual por defecto
  Y las partes DEBEN agruparse por sección: Tesoros, SMT, NVC
  Y cada sección DEBE tener color diferenciado
  Y las partes sin asignado DEBEN estar visualmente marcadas como pendientes
```

### SPEC-03.2 — Navegación entre semanas
```
DADO que el usuario está en la vista Entre Semana
CUANDO hace click en "semana anterior" o "semana siguiente"
ENTONCES DEBE cargar el programa de esa semana
  Y si ya fue cargada antes, DEBE servirse desde caché (sin nueva llamada al servidor)
  Y DEBE existir un botón "Esta semana" que regrese a la semana actual
```

### SPEC-03.3 — Asignar una parte (editor/admin)
```
DADO que el usuario tiene rol editor o admin
CUANDO hace click en una parte sin asignar (o para modificarla)
ENTONCES DEBE abrirse un modal de asignación
  Y el modal DEBE mostrar solo publicadores activos en el selector
  Y si la parte tiene asistente, DEBE mostrar un segundo selector para asistente
  Y si la parte tiene tema, DEBE mostrar un campo de texto para el tema
  Y si la parte soporta sala B, DEBE mostrar un selector de sala
  Y al confirmar, la asignación DEBE guardarse y el modal cerrarse
  Y la parte DEBE mostrarse asignada inmediatamente (optimistic update o refetch)
```

### SPEC-03.4 — Eliminar una asignación (editor/admin)
```
DADO que una parte ya tiene asignado
CUANDO el editor hace click en "quitar asignación"
ENTONCES DEBE mostrarse confirmación antes de proceder
  Y al confirmar, el registro DEBE eliminarse de la base de datos
  Y la parte DEBE volver a mostrarse como pendiente
```

### SPEC-03.5 — Control de acceso escritura
```
DADO que el usuario tiene rol publicador o es visitante
CUANDO ve el programa entre semana
ENTONCES NO DEBE ver botones ni controles de edición
  Y el backend DEBE rechazar cualquier intento de inserción/modificación (RLS)
```

---

## SPEC-04 — Programa Fin de Semana

### SPEC-04.1 — Vista programa dominical
```
DADO que cualquier usuario accede a "Fin de semana"
CUANDO la página carga
ENTONCES DEBE mostrar el programa del próximo domingo por defecto
  Y DEBE mostrar las partes: Presidente, Orador (con tema), Presidente Atalaya, Lector Atalaya, Oración final
  Y las partes sin asignar DEBEN estar visualmente marcadas
```

### SPEC-04.2 — Navegación domingo a domingo
```
DADO que el usuario está en la vista Fin de Semana
CUANDO navega entre domingos
ENTONCES DEBE cargar el programa del domingo seleccionado
  Y DEBE existir botón "Este domingo"
  Y los datos ya visitados DEBEN cargarse desde caché
```

### SPEC-04.3 — Asignación con tema (orador FDS)
```
DADO que el editor asigna el orador del Discurso Público
CUANDO selecciona el publicador
ENTONCES DEBE poder ingresar el tema del discurso
  Y el tema DEBE guardarse junto con la asignación
  Y DEBE mostrarse en la vista de solo lectura del programa
```

---

## SPEC-05 — Vista Mensual

### SPEC-05.1 — Vista mensual del programa
```
DADO que cualquier usuario accede a la vista mensual
CUANDO la página carga
ENTONCES DEBE mostrar las 4-5 semanas del mes en una sola pantalla
  Y DEBE incluir tanto Entre Semana como Fin de Semana
  Y DEBE cargarse con una sola llamada al servidor (no una por semana)
  Y visitantes anónimos DEBEN poder acceder sin autenticación
```

---

## SPEC-06 — Mis Asignaciones

### SPEC-06.1 — Vista personal del publicador
```
DADO que el publicador está autenticado
CUANDO accede a "Mis asignaciones"
ENTONCES DEBE ver todas sus próximas asignaciones (fecha > hoy)
  Y DEBEN aparecer tanto asignaciones donde es el principal como donde es asistente
  Y DEBEN mostrar: fecha, parte, sección, tipo (principal/asistente)
  Y asignaciones pasadas NO DEBEN aparecer en la lista principal
```

### SPEC-06.2 — Acceso restringido
```
DADO que un visitante anónimo o no registrado navega a /mis-asignaciones
CUANDO la ruta carga
ENTONCES DEBE redirigir a la página de login
  Y tras autenticarse, DEBE volver a /mis-asignaciones
```

---

## SPEC-07 — Dashboard

### SPEC-07.1 — Estadísticas básicas
```
DADO que cualquier usuario autenticado accede al dashboard
CUANDO la página carga
ENTONCES DEBE mostrar:
  - Total de publicadores activos
  - Cantidad de asignaciones completadas esta semana
  - Cantidad de partes pendientes esta semana
```

### SPEC-07.2 — Próximas asignaciones personales
```
DADO que el publicador autenticado accede al dashboard
CUANDO la página carga
ENTONCES DEBE ver un panel con sus próximas 3 asignaciones
  Y DEBE poder navegar a "Mis asignaciones" desde ese panel
```

---

## SPEC-08 — Seguridad y RLS

### SPEC-08.1 — Aislamiento de datos de contacto
```
DADO que una consulta se realiza sin autenticación (anónimo)
CUANDO el cliente consulta publicadores o asignaciones
ENTONCES el email y teléfono de publicadores NO DEBEN devolverse
  Y la respuesta DEBE incluir solo nombre, apellido y datos del programa
```

### SPEC-08.2 — Mutaciones solo para roles autorizados
```
DADO que se intenta una operación de escritura (INSERT/UPDATE/DELETE)
CUANDO el usuario tiene rol publicador, visitante, o no está autenticado
ENTONCES Supabase DEBE rechazar la operación con error de permisos
  Y la app DEBE manejar ese error mostrando un mensaje al usuario
```

### SPEC-08.3 — Rol admin no accesible para no-admins
```
DADO que se intenta leer o modificar la tabla publicadores con cualquier operación de escritura
CUANDO el usuario NO tiene rol admin
ENTONCES Supabase DEBE rechazar la operación (RLS)
```

---

## SPEC-09 — Rendimiento y Caché

### SPEC-09.1 — Caché cliente
```
DADO que el usuario ya visitó el programa de una semana específica
CUANDO navega de regreso a esa semana
ENTONCES la app NO DEBE realizar una nueva llamada al servidor
  Y los datos DEBEN mostrarse en menos de 100ms desde caché
  Y el TTL del caché DEBE ser de al menos 60 segundos
```

### SPEC-09.2 — Carga inicial
```
DADO que un usuario accede por primera vez a la app
CUANDO el navegador carga la URL
ENTONCES la app DEBE ser interactiva en menos de 3 segundos en una conexión estándar
```

---

## SPEC-10 — Responsividad

### SPEC-10.1 — Uso en móvil
```
DADO que el usuario accede desde un dispositivo móvil (375px de ancho)
CUANDO navega por cualquier sección
ENTONCES el layout DEBE adaptarse correctamente sin scroll horizontal
  Y el sidebar DEBE estar colapsado por defecto en mobile
  Y todos los elementos interactivos DEBEN tener mínimo 44x44px de área táctil
```
