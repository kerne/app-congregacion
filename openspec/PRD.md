# Product Requirements Document
## Plataforma de Administración de Reuniones — Congregación

**Versión:** 1.0
**Fecha:** 2026-04-10
**Estado:** Borrador

---

## 1. Visión del Producto

Una plataforma web centralizada que permite a las congregaciones de los Testigos de Jehová gestionar las asignaciones de las reuniones semanales (Entre Semana y Fin de Semana) de forma eficiente, reemplazando procesos manuales en papel o planillas de cálculo sueltas.

**Misión:** Reducir la carga administrativa del cuerpo de ancianos y editores, mejorar la visibilidad del programa para todos los publicadores, y garantizar que las asignaciones estén siempre disponibles y actualizadas para toda la congregación.

---

## 2. Problema

Las congregaciones administran decenas de asignaciones semanales distribuidas entre publicadores con distintos roles. Hoy, este proceso se gestiona con:

- Planillas de cálculo manuales
- Comunicación por mensajería (WhatsApp, correo)
- Cartulinas y formularios en papel

Esto genera:

- **Errores de comunicación**: asignaciones que no llegan al publicador a tiempo
- **Doble trabajo**: el editor arma el programa en un lugar y lo re-comunica en otro
- **Falta de visibilidad**: los publicadores no saben fácilmente cuándo tienen una asignación
- **Historial inexistente**: no queda registro de quién estuvo asignado en el pasado

---

## 3. Usuarios Objetivo

### 3.1 Roles del Sistema

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **Visitante anónimo** | Cualquier persona sin autenticación | Solo lectura del programa público |
| **Visitante no registrado** | Google auth pero email no registrado | Solo lectura |
| **Publicador** | Hermano/a registrado/a en la congregación | Lectura completa + ver sus asignaciones |
| **Editor** | Encargado de armar el programa | Lectura + alta/baja/modificación de asignaciones |
| **Admin** | Responsable del sistema (anciano/siervo) | Acceso total incluyendo gestión de publicadores |

### 3.2 Perfiles de Uso

**Editor semanal:** Usa la plataforma 1-2 veces por semana para ingresar o ajustar asignaciones del programa. Necesita que sea rápido, sin fricciones, preferentemente desde celular o tablet.

**Publicador:** Accede al programa para ver quién participa esta semana y confirmar sus propias asignaciones. Acceso principalmente de lectura, frecuencia alta pero corta.

**Visitante / familiar:** Accede al programa público sin necesidad de cuenta. Ve el programa de la semana pero no datos sensibles como teléfonos.

**Admin:** Gestiona la lista de publicadores (altas, bajas, cambios de rol). Accede con menor frecuencia pero con operaciones críticas.

---

## 4. Alcance del Producto

### 4.1 Dentro del Alcance (v1.0)

- Gestión de publicadores (CRUD) con roles
- Programa Entre Semana (reunión de mitad de semana)
- Programa Fin de Semana (discurso público + Atalaya)
- Asignaciones por parte del programa
- Vista "Mis asignaciones" personalizada
- Vista mensual del programa (lectura)
- Dashboard con métricas básicas
- Acceso anónimo de solo lectura al programa
- Autenticación via Google OAuth

### 4.2 Fuera del Alcance (v1.0)

- Notificaciones / recordatorios automáticos (email, push)
- Múltiples congregaciones en el mismo sistema
- Gestión de grupos de campo
- Informes de actividad mensual
- Historial de cambios (auditoría)
- Exportación a PDF / impresión del programa
- Aplicación móvil nativa

---

## 5. Estructura del Programa de Reuniones

### 5.1 Reunión Entre Semana (martes o jueves)

El programa sigue el orden establecido por la organización:

```
SALA
  - Presidente
  - Lector (Tesoros de la Biblia)
TESOROS DE LA BIBLIA
  - Discurso (10 min)
  - Seamos Mejores Maestros (8 min)
  - Búsqueda de tesoros bíblicos (10 min)
SEAMOS MEJORES MAESTROS
  - Partes de estudiantes (2-4 partes de 2-4 min, con asistente)
  - Parte en sala B (opcional, con asistente)
NUESTRA VIDA CRISTIANA
  - Canción + oración
  - Partes de vida cristiana (1-3 partes de 5-15 min)
  - Estudio bíblico de la congregación
CIERRE
  - Presidente (cierra)
```

Cada parte tiene:
- ID único estable (`parte_id`)
- Nombre
- Sección
- Tipo (discurso, demostración, estudio, etc.)
- Flags: `tieneAsistente`, `tieneSala`, `opcional`

### 5.2 Reunión Fin de Semana (domingo)

```
APERTURA
  - Presidente
DISCURSO PÚBLICO
  - Orador (con tema)
ATALAYA
  - Presidente de la Atalaya
  - Lector de la Atalaya
SERVICIOS DE CAMPO
  - Oración final
```

