## 1. Supabase RLS — Lectura pública

- [x] 1.1 Verificar si ya existen políticas RLS para el rol `anon` en `asignaciones_semana`, `asignaciones_fds` y `publicadores`
- [x] 1.2 Crear política RLS `SELECT` para `anon` en `asignaciones_semana` (sin restricción de filas)
- [x] 1.3 Crear política RLS `SELECT` para `anon` en `asignaciones_fds` (sin restricción de filas)
- [x] 1.4 Crear política RLS `SELECT` para `anon` en `publicadores` limitada a columnas no sensibles (id, nombre, apellido, activo, rol) — excluir email, teléfono
- [x] 1.5 Verificar que INSERT/UPDATE/DELETE sigan rechazados para `anon` en todas las tablas

## 2. Router — Abrir ruta raíz

- [x] 2.1 Identificar el guard de auth que protege la ruta `/` (PrivateRoute, AuthGuard u otro)
- [x] 2.2 Remover el guard de auth exclusivamente para la ruta `/` sin afectar otras rutas protegidas
- [x] 2.3 Verificar que `/entre-semana`, `/fin-de-semana` y `/admin/*` siguen protegidas

## 3. Dashboard — Lógica de selección por día

- [x] 3.1 Identificar el componente que se renderiza en la ruta `/`
- [x] 3.2 Auditar si el componente depende de `useRequireAuth()` o equivalente de forma bloqueante
- [x] 3.3 Refactorizar para que el componente use `useOptionalAuth()` o lea el context de auth de forma no bloqueante
- [x] 3.4 Implementar función `getVistaSegunDia(): 'entre-semana' | 'fin-de-semana'` basada en `new Date().getDay()` (0,6 → fin de semana; 1-5 → entre semana)
- [x] 3.5 Conectar la función al dashboard para que renderice `ProgramaEntreSemana` o `ProgramaFinDeSemana` según corresponda

## 4. UI — Acceso y modo lectura

- [x] 4.1 Asegurar que el botón "Iniciar sesión" es visible en el dashboard para usuarios anónimos
- [x] 4.2 Verificar que el badge "Solo lectura" se muestra en el dashboard cuando no hay sesión activa
- [x] 4.3 Verificar que el panel "Mis próximas asignaciones" solo se muestra cuando hay sesión activa

## 5. Verificación manual

- [ ] 5.1 Abrir la app en incógnito (sin sesión) → verificar que carga el programa sin pedir login
- [ ] 5.2 Verificar en lunes-viernes que se muestra la vista entre semana
- [ ] 5.3 Verificar en sábado/domingo que se muestra la vista fin de semana (o simular con `Date` mock)
- [ ] 5.4 Intentar acceder a `/admin/publicadores` sin sesión → verificar redirección a login
- [ ] 5.5 Loguear como admin → verificar que los controles de edición siguen funcionando
