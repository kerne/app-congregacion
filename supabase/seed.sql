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

-- ------------------------------------------------------------
-- 2. PUBLICADORES (15 en total: 1 admin, 2 editores, 12 publicadores)
-- ------------------------------------------------------------

INSERT INTO publicadores (id, nombre, apellido, email, telefono, rol, activo) VALUES
  -- Admin
  ('a0000001-0000-0000-0000-000000000001', 'Roberto',   'Fernández',  'roberto.fernandez@seed.test',  '+54911111111', 'admin',      true),
  -- Editores
  ('a0000001-0000-0000-0000-000000000002', 'Carlos',    'Gómez',      'carlos.gomez@seed.test',        '+54911111112', 'editor',     true),
  ('a0000001-0000-0000-0000-000000000003', 'Marcelo',   'Rodríguez',  'marcelo.rodriguez@seed.test',   '+54911111113', 'editor',     true),
  -- Publicadores
  ('a0000001-0000-0000-0000-000000000004', 'Lucas',     'Martínez',   'lucas.martinez@seed.test',      '+54911111114', 'publicador', true),
  ('a0000001-0000-0000-0000-000000000005', 'Diego',     'López',      'diego.lopez@seed.test',         '+54911111115', 'publicador', true),
  ('a0000001-0000-0000-0000-000000000006', 'Sebastián', 'Pérez',      'sebastian.perez@seed.test',     '+54911111116', 'publicador', true),
  ('a0000001-0000-0000-0000-000000000007', 'Matías',    'García',     'matias.garcia@seed.test',       '+54911111117', 'publicador', true),
  ('a0000001-0000-0000-0000-000000000008', 'Ezequiel',  'Torres',     'ezequiel.torres@seed.test',     '+54911111118', 'publicador', true),
  ('a0000001-0000-0000-0000-000000000009', 'Nicolás',   'Ramírez',    'nicolas.ramirez@seed.test',     '+54911111119', 'publicador', true),
  ('a0000001-0000-0000-0000-000000000010', 'Agustín',   'Sánchez',    'agustin.sanchez@seed.test',     '+54911111120', 'publicador', true),
  ('a0000001-0000-0000-0000-000000000011', 'Facundo',   'Díaz',       'facundo.diaz@seed.test',        '+54911111121', 'publicador', true),
  ('a0000001-0000-0000-0000-000000000012', 'Ignacio',   'Moreno',     'ignacio.moreno@seed.test',      '+54911111122', 'publicador', true),
  ('a0000001-0000-0000-0000-000000000013', 'Tomás',     'Herrera',    'tomas.herrera@seed.test',       '+54911111123', 'publicador', true),
  ('a0000001-0000-0000-0000-000000000014', 'Leandro',   'Castro',     'leandro.castro@seed.test',      '+54911111124', 'publicador', true),
  ('a0000001-0000-0000-0000-000000000015', 'Andrés',    'Vargas',     'andres.vargas@seed.test',       '+54911111125', 'publicador', true);

-- ============================================================
-- 3. ASIGNACIONES ENTRE SEMANA
-- ============================================================
-- Partes obligatorias (optional=false en programa-semana.ts):
--   presidente, lector_tesoros, discurso_tesoros, mejores_maestros,
--   busqueda_tesoros, smt_parte1, smt_parte2, nvc_parte1,
--   estudio_congregacion, cierre
--
-- Partes con tieneTema=true: discurso_tesoros, mejores_maestros,
--   smt_parte1, smt_parte2, nvc_parte1, estudio_congregacion
-- Partes con tieneAsistente=true: smt_parte1, smt_parte2
-- Partes con tieneSala=true: smt_parte1, smt_parte2
-- ============================================================

-- ------------------------------------------------------------
-- Semana 2026-04-13 (lunes)
-- ------------------------------------------------------------
INSERT INTO asignaciones_semana (semana, parte_id, asignado_id, asistente_id, tema, sala) VALUES
  ('2026-04-13', 'presidente',           'a0000001-0000-0000-0000-000000000001', NULL,                                       NULL,                                           NULL),
  ('2026-04-13', 'lector_tesoros',       'a0000001-0000-0000-0000-000000000002', NULL,                                       NULL,                                           NULL),
  ('2026-04-13', 'discurso_tesoros',     'a0000001-0000-0000-0000-000000000003', NULL,                                       'Atesora las riquezas espirituales',            NULL),
  ('2026-04-13', 'mejores_maestros',     'a0000001-0000-0000-0000-000000000004', NULL,                                       'Cómo hacer preguntas que inviten a reflexionar',NULL),
  ('2026-04-13', 'busqueda_tesoros',     'a0000001-0000-0000-0000-000000000005', NULL,                                       NULL,                                           NULL),
  ('2026-04-13', 'smt_parte1',           'a0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000002',     'Primera visita',                               'principal'),
  ('2026-04-13', 'smt_parte2',           'a0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000003',     'Explicar las escrituras',                      'principal'),
  ('2026-04-13', 'nvc_parte1',           'a0000001-0000-0000-0000-000000000008', NULL,                                       'La oración como fuente de fortaleza',          NULL),
  ('2026-04-13', 'estudio_congregacion', 'a0000001-0000-0000-0000-000000000001', NULL,                                       'Lección 5 — Aférrate a Jehová',                NULL),
  ('2026-04-13', 'cierre',               'a0000001-0000-0000-0000-000000000001', NULL,                                       NULL,                                           NULL);

