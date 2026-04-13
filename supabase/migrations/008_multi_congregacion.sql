-- ============================================================
-- Multi-Congregación: tablas, FK, RLS, migración de datos
-- ============================================================
-- Agrega soporte para múltiples congregaciones con aislamiento
-- por tenant. Modelo: auth.users → miembros → congregaciones.
-- Cada publicador y asignación pertenece a una congregación.
-- ============================================================

-- ─── 1. Tabla congregaciones ──────────────────────────────────

CREATE TABLE congregaciones (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre     TEXT NOT NULL,
  numero     TEXT,
  circuito   TEXT,
  creado_por UUID REFERENCES auth.users(id),
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_congregaciones_creado_por ON congregaciones(creado_por);

-- ─── 2. Tabla miembros (user ↔ congregación) ─────────────────

CREATE TABLE miembros (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  congregacion_id   UUID NOT NULL REFERENCES congregaciones(id) ON DELETE CASCADE,
  rol               TEXT NOT NULL DEFAULT 'publicador'
                      CHECK (rol IN ('publicador', 'editor', 'admin')),
  activo            BOOLEAN NOT NULL DEFAULT true,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, congregacion_id)
);

CREATE INDEX idx_miembros_user_id ON miembros(user_id);
CREATE INDEX idx_miembros_congregacion_id ON miembros(congregacion_id);

-- ─── 3. Agregar congregacion_id a tablas existentes ───────────

ALTER TABLE publicadores
  ADD COLUMN congregacion_id UUID REFERENCES congregaciones(id);

ALTER TABLE asignaciones_semana
  ADD COLUMN congregacion_id UUID REFERENCES congregaciones(id);

ALTER TABLE asignaciones_fds
  ADD COLUMN congregacion_id UUID REFERENCES congregaciones(id);

CREATE INDEX idx_publicadores_congregacion ON publicadores(congregacion_id);
CREATE INDEX idx_asig_semana_congregacion ON asignaciones_semana(congregacion_id);
CREATE INDEX idx_asig_fds_congregacion ON asignaciones_fds(congregacion_id);

-- ─── 4. Migrar datos existentes a congregación default ────────
-- Si hay datos, creamos una congregación "por defecto" y
-- asignamos todo a ella. Si no hay datos, no pasa nada.

DO $$
DECLARE
  v_cong_id UUID;
  v_admin_email TEXT;
  v_admin_user_id UUID;
BEGIN
  -- Solo migrar si hay publicadores existentes
  IF EXISTS (SELECT 1 FROM publicadores LIMIT 1) THEN
    -- Buscar un admin existente para ser el creador
    SELECT email INTO v_admin_email
    FROM publicadores
    WHERE rol = 'admin' AND activo = true
    LIMIT 1;

    -- Buscar su user_id en auth.users (puede no existir)
    IF v_admin_email IS NOT NULL THEN
      SELECT id INTO v_admin_user_id
      FROM auth.users
      WHERE LOWER(email) = LOWER(v_admin_email)
      LIMIT 1;
    END IF;

    -- Crear congregación default (creado_por puede ser NULL si no hay user vinculado)
    INSERT INTO congregaciones (id, nombre, numero, creado_por)
    VALUES (
      gen_random_uuid(),
      'Mi Congregación',
      '0',
      v_admin_user_id  -- NULL si no hay auth.user vinculado
    )
    RETURNING id INTO v_cong_id;

    -- Asignar todos los publicadores
    UPDATE publicadores SET congregacion_id = v_cong_id;

    -- Asignar todas las asignaciones
    UPDATE asignaciones_semana SET congregacion_id = v_cong_id;
    UPDATE asignaciones_fds SET congregacion_id = v_cong_id;

    -- Crear miembros para publicadores que tengan email vinculado
    INSERT INTO miembros (user_id, congregacion_id, rol)
    SELECT u.id, v_cong_id, p.rol
    FROM publicadores p
    JOIN auth.users u ON LOWER(u.email) = LOWER(p.email)
    WHERE p.activo = true AND p.email IS NOT NULL;
  END IF;
END $$;

-- ─── 5. Hacer congregacion_id NOT NULL (después de migrar) ───

ALTER TABLE publicadores
  ALTER COLUMN congregacion_id SET NOT NULL;

ALTER TABLE asignaciones_semana
  ALTER COLUMN congregacion_id SET NOT NULL;

ALTER TABLE asignaciones_fds
  ALTER COLUMN congregacion_id SET NOT NULL;

