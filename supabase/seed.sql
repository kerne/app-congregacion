-- ============================================================
-- Seed de datos dummy — app-congregacion
-- ============================================================
-- IMPORTANTE: Ejecutar con rol service_role (bypasea RLS).
-- En Supabase Dashboard: SQL Editor > pegá este script y ejecutalo.
-- Identificador de datos dummy: email LIKE '%@seed.test'
-- Idempotente: puede re-ejecutarse sin duplicar datos.
-- ============================================================

-- ------------------------------------------------------------
-- 1. LIMPIEZA (orden respeta FKs)
-- ------------------------------------------------------------

DELETE FROM asignaciones_semana
WHERE asignado_id IN (
  SELECT id FROM publicadores WHERE email LIKE '%@seed.test'
);

DELETE FROM asignaciones_fds
WHERE asignado_id IN (
  SELECT id FROM publicadores WHERE email LIKE '%@seed.test'
);

DELETE FROM publicadores WHERE email LIKE '%@seed.test';

DELETE FROM miembros
WHERE congregacion_id IN (
  SELECT id FROM congregaciones WHERE numero = 'SEED'
);

DELETE FROM congregaciones WHERE numero = 'SEED';

-- ------------------------------------------------------------
-- 1b. CONGREGACIÓN SEED
-- ------------------------------------------------------------

INSERT INTO congregaciones (id, nombre, slug, numero, circuito)
VALUES (
  'c0000001-0000-0000-0000-000000000001',
  'Congregación Seed',
  'congregacion-seed',
  'SEED',
  'AR-01'
);

-- ------------------------------------------------------------
-- 2. PUBLICADORES (15 en total: 1 admin, 2 editores, 12 publicadores)
-- ------------------------------------------------------------

INSERT INTO publicadores (id, nombre, apellido, email, telefono, rol, activo, congregacion_id) VALUES
  -- Admin
  ('a0000001-0000-0000-0000-000000000001', 'Roberto',   'Fernández',  'roberto.fernandez@seed.test',  '+54911111111', 'admin',      true, 'c0000001-0000-0000-0000-000000000001'),
  -- Editores
  ('a0000001-0000-0000-0000-000000000002', 'Carlos',    'Gómez',      'carlos.gomez@seed.test',        '+54911111112', 'editor',     true, 'c0000001-0000-0000-0000-000000000001'),
  ('a0000001-0000-0000-0000-000000000003', 'Marcelo',   'Rodríguez',  'marcelo.rodriguez@seed.test',   '+54911111113', 'editor',     true, 'c0000001-0000-0000-0000-000000000001'),
  -- Publicadores
  ('a0000001-0000-0000-0000-000000000004', 'Lucas',     'Martínez',   'lucas.martinez@seed.test',      '+54911111114', 'publicador', true, 'c0000001-0000-0000-0000-000000000001'),
  ('a0000001-0000-0000-0000-000000000005', 'Diego',     'López',      'diego.lopez@seed.test',         '+54911111115', 'publicador', true, 'c0000001-0000-0000-0000-000000000001'),
  ('a0000001-0000-0000-0000-000000000006', 'Sebastián', 'Pérez',      'sebastian.perez@seed.test',     '+54911111116', 'publicador', true, 'c0000001-0000-0000-0000-000000000001'),
  ('a0000001-0000-0000-0000-000000000007', 'Matías',    'García',     'matias.garcia@seed.test',       '+54911111117', 'publicador', true, 'c0000001-0000-0000-0000-000000000001'),
  ('a0000001-0000-0000-0000-000000000008', 'Ezequiel',  'Torres',     'ezequiel.torres@seed.test',     '+54911111118', 'publicador', true, 'c0000001-0000-0000-0000-000000000001'),
  ('a0000001-0000-0000-0000-000000000009', 'Nicolás',   'Ramírez',    'nicolas.ramirez@seed.test',     '+54911111119', 'publicador', true, 'c0000001-0000-0000-0000-000000000001'),
  ('a0000001-0000-0000-0000-000000000010', 'Agustín',   'Sánchez',    'agustin.sanchez@seed.test',     '+54911111120', 'publicador', true, 'c0000001-0000-0000-0000-000000000001'),
  ('a0000001-0000-0000-0000-000000000011', 'Facundo',   'Díaz',       'facundo.diaz@seed.test',        '+54911111121', 'publicador', true, 'c0000001-0000-0000-0000-000000000001'),
  ('a0000001-0000-0000-0000-000000000012', 'Ignacio',   'Moreno',     'ignacio.moreno@seed.test',      '+54911111122', 'publicador', true, 'c0000001-0000-0000-0000-000000000001'),
  ('a0000001-0000-0000-0000-000000000013', 'Tomás',     'Herrera',    'tomas.herrera@seed.test',       '+54911111123', 'publicador', true, 'c0000001-0000-0000-0000-000000000001'),
  ('a0000001-0000-0000-0000-000000000014', 'Leandro',   'Castro',     'leandro.castro@seed.test',      '+54911111124', 'publicador', true, 'c0000001-0000-0000-0000-000000000001'),
  ('a0000001-0000-0000-0000-000000000015', 'Andrés',    'Vargas',     'andres.vargas@seed.test',       '+54911111125', 'publicador', true, 'c0000001-0000-0000-0000-000000000001');

