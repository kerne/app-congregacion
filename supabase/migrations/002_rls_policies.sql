-- ============================================================
-- RLS Policies — app-congregacion
-- ============================================================

-- Función helper: retorna el rol del usuario autenticado
-- usando su email para buscar en publicadores
CREATE OR REPLACE FUNCTION get_user_rol()
RETURNS TEXT AS $$
  SELECT rol
  FROM publicadores
  WHERE email = (
    SELECT email FROM auth.users WHERE id = auth.uid()
  )
  AND activo = true
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── publicadores ───────────────────────────────────────────

ALTER TABLE publicadores ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer publicadores activos
CREATE POLICY "pub_select_activos"
  ON publicadores FOR SELECT
  USING (activo = true);

-- Admin puede leer todos (activos e inactivos)
CREATE POLICY "pub_select_admin"
  ON publicadores FOR SELECT
  USING (get_user_rol() = 'admin');

-- Solo admin puede insertar
CREATE POLICY "pub_insert_admin"
  ON publicadores FOR INSERT
  WITH CHECK (get_user_rol() = 'admin');

-- Solo admin puede actualizar
CREATE POLICY "pub_update_admin"
  ON publicadores FOR UPDATE
  USING (get_user_rol() = 'admin');

-- Admin no puede eliminar publicadores (solo desactivar)
-- Si se necesita eliminar en el futuro, agregar policy acá

-- ─── asignaciones_semana ────────────────────────────────────

ALTER TABLE asignaciones_semana ENABLE ROW LEVEL SECURITY;

-- Lectura pública (anónimo y autenticado)
CREATE POLICY "asig_sem_select_all"
  ON asignaciones_semana FOR SELECT
  USING (true);

-- Solo editor y admin pueden insertar
CREATE POLICY "asig_sem_insert_editor"
  ON asignaciones_semana FOR INSERT
  WITH CHECK (get_user_rol() IN ('editor', 'admin'));

-- Solo editor y admin pueden actualizar
CREATE POLICY "asig_sem_update_editor"
  ON asignaciones_semana FOR UPDATE
  USING (get_user_rol() IN ('editor', 'admin'));

-- Solo editor y admin pueden eliminar
CREATE POLICY "asig_sem_delete_editor"
  ON asignaciones_semana FOR DELETE
  USING (get_user_rol() IN ('editor', 'admin'));

-- ─── asignaciones_fds ───────────────────────────────────────

ALTER TABLE asignaciones_fds ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "asig_fds_select_all"
  ON asignaciones_fds FOR SELECT
  USING (true);

-- Solo editor y admin pueden insertar
CREATE POLICY "asig_fds_insert_editor"
  ON asignaciones_fds FOR INSERT
  WITH CHECK (get_user_rol() IN ('editor', 'admin'));

-- Solo editor y admin pueden actualizar
CREATE POLICY "asig_fds_update_editor"
  ON asignaciones_fds FOR UPDATE
  USING (get_user_rol() IN ('editor', 'admin'));

-- Solo editor y admin pueden eliminar
CREATE POLICY "asig_fds_delete_editor"
  ON asignaciones_fds FOR DELETE
  USING (get_user_rol() IN ('editor', 'admin'));

-- ─── Bootstrap: crear primer admin ─────────────────────────

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
  VALUES (p_nombre, p_apellido, p_email, 'admin', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