-- ─── 6. Helper functions ──────────────────────────────────────

-- Retorna las congregacion_ids donde el usuario es miembro activo
CREATE OR REPLACE FUNCTION get_user_congregacion_ids()
RETURNS SETOF UUID AS $$
  SELECT congregacion_id
  FROM miembros
  WHERE user_id = auth.uid()
    AND activo = true;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Retorna el rol del usuario en una congregación específica
CREATE OR REPLACE FUNCTION get_user_rol_en(p_congregacion_id UUID)
RETURNS TEXT AS $$
  SELECT rol
  FROM miembros
  WHERE user_id = auth.uid()
    AND congregacion_id = p_congregacion_id
    AND activo = true
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Reemplaza get_user_rol() — ahora obsoleta, pero la mantenemos
-- para no romper nada durante la transición
CREATE OR REPLACE FUNCTION get_user_rol()
RETURNS TEXT AS $$
  SELECT rol
  FROM miembros
  WHERE user_id = auth.uid()
    AND activo = true
  ORDER BY CASE rol
    WHEN 'admin' THEN 1
    WHEN 'editor' THEN 2
    ELSE 3
  END
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── 7. RLS — congregaciones ──────────────────────────────────

ALTER TABLE congregaciones ENABLE ROW LEVEL SECURITY;

-- Miembros pueden ver sus congregaciones
CREATE POLICY "cong_select_miembro"
  ON congregaciones FOR SELECT
  USING (id IN (SELECT get_user_congregacion_ids()));

-- Creador puede ver su congregación (bootstrap: antes de ser miembro)
CREATE POLICY "cong_select_creador"
  ON congregaciones FOR SELECT
  USING (creado_por = auth.uid());

-- Cualquier usuario autenticado puede crear una congregación
CREATE POLICY "cong_insert_auth"
  ON congregaciones FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND creado_por = auth.uid());

-- Solo el admin de la congregación puede actualizar
CREATE POLICY "cong_update_admin"
  ON congregaciones FOR UPDATE
  USING (get_user_rol_en(id) = 'admin')
  WITH CHECK (get_user_rol_en(id) = 'admin');

-- ─── 8. RLS — miembros ───────────────────────────────────────

ALTER TABLE miembros ENABLE ROW LEVEL SECURITY;

-- Miembros pueden ver otros miembros de su congregación
CREATE POLICY "miembros_select"
  ON miembros FOR SELECT
  USING (congregacion_id IN (SELECT get_user_congregacion_ids()));

-- Admin de la congregación puede insertar miembros
CREATE POLICY "miembros_insert_admin"
  ON miembros FOR INSERT
  WITH CHECK (get_user_rol_en(congregacion_id) = 'admin');

-- Un usuario puede insertar su propio miembro al crear congregación
-- (necesario para el bootstrap: crear congregación + auto-asignarse admin)
CREATE POLICY "miembros_insert_self"
  ON miembros FOR INSERT
  WITH CHECK (user_id = auth.uid() AND rol = 'admin'
    AND congregacion_id IN (
      SELECT id FROM congregaciones WHERE creado_por = auth.uid()
    ));

-- Admin puede actualizar miembros de su congregación
CREATE POLICY "miembros_update_admin"
  ON miembros FOR UPDATE
  USING (get_user_rol_en(congregacion_id) = 'admin')
  WITH CHECK (get_user_rol_en(congregacion_id) = 'admin');

-- ─── 9. Reescribir RLS — publicadores ─────────────────────────

-- Eliminar policies anteriores
DROP POLICY IF EXISTS "pub_select_activos" ON publicadores;
DROP POLICY IF EXISTS "pub_select_admin" ON publicadores;
DROP POLICY IF EXISTS "pub_insert_admin" ON publicadores;
DROP POLICY IF EXISTS "pub_update_admin" ON publicadores;

-- Miembros pueden ver publicadores activos de su congregación
CREATE POLICY "pub_select_congregacion"
  ON publicadores FOR SELECT
  USING (
    congregacion_id IN (SELECT get_user_congregacion_ids())
    AND activo = true
  );

-- Admin puede ver todos (incluso inactivos) de su congregación
CREATE POLICY "pub_select_admin_congregacion"
  ON publicadores FOR SELECT
  USING (
    get_user_rol_en(congregacion_id) = 'admin'
  );

-- Admin puede insertar publicadores en su congregación
CREATE POLICY "pub_insert_admin_congregacion"
  ON publicadores FOR INSERT
  WITH CHECK (
    get_user_rol_en(congregacion_id) = 'admin'
  );

