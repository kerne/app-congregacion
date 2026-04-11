## Context

El frontend ya tiene el flujo OAuth completo implementado: `Login.tsx` invoca `signInWithOAuth({ provider: 'google' })`, `AuthCallback.tsx` intercambia el code por sesión, y `AuthProvider.tsx` carga el perfil desde la tabla `publicadores` basándose en el email del usuario autenticado.

Lo que falta es la **capa de infraestructura**: el proveedor Google en Supabase no está activado, y el proyecto OAuth en Google Cloud Console no existe. Sin eso, el botón de login falla inmediatamente.

Estado actual:
- ✅ Código frontend completo
- ❌ Google OAuth Provider en Supabase: no configurado
- ❌ Google Cloud Console: sin credenciales
- ❌ Función bootstrap `crearPrimerAdmin`: no implementada

## Goals / Non-Goals

**Goals:**
- Activar Google OAuth en Supabase con credenciales reales
- Registrar la app en Google Cloud Console con los redirect URIs correctos
- Implementar `crearPrimerAdmin` para el bootstrap del primer admin (SPEC-01.4)
- Documentar el proceso de configuración para futuros mantenedores

**Non-Goals:**
- Cambiar el código frontend (ya funciona)
- Soporte para otros proveedores OAuth (solo Google)
- SSO empresarial / SAML
- Restricción de dominio de email (cualquier Google account puede iniciar sesión; el rol lo determina la tabla `publicadores`)

## Decisions

### D1 — Redirect URI de Supabase como intermediario

**Decisión**: Usar el redirect URI de Supabase (`https://<project>.supabase.co/auth/v1/callback`) en Google Cloud Console, NO la URL de Vercel directamente.

**Rationale**: Supabase actúa como el servidor OAuth. El callback de Supabase intercambia el code de Google, crea la sesión, y luego redirige al `redirectTo` de la app (`/auth/callback`). Esta es la arquitectura estándar de Supabase Auth.

**Alternativa descartada**: Registrar `https://app.vercel.app/auth/callback` directamente en Google. Esto requeriría manejar el intercambio OAuth manualmente sin usar Supabase Auth.

---

### D2 — Bootstrap admin via SQL migration

**Decisión**: Implementar `crearPrimerAdmin` como una función SQL invocable desde el Supabase dashboard, no como un Edge Function ni endpoint REST.

**Rationale**: El bootstrap es una operación de una sola vez que requiere permisos de servicio (bypassa RLS). Una función SQL en el dashboard es más simple, más segura (no expone un endpoint HTTP), y es suficiente para el caso de uso.

**Alternativa descartada**: Edge Function con service role key. Introduce complejidad innecesaria y un endpoint HTTP que hay que proteger.

---

### D3 — Sin restricción de dominio en Supabase

**Decisión**: No configurar allowlist de emails en Supabase. El control de acceso lo hace la tabla `publicadores`.

**Rationale**: `AuthProvider.tsx` ya implementa este patrón: si el email no está en `publicadores`, el usuario queda como visitante anónimo. No hay necesidad de una segunda capa de restricción en Supabase.

## Risks / Trade-offs

- **[Risk] Credenciales de Google hardcodeadas en env vars** → Mitigation: Usar Vercel Environment Variables, nunca commitear. Agregar `.env.local` a `.gitignore` si no está.
- **[Risk] Múltiples redirect URIs en Google Cloud Console** → Mitigation: Registrar tanto el URI de Supabase prod como el de staging/preview si existen.
- **[Risk] Primera sesión de admin sin publicador en DB** → Mitigation: Ejecutar `crearPrimerAdmin` SQL antes de que el admin intente loguearse, o inmediatamente después de su primer login fallido.

## Migration Plan

1. Crear proyecto en Google Cloud Console → habilitar Google+ API → generar OAuth 2.0 credentials
2. Copiar Client ID y Client Secret → pegarlos en Supabase Dashboard → Authentication → Providers → Google
3. Copiar el Supabase Callback URL → registrarlo como Authorized redirect URI en Google Cloud Console
4. Crear la función SQL `crearPrimerAdmin` en Supabase → ejecutarla con el email del primer admin
5. Verificar flujo completo en producción: login → callback → dashboard con rol admin
6. **Rollback**: En Supabase, desactivar el proveedor Google. Cero cambios de código.

## Open Questions

- ¿Cuál es el email de la cuenta Google que actuará como primer admin?
- ¿Hay un entorno de staging en Supabase separado, o solo producción?
