## 1. Google Cloud Console — Credenciales OAuth

- [ ] 1.1 Crear (o seleccionar) un proyecto en Google Cloud Console para esta app
- [ ] 1.2 Habilitar la Google+ API (o "Google Identity") en el proyecto
- [ ] 1.3 Crear credenciales OAuth 2.0 (tipo: Web Application)
- [ ] 1.4 Copiar el Supabase Callback URL desde Dashboard → Authentication → Providers → Google y agregarlo como Authorized redirect URI en Google Cloud Console
- [ ] 1.5 Guardar el Client ID y Client Secret generados (usar un gestor de contraseñas o vault)

## 2. Supabase — Activar Proveedor Google

- [ ] 2.1 Abrir Supabase Dashboard → Authentication → Providers → Google
- [ ] 2.2 Activar el proveedor y pegar el Client ID y Client Secret obtenidos en la tarea 1.5
- [ ] 2.3 Verificar que el Supabase Callback URL coincide con el registrado en Google Cloud Console (tarea 1.4)
- [ ] 2.4 Guardar la configuración

## 3. Bootstrap del Primer Admin

- [ ] 3.1 Verificar que la migración `002_rls_policies.sql` fue aplicada y la función `crear_primer_admin(nombre, apellido, email)` existe en Supabase (ya está implementada en el código)
- [ ] 3.2 Ejecutar `SELECT crear_primer_admin('Nombre', 'Apellido', 'email@gmail.com')` en el Supabase SQL Editor con los datos del primer admin
- [ ] 3.3 Verificar el registro en la tabla `publicadores` con `rol = 'admin'` y `activo = true`

## 4. Verificación del Flujo Completo

- [ ] 4.1 Abrir la app en producción y hacer click en "Continuar con Google"
- [ ] 4.2 Completar el flujo OAuth con la cuenta Google del admin registrado
- [ ] 4.3 Verificar que la app redirige al dashboard con rol `admin` activo
- [ ] 4.4 Verificar que `RequireRole` protege correctamente las rutas de admin
- [ ] 4.5 Probar con una cuenta Google NO registrada en `publicadores`: debe quedar como visitante (sin acceso a rutas protegidas)

## 5. Documentación

- [ ] 5.1 Documentar el proceso de configuración del proveedor Google en un archivo `docs/setup-google-oauth.md` (o equivalente) para futuros mantenedores
- [ ] 5.2 Listar todas las variables de entorno requeridas y su origen (Supabase URL, Anon Key, etc.)
