-- Hace email nullable en publicadores
-- Permite insertar publicadores sin email (ej. seed desde lista de nombres)
ALTER TABLE publicadores
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN email SET DEFAULT NULL;