-- ============================================================
-- 3. ASIGNACIONES ENTRE SEMANA
-- ============================================================

-- Semana 2026-04-13 (lunes)
INSERT INTO asignaciones_semana (semana, parte_id, asignado_id, asistente_id, tema, sala, congregacion_id) VALUES
  ('2026-04-13', 'presidente',           'a0000001-0000-0000-0000-000000000001', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-13', 'discurso_tesoros',     'a0000001-0000-0000-0000-000000000003', NULL,                                       'Atesora las riquezas espirituales',            NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-13', 'busqueda_tesoros',     'a0000001-0000-0000-0000-000000000005', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-13', 'lectura_biblia',       'a0000001-0000-0000-0000-000000000006', NULL,                                       'Isaías 53:3-12',                               'principal', 'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-13', 'smt_parte1',           'a0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000002',     'Empiece conversaciones',                       'principal', 'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-13', 'smt_parte2',           'a0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000003',     'Empiece conversaciones',                       'principal', 'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-13', 'nvc_parte1',           'a0000001-0000-0000-0000-000000000009', NULL,                                       'La oración como fuente de fortaleza',          NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-13', 'lector_estudio',       'a0000001-0000-0000-0000-000000000004', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-13', 'estudio_congregacion', 'a0000001-0000-0000-0000-000000000001', NULL,                                       'Lección 5 — Aférrate a Jehová',                NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-13', 'cierre',               'a0000001-0000-0000-0000-000000000001', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-13', 'oracion_final',        'a0000001-0000-0000-0000-000000000002', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001');

-- Semana 2026-04-20 (lunes)
INSERT INTO asignaciones_semana (semana, parte_id, asignado_id, asistente_id, tema, sala, congregacion_id) VALUES
  ('2026-04-20', 'presidente',           'a0000001-0000-0000-0000-000000000002', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-20', 'discurso_tesoros',     'a0000001-0000-0000-0000-000000000004', NULL,                                       'Busca las perlas escondidas',                  NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-20', 'busqueda_tesoros',     'a0000001-0000-0000-0000-000000000006', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-20', 'lectura_biblia',       'a0000001-0000-0000-0000-000000000009', NULL,                                       'Proverbios 3:1-18',                            'principal', 'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-20', 'smt_parte1',           'a0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000004',     'Segunda visita',                               'principal', 'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-20', 'smt_parte2',           'a0000001-0000-0000-0000-000000000011', 'a0000001-0000-0000-0000-000000000005',     'Hacer discípulos',                             'principal', 'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-20', 'nvc_parte1',           'a0000001-0000-0000-0000-000000000012', NULL,                                       'Permaneced en el amor de Dios',                NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-20', 'lector_estudio',       'a0000001-0000-0000-0000-000000000005', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-20', 'estudio_congregacion', 'a0000001-0000-0000-0000-000000000002', NULL,                                       'Lección 6 — Sé fiel hasta la muerte',          NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-20', 'cierre',               'a0000001-0000-0000-0000-000000000002', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-20', 'oracion_final',        'a0000001-0000-0000-0000-000000000003', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001');

