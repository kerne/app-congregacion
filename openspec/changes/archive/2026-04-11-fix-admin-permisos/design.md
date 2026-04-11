## Context

El admin autenticado no podía agregar publicadores ni asignaciones. La causa raíz era un bug en `get_user_rol()` en Supabase: comparación de emails case-sensitive. Si `auth.users.email` tenía alguna diferencia de capitalización respecto a `publicadores.email`, la función retornaba `NULL`. SQL interpreta `NULL = 'admin'` como `NULL` (lógica ternaria), que RLS evalúa como `FALSE` → acceso denegado.

## Goals / Non-Goals

**Goals:**
- `get_user_rol()` retorna el rol correcto independientemente de la capitalización del email
- `crear_primer_admin()` normaliza el email al insertar
- `pub_update_admin` policy incluye `WITH CHECK` para compatibilidad con PostgreSQL 14+
- `fetchPublicador` en AuthProvider normaliza el email antes de la query

**Non-Goals:**
- No migrar emails existentes en la tabla (la normalización LOWER() en la query es suficiente)
- No cambiar el esquema de la tabla publicadores
- No afectar otras policies RLS

## Decisions

**D1 — LOWER() en la función en vez de trigger de normalización**
Se aplica `LOWER()` en `get_user_rol()` en vez de normalizar datos en tabla. Más seguro: no modifica datos existentes, es backward-compatible, y el fix aplica inmediatamente sin migración de datos.

**D2 — `WITH CHECK` en `pub_update_admin`**
PostgreSQL 14+ requiere `WITH CHECK` en policies UPDATE para ser explícito sobre qué filas se pueden escribir vs leer. Se agrega para eliminar el warning y garantizar comportamiento correcto en versiones modernas.

**D3 — `email.toLowerCase()` en AuthProvider**
La query del cliente normaliza el email antes de enviarlo a Supabase para consistencia con la capa SQL. Doble protección: si `get_user_rol()` y `fetchPublicador` normalizan independientemente, el bug no puede reaparecer.

## Risks / Trade-offs

- [Migración requiere aplicarse manualmente en Supabase Cloud] → El archivo SQL existe en `supabase/migrations/003_fix_rls_email_normalization.sql` y debe ejecutarse via Dashboard o `supabase db push`.
- [Sin rollback automático] → El cambio es aditivo (`CREATE OR REPLACE FUNCTION`). Para revertir: ejecutar las definiciones originales de `002_rls_policies.sql`.
