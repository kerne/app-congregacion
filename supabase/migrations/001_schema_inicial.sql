-- ============================================================
-- Schema inicial — app-congregacion
-- ============================================================

-- Publicadores
CREATE TABLE publicadores (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre     TEXT NOT NULL,
  apellido   TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  telefono   TEXT,
  rol        TEXT NOT NULL DEFAULT 'publicador'
               CHECK (rol IN ('publicador', 'editor', 'admin')),
  activo     BOOLEAN NOT NULL DEFAULT true,
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Asignaciones Entre Semana
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

-- Asignaciones Fin de Semana
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

-- Índices
CREATE INDEX idx_asig_semana_semana    ON asignaciones_semana(semana);
CREATE INDEX idx_asig_semana_asignado  ON asignaciones_semana(asignado_id);
CREATE INDEX idx_asig_fds_fecha        ON asignaciones_fds(fecha);
CREATE INDEX idx_asig_fds_asignado     ON asignaciones_fds(asignado_id);
CREATE INDEX idx_publicadores_email    ON publicadores(email);
CREATE INDEX idx_publicadores_activo   ON publicadores(activo);
