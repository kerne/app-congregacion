-- ============================================================
-- Fix RLS: normalización de email case-insensitive
-- Bug: get_user_rol() comparaba emails con case-sensitivity,
--      retornando NULL cuando auth.users.email difería en
--      capitalización respecto a publicadores.email.
--      NULL = 'admin' → NULL → RLS interpreta como FALSE → acceso denegado.
-- ============================================================

-- Fix get_user_rol(): comparación case-insensitive con LOWER()
CREATE OR REPLACE FUNCTION get_user_rol()
RETURNS TEXT AS $$
  SELECT rol
  FROM publicadores
  WHERE LOWER(email) = LOWER(
    SELECT email FROM auth.users WHERE id = auth.uid()
  )
  AND activo = true
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Fix crear_primer_admin(): normalizar email a minúsculas al insertar
CREATE OR REPLACE FUNCTION crear_primer_admin(
  p_nombre   TEXT,
  p_apellido TEXT,
  p_email    TEXT
) RETURNS void AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM publicadores WHERE rol = 'admin') THEN
    RAISE EXCEPTION 'Ya existe un admin en el sistema. Esta función es solo para el primer arranque.';
  END IF;

  INSERT INTO publicadores (nombre, apellido, email, rol, activo)
  VALUES (p_nombre, p_apellido, LOWER(p_email), 'admin', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix pub_update_admin: agregar WITH CHECK (PostgreSQL 14+ lo requiere)
DROP POLICY IF EXISTS "pub_update_admin" ON publicadores;

CREATE POLICY "pub_update_admin"
  ON publicadores FOR UPDATE
  USING (get_user_rol() = 'admin')
  WITH CHECK (get_user_rol() = 'admin');
