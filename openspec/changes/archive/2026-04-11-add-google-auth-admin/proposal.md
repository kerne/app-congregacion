## Why

El código frontend de autenticación Google ya existe (`Login.tsx`, `AuthProvider.tsx`, `AuthCallback.tsx`) pero el proveedor Google OAuth **no está activado en Supabase**, por lo que el botón "Continuar con Google" falla en producción. Se necesita configurar las credenciales de Google Cloud Console, activar el proveedor en Supabase y documentar el proceso de creación del primer admin.

## What Changes

- Activar el proveedor Google OAuth en el proyecto Supabase (Client ID + Client Secret)
- Crear credenciales OAuth 2.0 en Google Cloud Console con los redirect URIs correctos
- Agregar las variables de entorno necesarias en Vercel
- Implementar y documentar la función `crearPrimerAdmin` (bootstrap del primer usuario admin)
- Verificar que el flujo completo funciona: login → callback → asignación de rol por email

## Capabilities

### New Capabilities

- `google-oauth-setup`: Configuración del proveedor Google OAuth en Supabase y Google Cloud Console, incluyendo el proceso de bootstrap del primer admin y variables de entorno requeridas.

### Modified Capabilities

_(ninguna — los specs existentes de SPEC-01 ya cubren el comportamiento esperado)_

## Impact

- **Supabase**: Sección Authentication → Providers → Google (activar + credenciales)
- **Google Cloud Console**: Nuevo OAuth 2.0 Client ID con redirect URIs de Supabase y Vercel
- **Vercel**: Variables de entorno (si se necesitan adicionales)
- **Base de datos**: Tabla `publicadores` — función `crearPrimerAdmin` para el bootstrap
- **Código**: Sin cambios de código frontend (ya implementado)
- **Rollback**: Desactivar el proveedor Google en Supabase revierte sin impacto en código