---

## 6. Modelo de Datos

### 6.1 Publicadores

```
id          UUID
nombre      string
apellido    string
email       string (único)
telefono    string (opcional)
rol         enum: publicador | editor | admin
activo      boolean
creado      ISO datetime
```

### 6.2 Asignaciones Entre Semana

```
id          UUID
semana      date (ISO — lunes de la semana)
parte_id    string (ref a PROGRAMA_SEMANA)
asignado_id UUID (ref publicador)
asiste_id   UUID (opcional — asistente)
tema        string (opcional)
sala        string (opcional — "principal" | "B")
notas       string (opcional)
modificado  ISO datetime
```

### 6.3 Asignaciones Fin de Semana

```
id          UUID
fecha       date (ISO — domingo)
parte_id    string (ref a PROGRAMA_FDS)
asignado_id UUID (ref publicador)
asiste_id   UUID (opcional)
tema        string (opcional)
notas       string (opcional)
modificado  ISO datetime
```

---

## 7. Requerimientos Funcionales

### RF-01 — Autenticación

| ID | Requerimiento |
|----|---------------|
| RF-01.1 | El sistema DEBE permitir acceso anónimo de solo lectura al programa |
| RF-01.2 | El sistema DEBE ofrecer autenticación via Google OAuth |
| RF-01.3 | El sistema DEBE identificar al usuario por email y determinar su rol |
| RF-01.4 | Los usuarios de Google no registrados DEBEN poder ver el programa en modo lectura |
| RF-01.5 | El admin DEBE poder crear el primer usuario en el primer arranque del sistema |

### RF-02 — Publicadores

| ID | Requerimiento |
|----|---------------|
| RF-02.1 | El admin DEBE poder crear, editar y desactivar publicadores |
| RF-02.2 | El admin DEBE poder cambiar el rol de cualquier publicador |
| RF-02.3 | El sistema DEBE prevenir la duplicación de emails |
| RF-02.4 | Los publicadores desactivados NO DEBEN aparecer en selectores de asignación |
| RF-02.5 | El admin DEBE poder ver todos los publicadores (activos e inactivos) |

### RF-03 — Programa Entre Semana

| ID | Requerimiento |
|----|---------------|
| RF-03.1 | El sistema DEBE mostrar el programa completo de la semana seleccionada |
| RF-03.2 | Las partes DEBEN agruparse por sección con colores diferenciados |
| RF-03.3 | Editores y admins DEBEN poder asignar cualquier parte a un publicador |
| RF-03.4 | El sistema DEBE soportar partes con asistente (campo `asiste_id`) |
| RF-03.5 | El sistema DEBE soportar sala principal y sala B donde corresponda |
| RF-03.6 | El sistema DEBE permitir ingresar tema para partes que lo requieran |
| RF-03.7 | El sistema DEBE permitir navegar semana a semana |
| RF-03.8 | El sistema DEBE tener un acceso directo a "esta semana" |
| RF-03.9 | El sistema DEBE mostrar claramente qué partes no tienen asignado |

### RF-04 — Programa Fin de Semana

| ID | Requerimiento |
|----|---------------|
| RF-04.1 | El sistema DEBE mostrar el programa del fin de semana seleccionado |
| RF-04.2 | El orador del discurso público DEBE poder ingresar con tema |
| RF-04.3 | El sistema DEBE permitir navegar domingo a domingo |
| RF-04.4 | El sistema DEBE tener un acceso directo a "este domingo" |

### RF-05 — Vista Mensual

| ID | Requerimiento |
|----|---------------|
| RF-05.1 | El sistema DEBE ofrecer una vista mensual de todo el programa |
| RF-05.2 | La vista mensual DEBE mostrar semana y fin de semana en una sola pantalla |
| RF-05.3 | La vista mensual DEBE ser accesible para visitantes anónimos |
| RF-05.4 | La vista mensual DEBE cargarse en una sola llamada al servidor |

### RF-06 — Mis Asignaciones

| ID | Requerimiento |
|----|---------------|
| RF-06.1 | El publicador autenticado DEBE poder ver todas sus próximas asignaciones |
| RF-06.2 | DEBEN mostrarse tanto las asignaciones donde es asignado principal como asistente |
| RF-06.3 | Las asignaciones pasadas NO DEBEN aparecer en la vista principal |
| RF-06.4 | La sección NO DEBE mostrarse para visitantes |

### RF-07 — Dashboard

| ID | Requerimiento |
|----|---------------|
| RF-07.1 | El dashboard DEBE mostrar estadísticas básicas de la congregación |
| RF-07.2 | El dashboard DEBE mostrar las próximas asignaciones personales del usuario |
| RF-07.3 | Las estadísticas DEBEN incluir: publicadores activos, asignaciones esta semana |

---

## 8. Requerimientos No Funcionales

