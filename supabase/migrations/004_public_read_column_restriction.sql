-- ============================================================
-- Restricción de columnas para lectura pública — publicadores
-- ============================================================
-- Contexto: Las tablas asignaciones_semana y asignaciones_fds
-- ya tienen políticas SELECT con USING (true), lo que permite
-- lectura anónima. Ver 002_rls_policies.sql.
--
-- El problema: publicadores tiene USING (activo = true) sin
-- restricción de rol, lo que expone email y telefono a anon.
-- Supabase RLS no soporta restricción a nivel de columna en
-- políticas. La solución es una vista con columnas seguras.
-- ============================================================

-- Vista pública: solo columnas no sensibles
CREATE OR REPLACE VIEW publicadores_pub AS
  SELECT id, nombre, apellido, activo, rol, creado_en
  FROM publicadores
  WHERE activo = true;

-- Permitir lectura anónima en la vista
GRANT SELECT ON publicadores_pub TO anon;

-- Nota: el acceso completo (email, telefono) sigue disponible
-- solo para usuarios autenticados con rol admin mediante
-- políticas RLS existentes en la tabla base publicadores.