-- ------------------------------------------------------------
-- Semana 2026-04-20 (lunes)
-- ------------------------------------------------------------
INSERT INTO asignaciones_semana (semana, parte_id, asignado_id, asistente_id, tema, sala) VALUES
  ('2026-04-20', 'presidente',           'a0000001-0000-0000-0000-000000000002', NULL,                                       NULL,                                           NULL),
  ('2026-04-20', 'lector_tesoros',       'a0000001-0000-0000-0000-000000000003', NULL,                                       NULL,                                           NULL),
  ('2026-04-20', 'discurso_tesoros',     'a0000001-0000-0000-0000-000000000004', NULL,                                       'Busca las perlas escondidas',                  NULL),
  ('2026-04-20', 'mejores_maestros',     'a0000001-0000-0000-0000-000000000005', NULL,                                       'Usa ilustraciones efectivas',                  NULL),
  ('2026-04-20', 'busqueda_tesoros',     'a0000001-0000-0000-0000-000000000006', NULL,                                       NULL,                                           NULL),
  ('2026-04-20', 'smt_parte1',           'a0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000004',     'Segunda visita',                               'principal'),
  ('2026-04-20', 'smt_parte2',           'a0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000005',     'Hacer discípulos',                             'principal'),
  ('2026-04-20', 'nvc_parte1',           'a0000001-0000-0000-0000-000000000011', NULL,                                       'Permaneced en el amor de Dios',                NULL),
  ('2026-04-20', 'estudio_congregacion', 'a0000001-0000-0000-0000-000000000002', NULL,                                       'Lección 6 — Sé fiel hasta la muerte',          NULL),
  ('2026-04-20', 'cierre',               'a0000001-0000-0000-0000-000000000002', NULL,                                       NULL,                                           NULL);

-- ------------------------------------------------------------
-- Semana 2026-04-27 (lunes)
-- ------------------------------------------------------------
INSERT INTO asignaciones_semana (semana, parte_id, asignado_id, asistente_id, tema, sala) VALUES
  ('2026-04-27', 'presidente',           'a0000001-0000-0000-0000-000000000003', NULL,                                       NULL,                                           NULL),
  ('2026-04-27', 'lector_tesoros',       'a0000001-0000-0000-0000-000000000004', NULL,                                       NULL,                                           NULL),
  ('2026-04-27', 'discurso_tesoros',     'a0000001-0000-0000-0000-000000000005', NULL,                                       'Minas de plata y tesoros escondidos',          NULL),
  ('2026-04-27', 'mejores_maestros',     'a0000001-0000-0000-0000-000000000006', NULL,                                       'Adapta tu predicación a tu oyente',            NULL),
  ('2026-04-27', 'busqueda_tesoros',     'a0000001-0000-0000-0000-000000000007', NULL,                                       NULL,                                           NULL),
  ('2026-04-27', 'smt_parte1',           'a0000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000006',     'Tercera visita',                               'principal'),
  ('2026-04-27', 'smt_parte2',           'a0000001-0000-0000-0000-000000000013', 'a0000001-0000-0000-0000-000000000007',     'Estudio bíblico en el ministerio',             'principal'),
  ('2026-04-27', 'nvc_parte1',           'a0000001-0000-0000-0000-000000000014', NULL,                                       'Fortalece tu fe con la oración',               NULL),
  ('2026-04-27', 'estudio_congregacion', 'a0000001-0000-0000-0000-000000000003', NULL,                                       'Lección 7 — Resiste al Diablo',                NULL),
  ('2026-04-27', 'cierre',               'a0000001-0000-0000-0000-000000000003', NULL,                                       NULL,                                           NULL);