### RNF-01 — Rendimiento

| ID | Requerimiento |
|----|---------------|
| RNF-01.1 | La carga inicial de la app DEBE completarse en menos de 3 segundos |
| RNF-01.2 | Las navegaciones entre semanas ya visitadas NO DEBEN hacer una nueva llamada al servidor (caché cliente) |
| RNF-01.3 | El TTL del caché cliente DEBE ser de 60 segundos como mínimo |
| RNF-01.4 | El backend DEBE usar caché de 60 segundos para lecturas frecuentes |

### RNF-02 — Usabilidad

| ID | Requerimiento |
|----|---------------|
| RNF-02.1 | La interfaz DEBE ser responsiva y usable en celulares (375px+) |
| RNF-02.2 | Los elementos interactivos DEBEN tener área táctil mínima de 44x44px |
| RNF-02.3 | El sidebar DEBE colapsarse en pantallas pequeñas |
| RNF-02.4 | Los estados de carga DEBEN ser visibles y no bloquear la navegación innecesariamente |

### RNF-03 — Seguridad

| ID | Requerimiento |
|----|---------------|
| RNF-03.1 | Las mutaciones (guardar, eliminar) DEBEN verificar el rol del usuario en el backend |
| RNF-03.2 | El rol del usuario NUNCA DEBE determinarse solo en el frontend |
| RNF-03.3 | Los visitantes anónimos NO DEBEN poder ver datos de contacto de publicadores |
| RNF-03.4 | El sistema DEBE manejar sesiones caducadas con gracia (recargar, no crashear) |

### RNF-04 — Disponibilidad

| ID | Requerimiento |
|----|---------------|
| RNF-04.1 | La plataforma DEBE tener dos puntos de acceso: uno público (anónimo) y uno autenticado |
| RNF-04.2 | El sistema DEBE funcionar correctamente con la zona horaria de la congregación |

---

## 9. Flujos Principales

### 9.1 Primer Uso

```
Admin ejecuta crearPrimerAdmin() en el editor
  → Accede a la URL de despliegue
  → Sistema detecta primerUso: true
  → Admin gestiona publicadores
  → Admin crea editores
  → Editores empiezan a cargar asignaciones
```

### 9.2 Carga Semanal del Programa (Editor)

```
Editor inicia sesión (Google)
  → Navega a "Entre semana"
  → Selecciona la semana a completar
  → Click en cada parte sin asignar
  → Selecciona publicador del modal
  → Ingresa tema si aplica
  → Guarda → feedback inmediato
  → Repite para "Fin de semana"
```

### 9.3 Consulta del Programa (Visitante)

```
Visitante accede a la URL pública
  → Click en "Ver como visitante"
  → Ve el programa de la semana actual
  → Puede navegar a otras semanas
  → No ve datos de contacto
```

### 9.4 Publicador Verifica Sus Asignaciones

```
Publicador inicia sesión
  → Dashboard muestra próximas asignaciones
  → Puede ir a "Mis asignaciones" para ver todo
  → Puede ver el programa completo de la semana
```

---

## 10. Estructura de Navegación

```
/ (app)
├── Dashboard
│   ├── Estadísticas de la congregación
│   └── Mis próximas asignaciones
├── Reuniones
│   ├── Entre semana (navegación semanal)
│   └── Fin de semana (navegación dominical)
│   └── [futuro] Vista mensual
├── Mis asignaciones (solo usuarios auth)
└── Administración (solo admin)
    └── Publicadores
```

---

## 11. Métricas de Éxito

| Métrica | Meta v1.0 |
|---------|-----------|
| Tiempo hasta primera asignación guardada (onboarding) | < 10 minutos |
| % de partes completadas antes de la reunión | > 90% |
| Errores de asignación duplicada o incorrecta por semana | 0 |
| Tiempo de carga inicial | < 3 segundos |
| Satisfacción de uso reportada por editores | "Más rápido que la planilla" |

---

---

## 13. Glosario

| Término | Definición |
|---------|-----------|
| **Publicador** | Miembro activo de la congregación que puede recibir asignaciones |
| **Parte** | Elemento del programa de una reunión (discurso, demostración, estudio, etc.) |
| **Asignación** | Registro que vincula una parte + semana + publicador |
| **Entre semana** | Reunión que se realiza a mitad de semana (martes o jueves) |
| **Fin de semana** | Reunión del domingo (Discurso Público + Atalaya) |
| **Asistente** | Publicador que participa como segunda persona en una parte de demostración |
| **Sala B** | Sala alternativa donde se puede dictar una parte en paralelo |
| **Editor** | Rol con permiso para gestionar asignaciones (sin acceso a publicadores) |
| **SMT** | "Seamos Mejores Maestros" — sección de la reunión entre semana |
| **NVC** | "Nuestra Vida Cristiana" — sección de la reunión entre semana |
