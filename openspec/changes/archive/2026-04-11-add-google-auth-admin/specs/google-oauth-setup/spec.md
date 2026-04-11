## ADDED Requirements

### Requirement: Proveedor Google OAuth activo en Supabase

El sistema MUST tener el proveedor Google OAuth configurado en Supabase Authentication con Client ID y Client Secret válidos de Google Cloud Console, de modo que `signInWithOAuth({ provider: 'google' })` complete el flujo sin error.

#### Scenario: Flujo OAuth exitoso

- **WHEN** el usuario hace click en "Continuar con Google" en la página de login
- **THEN** el navegador redirige a la pantalla de consentimiento de Google
- **AND** tras autenticarse, Google redirige al callback de Supabase
- **AND** Supabase crea la sesión y redirige a `/auth/callback` de la app
- **AND** `AuthCallback.tsx` intercambia el code por sesión y redirige al dashboard

#### Scenario: Proveedor no configurado

- **WHEN** el proveedor Google no tiene credenciales válidas en Supabase
- **THEN** `signInWithOAuth` retorna un error
- **AND** la app MUST mostrar el mensaje de error al usuario sin crashear

---

### Requirement: Redirect URI registrado en Google Cloud Console

El proyecto OAuth en Google Cloud Console MUST tener el Supabase Callback URL registrado como Authorized redirect URI para que Google acepte el redirect post-autenticación.

#### Scenario: URI válido registrado

- **WHEN** Supabase redirige a Google con el `redirect_uri` de Supabase
- **THEN** Google acepta el redirect sin error `redirect_uri_mismatch`
- **AND** el flujo continúa al callback de Supabase

#### Scenario: URI no registrado

- **WHEN** el Supabase Callback URL no está en la lista de Authorized redirect URIs de Google
- **THEN** Google retorna `Error 400: redirect_uri_mismatch`
- **AND** el flujo de autenticación se interrumpe

---

### Requirement: Bootstrap del primer admin (`crearPrimerAdmin`)

El sistema MUST proveer un mecanismo para insertar el primer usuario con rol `admin` en la tabla `publicadores` cuando la tabla está vacía, sin requerir autenticación previa.

#### Scenario: Creación del primer admin

- **WHEN** se ejecuta la función SQL `crearPrimerAdmin` con el email de la cuenta Google del admin
- **THEN** se inserta un registro en `publicadores` con `rol = 'admin'` y `activo = true`
- **AND** ese email puede iniciar sesión con Google y obtener acceso admin completo

#### Scenario: Primer admin ya existe

- **WHEN** ya existe al menos un publicador con `rol = 'admin'` en la base de datos
- **THEN** la función NO MUST crear duplicados
- **AND** MUST retornar un mensaje indicando que ya existe un admin

#### Scenario: Admin accede después del bootstrap

- **WHEN** el admin ejecuta el flujo de Google OAuth con el email registrado
- **THEN** `AuthProvider` carga el publicador desde la tabla
- **AND** `rol` queda seteado como `'admin'`
- **AND** el usuario puede acceder a las secciones protegidas por `RequireRole`

---

### Requirement: Variables de entorno documentadas

El proyecto MUST documentar todas las variables de entorno requeridas para que Google OAuth funcione, tanto para desarrollo local como para producción en Vercel.

#### Scenario: Variables presentes en todos los entornos

- **WHEN** la app inicia en cualquier entorno (local, preview, production)
- **THEN** `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` están disponibles
- **AND** el proveedor Google en Supabase tiene Client ID y Client Secret configurados vía Supabase Dashboard (no expuestos en el frontend)