-- ------------------------------------------------------------
-- Semana 2026-05-04 (lunes)
-- ------------------------------------------------------------
INSERT INTO asignaciones_semana (semana, parte_id, asignado_id, asistente_id, tema, sala) VALUES
  ('2026-05-04', 'presidente',           'a0000001-0000-0000-0000-000000000001', NULL,                                       NULL,                                           NULL),
  ('2026-05-04', 'lector_tesoros',       'a0000001-0000-0000-0000-000000000005', NULL,                                       NULL,                                           NULL),
  ('2026-05-04', 'discurso_tesoros',     'a0000001-0000-0000-0000-000000000006', NULL,                                       'El valor incalculable de la sabiduría',         NULL),
  ('2026-05-04', 'mejores_maestros',     'a0000001-0000-0000-0000-000000000007', NULL,                                       'Sé organizado en tu predicación',              NULL),
  ('2026-05-04', 'busqueda_tesoros',     'a0000001-0000-0000-0000-000000000008', NULL,                                       NULL,                                           NULL),
  ('2026-05-04', 'smt_parte1',           'a0000001-0000-0000-0000-000000000015', 'a0000001-0000-0000-0000-000000000008',     'Cuarta visita',                                'principal'),
  ('2026-05-04', 'smt_parte2',           'a0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000009',     'Ayudar a alguien a progresar',                 'principal'),
  ('2026-05-04', 'nvc_parte1',           'a0000001-0000-0000-0000-000000000010', NULL,                                       'Cuida tu corazón con toda vigilancia',         NULL),
  ('2026-05-04', 'estudio_congregacion', 'a0000001-0000-0000-0000-000000000001', NULL,                                       'Lección 8 — Confía en Jehová de todo corazón', NULL),
  ('2026-05-04', 'cierre',               'a0000001-0000-0000-0000-000000000001', NULL,                                       NULL,                                           NULL);

-- ============================================================
-- 4. ASIGNACIONES FIN DE SEMANA
-- ============================================================
-- Partes (programa-fds.ts):
--   fds_presidente, fds_orador (tieneTema=true), fds_presidente_atalaya,
--   fds_lector_atalaya, fds_oracion_final
-- ============================================================

-- Domingo 2026-04-12
INSERT INTO asignaciones_fds (fecha, parte_id, asignado_id, tema) VALUES
  ('2026-04-12', 'fds_presidente',         'a0000001-0000-0000-0000-000000000001', NULL),
  ('2026-04-12', 'fds_orador',             'a0000001-0000-0000-0000-000000000002', 'Discurso Público: ¿Podemos confiar en la Biblia?'),
  ('2026-04-12', 'fds_presidente_atalaya', 'a0000001-0000-0000-0000-000000000003', NULL),
  ('2026-04-12', 'fds_lector_atalaya',     'a0000001-0000-0000-0000-000000000004', NULL),
  ('2026-04-12', 'fds_oracion_final',      'a0000001-0000-0000-0000-000000000005', NULL);

-- Domingo 2026-04-19
INSERT INTO asignaciones_fds (fecha, parte_id, asignado_id, tema) VALUES
  ('2026-04-19', 'fds_presidente',         'a0000001-0000-0000-0000-000000000002', NULL),
  ('2026-04-19', 'fds_orador',             'a0000001-0000-0000-0000-000000000011', 'Discurso Público: ¿Qué es la felicidad verdadera?'),
  ('2026-04-19', 'fds_presidente_atalaya', 'a0000001-0000-0000-0000-000000000001', NULL),
  ('2026-04-19', 'fds_lector_atalaya',     'a0000001-0000-0000-0000-000000000006', NULL),
  ('2026-04-19', 'fds_oracion_final',      'a0000001-0000-0000-0000-000000000007', NULL);

-- Domingo 2026-04-26
INSERT INTO asignaciones_fds (fecha, parte_id, asignado_id, tema) VALUES
  ('2026-04-26', 'fds_presidente',         'a0000001-0000-0000-0000-000000000003', NULL),
  ('2026-04-26', 'fds_orador',             'a0000001-0000-0000-0000-000000000012', 'Discurso Público: La familia — una dádiva de Dios'),
  ('2026-04-26', 'fds_presidente_atalaya', 'a0000001-0000-0000-0000-000000000002', NULL),
  ('2026-04-26', 'fds_lector_atalaya',     'a0000001-0000-0000-0000-000000000008', NULL),
  ('2026-04-26', 'fds_oracion_final',      'a0000001-0000-0000-0000-000000000009', NULL);

-- Domingo 2026-05-03
INSERT INTO asignaciones_fds (fecha, parte_id, asignado_id, tema) VALUES
  ('2026-05-03', 'fds_presidente',         'a0000001-0000-0000-0000-000000000001', NULL),
  ('2026-05-03', 'fds_orador',             'a0000001-0000-0000-0000-000000000013', 'Discurso Público: ¿Hay esperanza después de la muerte?'),
  ('2026-05-03', 'fds_presidente_atalaya', 'a0000001-0000-0000-0000-000000000003', NULL),
  ('2026-05-03', 'fds_lector_atalaya',     'a0000001-0000-0000-0000-000000000010', NULL),
  ('2026-05-03', 'fds_oracion_final',      'a0000001-0000-0000-0000-000000000014', NULL);