-- Admin puede actualizar publicadores de su congregación
CREATE POLICY "pub_update_admin_congregacion"
  ON publicadores FOR UPDATE
  USING (get_user_rol_en(congregacion_id) = 'admin')
  WITH CHECK (get_user_rol_en(congregacion_id) = 'admin');

-- ─── 10. Reescribir RLS — asignaciones_semana ─────────────────

DROP POLICY IF EXISTS "asig_sem_select_all" ON asignaciones_semana;
DROP POLICY IF EXISTS "asig_sem_insert_open" ON asignaciones_semana;
DROP POLICY IF EXISTS "asig_sem_update_open" ON asignaciones_semana;
DROP POLICY IF EXISTS "asig_sem_delete_open" ON asignaciones_semana;

-- Miembros de la congregación pueden leer
CREATE POLICY "asig_sem_select_congregacion"
  ON asignaciones_semana FOR SELECT
  USING (congregacion_id IN (SELECT get_user_congregacion_ids()));

-- Editor y admin pueden insertar
CREATE POLICY "asig_sem_insert_congregacion"
  ON asignaciones_semana FOR INSERT
  WITH CHECK (
    get_user_rol_en(congregacion_id) IN ('editor', 'admin')
  );

-- Editor y admin pueden actualizar
CREATE POLICY "asig_sem_update_congregacion"
  ON asignaciones_semana FOR UPDATE
  USING (get_user_rol_en(congregacion_id) IN ('editor', 'admin'));

-- Editor y admin pueden eliminar
CREATE POLICY "asig_sem_delete_congregacion"
  ON asignaciones_semana FOR DELETE
  USING (get_user_rol_en(congregacion_id) IN ('editor', 'admin'));

-- ─── 11. Reescribir RLS — asignaciones_fds ────────────────────

DROP POLICY IF EXISTS "asig_fds_select_all" ON asignaciones_fds;
DROP POLICY IF EXISTS "asig_fds_insert_open" ON asignaciones_fds;
DROP POLICY IF EXISTS "asig_fds_update_open" ON asignaciones_fds;
DROP POLICY IF EXISTS "asig_fds_delete_open" ON asignaciones_fds;

-- Miembros de la congregación pueden leer
CREATE POLICY "asig_fds_select_congregacion"
  ON asignaciones_fds FOR SELECT
  USING (congregacion_id IN (SELECT get_user_congregacion_ids()));

-- Editor y admin pueden insertar
CREATE POLICY "asig_fds_insert_congregacion"
  ON asignaciones_fds FOR INSERT
  WITH CHECK (
    get_user_rol_en(congregacion_id) IN ('editor', 'admin')
  );

-- Editor y admin pueden actualizar
CREATE POLICY "asig_fds_update_congregacion"
  ON asignaciones_fds FOR UPDATE
  USING (get_user_rol_en(congregacion_id) IN ('editor', 'admin'));

-- Editor y admin pueden eliminar
CREATE POLICY "asig_fds_delete_congregacion"
  ON asignaciones_fds FOR DELETE
  USING (get_user_rol_en(congregacion_id) IN ('editor', 'admin'));

-- ─── 12. Actualizar vista pública ─────────────────────────────

DROP VIEW IF EXISTS publicadores_pub;
CREATE VIEW publicadores_pub AS
  SELECT id, nombre, apellido, activo, rol, cargo, congregacion_id, creado_en
  FROM publicadores
  WHERE activo = true;

GRANT SELECT ON publicadores_pub TO anon;

-- ─── 13. Reemplazar crear_primer_admin ────────────────────────
-- Ya no se necesita — el flujo de onboarding lo reemplaza.
-- Lo dejamos pero marcamos como deprecated.

CREATE OR REPLACE FUNCTION crear_primer_admin(
  p_nombre   TEXT,
  p_apellido TEXT,
  p_email    TEXT
) RETURNS void AS $$
BEGIN
  RAISE NOTICE 'DEPRECATED: usar el flujo de onboarding en la app.';
  -- Mantener por compatibilidad con seeds existentes
  IF EXISTS (SELECT 1 FROM publicadores WHERE rol = 'admin') THEN
    RAISE EXCEPTION 'Ya existe un admin en el sistema.';
  END IF;

  INSERT INTO publicadores (nombre, apellido, email, rol, activo, congregacion_id)
  SELECT p_nombre, p_apellido, LOWER(p_email), 'admin', true, c.id
  FROM congregaciones c
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