-- Semana 2026-04-27 (lunes)
INSERT INTO asignaciones_semana (semana, parte_id, asignado_id, asistente_id, tema, sala, congregacion_id) VALUES
  ('2026-04-27', 'presidente',           'a0000001-0000-0000-0000-000000000003', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-27', 'discurso_tesoros',     'a0000001-0000-0000-0000-000000000005', NULL,                                       'Minas de plata y tesoros escondidos',          NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-27', 'busqueda_tesoros',     'a0000001-0000-0000-0000-000000000007', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-27', 'lectura_biblia',       'a0000001-0000-0000-0000-000000000012', NULL,                                       'Salmo 119:1-16',                               'principal', 'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-27', 'smt_parte1',           'a0000001-0000-0000-0000-000000000013', 'a0000001-0000-0000-0000-000000000006',     'Tercera visita',                               'principal', 'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-27', 'smt_parte2',           'a0000001-0000-0000-0000-000000000014', 'a0000001-0000-0000-0000-000000000007',     'Estudio bíblico en el ministerio',             'principal', 'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-27', 'nvc_parte1',           'a0000001-0000-0000-0000-000000000015', NULL,                                       'Fortalece tu fe con la oración',               NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-27', 'lector_estudio',       'a0000001-0000-0000-0000-000000000006', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-27', 'estudio_congregacion', 'a0000001-0000-0000-0000-000000000003', NULL,                                       'Lección 7 — Resiste al Diablo',                NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-27', 'cierre',               'a0000001-0000-0000-0000-000000000003', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-27', 'oracion_final',        'a0000001-0000-0000-0000-000000000004', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001');

