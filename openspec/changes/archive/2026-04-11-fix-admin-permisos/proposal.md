## Why

Un administrador autenticado no puede agregar publicadores ni asignaciones de reuniones. La causa raíz son dos bugs en la capa de RLS de Supabase: (1) la función `get_user_rol()` compara emails de forma case-sensitive, lo que hace que retorne `NULL` si existe cualquier diferencia de capitalización entre `auth.users.email` y `publicadores.email`; (2) la policy `pub_update_admin` carece de la cláusula `WITH CHECK`, lo que puede rechazar updates en PostgreSQL 14+. Cuando `get_user_rol()` retorna `NULL`, todas las comparaciones de la forma `NULL = 'admin'` evalúan a `NULL` (lógica ternaria SQL), que las RLS policies interpretan como `FALSE` → acceso denegado.

## What Changes

- **Fix `get_user_rol()`**: Agregar `LOWER()` en la comparación de email para hacer la búsqueda case-insensitive
- **Fix `crear_primer_admin()`**: Normalizar el email a minúsculas al insertar el primer admin
- **Fix `pub_update_admin` policy**: Agregar `WITH CHECK (get_user_rol() = 'admin')` junto al `USING` existente
- **Fix `fetchPublicador` en AuthProvider**: Normalizar el email a minúsculas antes de la query, para consistencia con la capa SQL
- **Nueva migración SQL**: `003_fix_rls_email_normalization.sql`

## Capabilities

### New Capabilities

*(ninguna)*

### Modified Capabilities

- `app-congregacion`: Correcciones en RLS y autenticación — el admin puede insertar/actualizar correctamente

## Impact

- **Archivos afectados**:
  - `supabase/migrations/003_fix_rls_email_normalization.sql` (nuevo)
  - `src/features/auth/AuthProvider.tsx`
- **Sin cambios en el frontend de features**: Las páginas de publicadores, entre semana y fin de semana no cambian
- **Sin breaking changes**: La normalización de email es backward-compatible; datos existentes con email en minúsculas no se ven afectados
- **Requiere aplicar la migración en Supabase**: El archivo SQL debe ejecutarse en el dashboard de Supabase o via `supabase db push`
