-- ============================================================
-- RESET COMPLETO — app-congregacion
-- ============================================================
-- Ejecutar con service_role en Supabase SQL Editor.
-- Elimina TODO y recrea desde cero (migraciones 001-008).
-- ============================================================

-- ─── LIMPIEZA ─────────────────────────────────────────────────

-- Drop policies
DO $$ DECLARE pol RECORD; BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- Drop views
DROP VIEW IF EXISTS publicadores_pub;

-- Drop functions
DROP FUNCTION IF EXISTS get_user_congregacion_ids();
DROP FUNCTION IF EXISTS get_user_rol_en(UUID);
DROP FUNCTION IF EXISTS get_user_rol();
DROP FUNCTION IF EXISTS crear_primer_admin(TEXT, TEXT, TEXT);

-- Drop tables (orden respeta FKs)
DROP TABLE IF EXISTS asignaciones_semana CASCADE;
DROP TABLE IF EXISTS asignaciones_fds CASCADE;
DROP TABLE IF EXISTS miembros CASCADE;
DROP TABLE IF EXISTS publicadores CASCADE;
DROP TABLE IF EXISTS congregaciones CASCADE;

-- ============================================================
-- 001: Schema inicial
-- ============================================================

CREATE TABLE publicadores (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre     TEXT NOT NULL,
  apellido   TEXT NOT NULL,
  email      TEXT UNIQUE,
  telefono   TEXT,
  rol        TEXT NOT NULL DEFAULT 'publicador'
               CHECK (rol IN ('publicador', 'editor', 'admin')),
  activo     BOOLEAN NOT NULL DEFAULT true,
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE asignaciones_semana (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semana       DATE NOT NULL,
  parte_id     TEXT NOT NULL,
  asignado_id  UUID NOT NULL REFERENCES publicadores(id),
  asistente_id UUID REFERENCES publicadores(id),
  tema         TEXT,
  sala         TEXT CHECK (sala IN ('principal', 'B')),
  notas        TEXT,
  modificado   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (semana, parte_id, sala)
);

CREATE TABLE asignaciones_fds (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha        DATE NOT NULL,
  parte_id     TEXT NOT NULL,
  asignado_id  UUID NOT NULL REFERENCES publicadores(id),
  asistente_id UUID REFERENCES publicadores(id),
  tema         TEXT,
  notas        TEXT,
  modificado   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (fecha, parte_id)
);

CREATE INDEX idx_asig_semana_semana    ON asignaciones_semana(semana);
CREATE INDEX idx_asig_semana_asignado  ON asignaciones_semana(asignado_id);
CREATE INDEX idx_asig_fds_fecha        ON asignaciones_fds(fecha);
CREATE INDEX idx_asig_fds_asignado     ON asignaciones_fds(asignado_id);
CREATE INDEX idx_publicadores_email    ON publicadores(email);
CREATE INDEX idx_publicadores_activo   ON publicadores(activo);

-- ============================================================
-- 005: Email nullable
-- ============================================================

ALTER TABLE publicadores
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN email SET DEFAULT NULL;

-- ============================================================
-- 006: Cargo de congregación
-- ============================================================

ALTER TABLE publicadores
  ADD COLUMN cargo TEXT
  CHECK (cargo IN ('anciano', 'siervo_ministerial', 'publicador', 'publicadora'));

-- ============================================================
-- 008: Multi-congregación
-- ============================================================

-- Tabla congregaciones
CREATE TABLE congregaciones (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre     TEXT NOT NULL,
  numero     TEXT,
  circuito   TEXT,
  creado_por UUID REFERENCES auth.users(id),
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_congregaciones_creado_por ON congregaciones(creado_por);

-- Tabla miembros
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

-- Agregar congregacion_id a tablas existentes
ALTER TABLE publicadores
  ADD COLUMN congregacion_id UUID NOT NULL REFERENCES congregaciones(id);

ALTER TABLE asignaciones_semana
  ADD COLUMN congregacion_id UUID NOT NULL REFERENCES congregaciones(id);

ALTER TABLE asignaciones_fds
  ADD COLUMN congregacion_id UUID NOT NULL REFERENCES congregaciones(id);

CREATE INDEX idx_publicadores_congregacion ON publicadores(congregacion_id);
CREATE INDEX idx_asig_semana_congregacion ON asignaciones_semana(congregacion_id);
CREATE INDEX idx_asig_fds_congregacion ON asignaciones_fds(congregacion_id);

-- ============================================================
-- Helper functions
-- ============================================================

CREATE OR REPLACE FUNCTION get_user_congregacion_ids()
RETURNS SETOF UUID AS $$
  SELECT congregacion_id
  FROM miembros
  WHERE user_id = auth.uid()
    AND activo = true;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_rol_en(p_congregacion_id UUID)
RETURNS TEXT AS $$
  SELECT rol
  FROM miembros
  WHERE user_id = auth.uid()
    AND congregacion_id = p_congregacion_id
    AND activo = true
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

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

-- ============================================================
-- Vista pública
-- ============================================================

CREATE VIEW publicadores_pub AS
  SELECT id, nombre, apellido, activo, rol, cargo, congregacion_id, creado_en
  FROM publicadores
  WHERE activo = true;

GRANT SELECT ON publicadores_pub TO anon;

-- ============================================================
-- RLS — congregaciones
-- ============================================================

ALTER TABLE congregaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cong_select_miembro"
  ON congregaciones FOR SELECT
  USING (id IN (SELECT get_user_congregacion_ids()));

CREATE POLICY "cong_select_creador"
  ON congregaciones FOR SELECT
  USING (creado_por = auth.uid());

CREATE POLICY "cong_insert_auth"
  ON congregaciones FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND creado_por = auth.uid());

CREATE POLICY "cong_update_admin"
  ON congregaciones FOR UPDATE
  USING (get_user_rol_en(id) = 'admin')
  WITH CHECK (get_user_rol_en(id) = 'admin');

-- ============================================================
-- RLS — miembros
-- ============================================================

ALTER TABLE miembros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "miembros_select"
  ON miembros FOR SELECT
  USING (congregacion_id IN (SELECT get_user_congregacion_ids()));

CREATE POLICY "miembros_insert_admin"
  ON miembros FOR INSERT
  WITH CHECK (get_user_rol_en(congregacion_id) = 'admin');

CREATE POLICY "miembros_insert_self"
  ON miembros FOR INSERT
  WITH CHECK (user_id = auth.uid() AND rol = 'admin'
    AND congregacion_id IN (
      SELECT id FROM congregaciones WHERE creado_por = auth.uid()
    ));

CREATE POLICY "miembros_update_admin"
  ON miembros FOR UPDATE
  USING (get_user_rol_en(congregacion_id) = 'admin')
  WITH CHECK (get_user_rol_en(congregacion_id) = 'admin');

-- ============================================================
-- RLS — publicadores
-- ============================================================

ALTER TABLE publicadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pub_select_congregacion"
  ON publicadores FOR SELECT
  USING (
    congregacion_id IN (SELECT get_user_congregacion_ids())
    AND activo = true
  );

CREATE POLICY "pub_select_admin_congregacion"
  ON publicadores FOR SELECT
  USING (
    get_user_rol_en(congregacion_id) = 'admin'
  );

CREATE POLICY "pub_insert_admin_congregacion"
  ON publicadores FOR INSERT
  WITH CHECK (
    get_user_rol_en(congregacion_id) = 'admin'
  );

CREATE POLICY "pub_update_admin_congregacion"
  ON publicadores FOR UPDATE
  USING (get_user_rol_en(congregacion_id) = 'admin')
  WITH CHECK (get_user_rol_en(congregacion_id) = 'admin');

-- ============================================================
-- RLS — asignaciones_semana
-- ============================================================

ALTER TABLE asignaciones_semana ENABLE ROW LEVEL SECURITY;

CREATE POLICY "asig_sem_select_congregacion"
  ON asignaciones_semana FOR SELECT
  USING (congregacion_id IN (SELECT get_user_congregacion_ids()));

CREATE POLICY "asig_sem_insert_congregacion"
  ON asignaciones_semana FOR INSERT
  WITH CHECK (
    get_user_rol_en(congregacion_id) IN ('editor', 'admin')
  );

CREATE POLICY "asig_sem_update_congregacion"
  ON asignaciones_semana FOR UPDATE
  USING (get_user_rol_en(congregacion_id) IN ('editor', 'admin'));

CREATE POLICY "asig_sem_delete_congregacion"
  ON asignaciones_semana FOR DELETE
  USING (get_user_rol_en(congregacion_id) IN ('editor', 'admin'));

-- ============================================================
-- RLS — asignaciones_fds
-- ============================================================

ALTER TABLE asignaciones_fds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "asig_fds_select_congregacion"
  ON asignaciones_fds FOR SELECT
  USING (congregacion_id IN (SELECT get_user_congregacion_ids()));

CREATE POLICY "asig_fds_insert_congregacion"
  ON asignaciones_fds FOR INSERT
  WITH CHECK (
    get_user_rol_en(congregacion_id) IN ('editor', 'admin')
  );

CREATE POLICY "asig_fds_update_congregacion"
  ON asignaciones_fds FOR UPDATE
  USING (get_user_rol_en(congregacion_id) IN ('editor', 'admin'));

CREATE POLICY "asig_fds_delete_congregacion"
  ON asignaciones_fds FOR DELETE
  USING (get_user_rol_en(congregacion_id) IN ('editor', 'admin'));
