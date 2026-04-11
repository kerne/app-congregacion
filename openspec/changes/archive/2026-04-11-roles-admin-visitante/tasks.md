## 1. Sidebar adaptivo por rol

- [x] 1.1 Leer `rol` y `loading` desde `useCurrentUser()` en `Sidebar.tsx`
- [x] 1.2 Agregar sección "Administración" en el Sidebar visible solo cuando `rol === 'admin'`
- [x] 1.3 Incluir link a `/admin` (Panel) y `/admin/publicadores` (Publicadores) en la sección admin

## 2. Página panel de administración

- [x] 2.1 Crear `src/features/admin/pages/AdminPanel.tsx` con cards de acceso rápido
- [x] 2.2 Agregar ruta `/admin` en `router.tsx` protegida con `RequireRole(['admin'])`
- [x] 2.3 Importar `AdminPanel` en el router (lazy opcional dado el tamaño)

## 3. Controles de edición condicionales — Entre Semana

- [x] 3.1 Leer `rol` desde `useCurrentUser()` en `EntreSemana.tsx` (o en el componente de vista que renderiza controles)
- [x] 3.2 Envolver botones / formularios de asignación con `{!loading && rol === 'admin' && (...)}`
- [x] 3.3 Verificar que en modo visitante el programa se muestra correctamente sin controles

## 4. Controles de edición condicionales — Fin de Semana

- [x] 4.1 Leer `rol` desde `useCurrentUser()` en `FinDeSemana.tsx` (o componente de vista)
- [x] 4.2 Envolver botones / formularios de asignación con `{!loading && rol === 'admin' && (...)}`
- [x] 4.3 Verificar que en modo visitante el programa se muestra correctamente sin controles

## 5. Verificación end-to-end

- [ ] 5.1 Probar flujo admin: login → Sidebar muestra sección Admin → acceso a `/admin` y `/admin/publicadores`
- [ ] 5.2 Probar flujo visitante anónimo: accede a `/` → ve programa sin controles de edición → no ve sección Admin
- [ ] 5.3 Probar visitante autenticado sin rol: login con Google de cuenta no registrada → mismo comportamiento que visitante anónimo
- [ ] 5.4 Probar redirect: visitante intenta navegar a `/admin` → redirige a `/` con toast de acceso denegado