-- Semana 2026-05-04 (lunes)
INSERT INTO asignaciones_semana (semana, parte_id, asignado_id, asistente_id, tema, sala, congregacion_id) VALUES
  ('2026-05-04', 'presidente',           'a0000001-0000-0000-0000-000000000001', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-05-04', 'discurso_tesoros',     'a0000001-0000-0000-0000-000000000006', NULL,                                       'El valor incalculable de la sabiduría',         NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-05-04', 'busqueda_tesoros',     'a0000001-0000-0000-0000-000000000008', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-05-04', 'lectura_biblia',       'a0000001-0000-0000-0000-000000000015', NULL,                                       'Eclesiastés 7:1-14',                           'principal', 'c0000001-0000-0000-0000-000000000001'),
  ('2026-05-04', 'smt_parte1',           'a0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000008',     'Cuarta visita',                                'principal', 'c0000001-0000-0000-0000-000000000001'),
  ('2026-05-04', 'smt_parte2',           'a0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000010',     'Ayudar a alguien a progresar',                 'principal', 'c0000001-0000-0000-0000-000000000001'),
  ('2026-05-04', 'nvc_parte1',           'a0000001-0000-0000-0000-000000000011', NULL,                                       'Cuida tu corazón con toda vigilancia',         NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-05-04', 'lector_estudio',       'a0000001-0000-0000-0000-000000000007', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-05-04', 'estudio_congregacion', 'a0000001-0000-0000-0000-000000000001', NULL,                                       'Lección 8 — Confía en Jehová de todo corazón', NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-05-04', 'cierre',               'a0000001-0000-0000-0000-000000000001', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001'),
  ('2026-05-04', 'oracion_final',        'a0000001-0000-0000-0000-000000000005', NULL,                                       NULL,                                           NULL,        'c0000001-0000-0000-0000-000000000001');

-- ============================================================
-- 4. ASIGNACIONES FIN DE SEMANA
-- ============================================================

-- Domingo 2026-04-12
INSERT INTO asignaciones_fds (fecha, parte_id, asignado_id, tema, congregacion_id) VALUES
  ('2026-04-12', 'fds_presidente',         'a0000001-0000-0000-0000-000000000001', NULL,                                                          'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-12', 'fds_orador',             'a0000001-0000-0000-0000-000000000002', 'Discurso Público: ¿Podemos confiar en la Biblia?',            'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-12', 'fds_presidente_atalaya', 'a0000001-0000-0000-0000-000000000003', NULL,                                                          'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-12', 'fds_lector_atalaya',     'a0000001-0000-0000-0000-000000000004', NULL,                                                          'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-12', 'fds_oracion_final',      'a0000001-0000-0000-0000-000000000005', NULL,                                                          'c0000001-0000-0000-0000-000000000001');

-- Domingo 2026-04-19
INSERT INTO asignaciones_fds (fecha, parte_id, asignado_id, tema, congregacion_id) VALUES
  ('2026-04-19', 'fds_presidente',         'a0000001-0000-0000-0000-000000000002', NULL,                                                          'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-19', 'fds_orador',             'a0000001-0000-0000-0000-000000000011', 'Discurso Público: ¿Qué es la felicidad verdadera?',           'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-19', 'fds_presidente_atalaya', 'a0000001-0000-0000-0000-000000000001', NULL,                                                          'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-19', 'fds_lector_atalaya',     'a0000001-0000-0000-0000-000000000006', NULL,                                                          'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-19', 'fds_oracion_final',      'a0000001-0000-0000-0000-000000000007', NULL,                                                          'c0000001-0000-0000-0000-000000000001');

-- Domingo 2026-04-26
INSERT INTO asignaciones_fds (fecha, parte_id, asignado_id, tema, congregacion_id) VALUES
  ('2026-04-26', 'fds_presidente',         'a0000001-0000-0000-0000-000000000003', NULL,                                                          'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-26', 'fds_orador',             'a0000001-0000-0000-0000-000000000012', 'Discurso Público: La familia — una dádiva de Dios',           'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-26', 'fds_presidente_atalaya', 'a0000001-0000-0000-0000-000000000002', NULL,                                                          'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-26', 'fds_lector_atalaya',     'a0000001-0000-0000-0000-000000000008', NULL,                                                          'c0000001-0000-0000-0000-000000000001'),
  ('2026-04-26', 'fds_oracion_final',      'a0000001-0000-0000-0000-000000000009', NULL,                                                          'c0000001-0000-0000-0000-000000000001');

-- Domingo 2026-05-03
INSERT INTO asignaciones_fds (fecha, parte_id, asignado_id, tema, congregacion_id) VALUES
  ('2026-05-03', 'fds_presidente',         'a0000001-0000-0000-0000-000000000001', NULL,                                                          'c0000001-0000-0000-0000-000000000001'),
  ('2026-05-03', 'fds_orador',             'a0000001-0000-0000-0000-000000000013', 'Discurso Público: ¿Hay esperanza después de la muerte?',      'c0000001-0000-0000-0000-000000000001'),
  ('2026-05-03', 'fds_presidente_atalaya', 'a0000001-0000-0000-0000-000000000003', NULL,                                                          'c0000001-0000-0000-0000-000000000001'),
  ('2026-05-03', 'fds_lector_atalaya',     'a0000001-0000-0000-0000-000000000010', NULL,                                                          'c0000001-0000-0000-0000-000000000001'),
  ('2026-05-03', 'fds_oracion_final',      'a0000001-0000-0000-0000-000000000014', NULL,                                                          'c0000001-0000-0000-0000-000000000001');
