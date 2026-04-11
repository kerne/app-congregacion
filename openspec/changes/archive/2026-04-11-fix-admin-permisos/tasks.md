## 1. Fix capa SQL — Supabase

- [x] 1.1 Crear `supabase/migrations/003_fix_rls_email_normalization.sql`
- [x] 1.2 `CREATE OR REPLACE FUNCTION get_user_rol()` con `LOWER()` en comparación de email
- [x] 1.3 `CREATE OR REPLACE FUNCTION crear_primer_admin()` normalizando email con `LOWER(p_email)`
- [x] 1.4 `DROP POLICY IF EXISTS "pub_update_admin"` y recrear con `WITH CHECK (get_user_rol() = 'admin')`

## 2. Fix capa cliente — AuthProvider

- [x] 2.1 En `fetchPublicador`, cambiar `.eq('email', email)` por `.eq('email', email.toLowerCase())`

## 3. Aplicar migración en Supabase Cloud

- [ ] 3.1 Ejecutar `003_fix_rls_email_normalization.sql` en el Dashboard de Supabase (SQL Editor) o via `supabase db push`
- [ ] 3.2 Verificar que el admin puede insertar publicadores y asignaciones después de aplicar la migración
