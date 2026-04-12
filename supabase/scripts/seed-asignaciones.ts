/**
 * seed-asignaciones.ts
 * Inserta las asignaciones del programa marzo-abril 2026 en asignaciones_semana.
 * Los datos están hardcodeados desde el análisis de PROGRAMA MARZO Y ABRIL 2026.csv.
 *
 * Uso:
 *   npx tsx supabase/scripts/seed-asignaciones.ts                         # inserta todas las semanas
 *   npx tsx supabase/scripts/seed-asignaciones.ts --dry-run               # verifica lookups, no inserta
 *   npx tsx supabase/scripts/seed-asignaciones.ts --semana 2026-03-02     # solo esa semana
 *
 * Variables de entorno requeridas (en .env.local):
 *   VITE_SUPABASE_URL         — URL del proyecto Supabase
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (bypasa RLS)
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// ─── Env loading ─────────────────────────────────────────────────────────────

function loadEnv(filePath: string): Record<string, string> {
  try {
    return Object.fromEntries(
      readFileSync(filePath, 'utf8')
        .split('\n')
        .filter(l => l && !l.startsWith('#') && l.includes('='))
        .map(l => {
          const idx = l.indexOf('=')
          return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '')]
        })
    )
  } catch {
    return {}
  }
}

const env        = { ...loadEnv(resolve(process.cwd(), '.env.local')), ...process.env }
const SUPABASE_URL = env['VITE_SUPABASE_URL'] ?? env['SUPABASE_URL'] ?? ''
const SERVICE_KEY  = env['SUPABASE_SERVICE_ROLE_KEY'] ?? ''

const isDryRun = process.argv.includes('--dry-run')
const semanaIdx = process.argv.indexOf('--semana')
const semanaFiltro = semanaIdx !== -1 ? process.argv[semanaIdx + 1] : undefined

if (!isDryRun && (!SUPABASE_URL || !SERVICE_KEY)) {
  console.error('❌ Faltan variables de entorno:')
  console.error('   VITE_SUPABASE_URL         →', SUPABASE_URL ? '✓' : '✗ falta')
  console.error('   SUPABASE_SERVICE_ROLE_KEY  →', SERVICE_KEY  ? '✓' : '✗ falta')
  console.error('\nAgregá SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawAsignacion {
  parte_id: string
  pub: string              // nombre completo del publicador (del CSV)
  asist?: string           // nombre completo del asistente (del CSV)
  sala?: 'principal' | 'B'
}

interface ResolvedAsignacion {
  semana: string
  parte_id: string
  asignado_id: string      // columna real en DB (NOT NULL)
  asistente_id: string | null
  sala: string | null
}

// ─── Data hardcodeada: 8 semanas marzo-abril 2026 ────────────────────────────
// Fuente: supabase/PROGRAMA MARZO Y ABRIL 2026.csv
// La semana se identifica por el lunes correspondiente (fecha ISO).
//
// Edge cases conocidos:
//   NOT IN DB: "Aarón Liempi", "Alison Moya"
//   NOMBRE DIFERENTE: "Daisy" (DB: Deysi), "Jahaziel" (DB: Jaziel),
//                     "Estephany" (DB: Stephany), "Franklyn" (DB: Franklin)
//   AMBIGUOS: "Pedro Jiménez" (2 en DB), "Marcos Moya" / "Marco Moya" (2 en DB)
//   SALA B no se inserta (misma parte_id, viola unicidad) → se loguea como advertencia

const SEMANAS: { semana: string; asignaciones: RawAsignacion[] }[] = [
  {
    semana: '2026-03-02', // CSV: 5-mar
    asignaciones: [
      { parte_id: 'presidente',           pub: 'Diego Ortega' },
      { parte_id: 'discurso_tesoros',     pub: 'Enrique Gallardo' },
      { parte_id: 'busqueda_tesoros',     pub: 'Hernán Gutierrez' },
      { parte_id: 'mejores_maestros',     pub: 'Gabriel Villegas' },
      { parte_id: 'smt_parte1',           pub: 'Isidora Palacios',     asist: 'Melisa Gutierrez',     sala: 'principal'},  // CSV: "Melissa" → DB: "Melisa"
      { parte_id: 'smt_parte2',           pub: 'Johanna de Palacios',  asist: 'Brandon Palacios',     sala: 'principal'},
      { parte_id: 'smt_parte3',           pub: 'Romer Sequea',                                        sala: 'principal'},
      { parte_id: 'nvc_parte1',           pub: 'Benjamín Jorquera' },
      { parte_id: 'nvc_parte2',           pub: 'Jhodan Santana' },
      { parte_id: 'estudio_congregacion', pub: 'Arturo Mosquera' },
      { parte_id: 'cierre',               pub: 'Miguel Barbaste' },
    ],
  },
  {
    semana: '2026-03-09', // CSV: 12-mar — 4 partes SMT + Sala B en mejores_maestros
    // NOTA: "Aarón Liempi" (mejores_maestros Sala Principal) no está en DB → skip
    // NOTA: "Alison Moya" (smt_parte1 Sala Principal) no está en DB → skip
    // NOTA: Sala B de mejores_maestros (Agustín Ortíz) y smt_parte1 (Oliva Rojas / Shirley Parra) no se inserta
    asignaciones: [
      { parte_id: 'presidente',           pub: 'Claudio González' },
      { parte_id: 'discurso_tesoros',     pub: 'Brandon Palacios' },
      { parte_id: 'busqueda_tesoros',     pub: 'Francisco Pizarro' },
      { parte_id: 'mejores_maestros',     pub: 'Aarón Liempi' },       // NOT IN DB — se omitirá
      { parte_id: 'smt_parte1',           pub: 'Alison Moya',          asist: 'Stephany de Sequea',   sala: 'principal'}, // Alison: NOT IN DB — se omitirá; CSV: "Estephany" → DB: "Stephany"
      { parte_id: 'smt_parte2',           pub: 'Paulina de Astorga',   asist: 'Natalia Romero',       sala: 'principal'},
      { parte_id: 'smt_parte3',           pub: 'Nataly de Morales',    asist: 'Sergio Morales',       sala: 'principal'},
      { parte_id: 'smt_parte4',           pub: 'Vania de Reyes',       asist: 'Juanita de González',  sala: 'principal'},
      { parte_id: 'nvc_parte1',           pub: 'Marcelo Reyes' },
      { parte_id: 'estudio_congregacion', pub: 'René Calderón' },
      { parte_id: 'cierre',               pub: 'Claudio González' },
    ],
  },
  {
    semana: '2026-03-16', // CSV: 19-mar — Sala B en mejores_maestros y smt_parte1
    // NOTA: Sala B de mejores_maestros (Bernardo Romero) y smt_parte1 (Estephanie de Sequea / Andrea de Contreras) no se inserta
    // NOTA: "Marco Moya" puede resolver ambiguo con "Marcos Moya" — se usa el primer resultado
    asignaciones: [
      { parte_id: 'presidente',           pub: 'Miguel Barbaste' },
      { parte_id: 'discurso_tesoros',     pub: 'Marco Moya' },         // AMBIGUOUS con Marcos Moya
      { parte_id: 'busqueda_tesoros',     pub: 'César Araya' },
      { parte_id: 'mejores_maestros',     pub: 'Carlos Argarañaz' },
      { parte_id: 'smt_parte1',           pub: 'Enrique Gallardo',     asist: 'Leslie de Gallardo',   sala: 'principal'},
      { parte_id: 'smt_parte2',           pub: 'Deysi de Araya',       asist: 'Miriam de Gutierrez',  sala: 'principal'}, // CSV: "Daisy" → DB: "Deysi"
      { parte_id: 'smt_parte3',           pub: 'Jisennia de Romero',   asist: 'Katherine Calderón',   sala: 'principal'},
      { parte_id: 'nvc_parte1',           pub: 'Carlos Valdés' },
      { parte_id: 'nvc_parte2',           pub: 'Wilmer Salinas' },
      { parte_id: 'estudio_congregacion', pub: 'Sergio Morales' },
      { parte_id: 'cierre',               pub: 'Diego Ortega' },
    ],
  },
  {
    semana: '2026-03-23', // CSV: 26-mar — solo 1 parte NVC
    // NOTA: Sala B de mejores_maestros (Manuel Flores) y smt_parte1 (Carlos Valdés / Samuel Guzhnay) no se inserta
    // NOTA: "Pedro Jiménez" puede ser AMBIGUOS (2 en DB) — se usa el primero
    asignaciones: [
      { parte_id: 'presidente',           pub: 'Brandon Palacios' },
      { parte_id: 'discurso_tesoros',     pub: 'Benjamín Jorquera' },
      { parte_id: 'busqueda_tesoros',     pub: 'Arturo Mosquera' },
      { parte_id: 'mejores_maestros',     pub: 'Lucas Araya' },
      { parte_id: 'smt_parte1',           pub: 'Francisco Pizarro',    asist: 'Pedro Jiménez',        sala: 'principal'}, // Pedro AMBIGUOUS
      { parte_id: 'smt_parte2',           pub: 'Carla Reyes',          asist: 'Daniela de Ortega',    sala: 'principal'},
      { parte_id: 'smt_parte3',           pub: 'Gloria Marchant',      asist: 'Juanita de González',  sala: 'principal'},
      { parte_id: 'nvc_parte1',           pub: 'Miguel Barbaste' },
      { parte_id: 'estudio_congregacion', pub: 'Marcelo Reyes' },
      { parte_id: 'cierre',               pub: 'Brandon Palacios' },
    ],
  },
  {
    semana: '2026-04-06', // CSV: 9-abr (sin semana 2-abr: Conmemoración)
    // NOTA: Sala B de mejores_maestros (Héctor Astete) y smt_parte1 (Marcos Moya / Romer Sequea) no se inserta
    // NOTA: "Jahaziel Sequea" puede no encontrarse si en DB está como "Jaziel"
    asignaciones: [
      { parte_id: 'presidente',           pub: 'Ricardo Reyes' },
      { parte_id: 'discurso_tesoros',     pub: 'Claudio González' },
      { parte_id: 'busqueda_tesoros',     pub: 'Jhodan Santana' },
      { parte_id: 'mejores_maestros',     pub: 'Jaziel Sequea' },      // CSV: "Jahaziel" → DB: "Jaziel"
      { parte_id: 'smt_parte1',           pub: 'Hernán Gutierrez',     asist: 'Miguel Hamed',         sala: 'principal'},
      { parte_id: 'smt_parte2',           pub: 'Magaly de Reyes',      asist: 'Natalia Opazo',        sala: 'principal'},
      { parte_id: 'smt_parte3',           pub: 'Wilmer Salinas',       asist: 'Miguel Barbaste',      sala: 'principal'},
      { parte_id: 'nvc_parte1',           pub: 'Arturo Mosquera' },
      { parte_id: 'estudio_congregacion', pub: 'César Araya' },
      { parte_id: 'cierre',               pub: 'Ricardo Reyes' },
    ],
  },
  {
    semana: '2026-04-13', // CSV: 16-abr — typo "Sala Proncipal" en CSV (corregido)
    // NOTA: Sala B de mejores_maestros (Manuel Rodriguez) y smt_parte1 (Natalia Romero / Valentina Contreras) no se inserta
    asignaciones: [
      { parte_id: 'presidente',           pub: 'Sergio Morales' },
      { parte_id: 'discurso_tesoros',     pub: 'Carlos Valdés' },
      { parte_id: 'busqueda_tesoros',     pub: 'Jorge Francoise' },
      { parte_id: 'mejores_maestros',     pub: 'Manuel Flores' },
      { parte_id: 'smt_parte1',           pub: 'Arturo Mosquera',      asist: 'René Calderón',        sala: 'principal'},
      { parte_id: 'smt_parte2',           pub: 'Isabel Limonghi',      asist: 'Patricia de Mosquera', sala: 'principal'},
      { parte_id: 'smt_parte3',           pub: 'Stella Maris',         asist: 'Vania de Reyes',       sala: 'principal'},
      { parte_id: 'nvc_parte1',           pub: 'Diego Ortega' },
      { parte_id: 'estudio_congregacion', pub: 'Benjamín Jorquera' },
      { parte_id: 'cierre',               pub: 'Sergio Morales' },
    ],
  },
  {
    semana: '2026-04-20', // CSV: 23-abr — 4 partes SMT
    // NOTA: Sala B de mejores_maestros (Miguel Flores) y smt_parte1 (Stephany de Sequea / Karhol de Parada) no se inserta
    // NOTA: "Marcos Moya" AMBIGUOUS (2 en DB) — se usa el primero
    asignaciones: [
      { parte_id: 'presidente',           pub: 'Marcelo Reyes' },
      { parte_id: 'discurso_tesoros',     pub: 'René Calderón' },
      { parte_id: 'busqueda_tesoros',     pub: 'Miguel Barbaste' },
      { parte_id: 'mejores_maestros',     pub: 'Manuel Vallejos' },
      { parte_id: 'smt_parte1',           pub: 'Patricia de Mosquera', asist: 'Fabiola Rodriguez',    sala: 'principal'},
      { parte_id: 'smt_parte2',           pub: 'Shirley Parra',        asist: 'Javiera de Zamora',    sala: 'principal'},
      { parte_id: 'smt_parte3',           pub: 'Andrea de Contreras',  asist: 'Johanna de Palacios',  sala: 'principal'},
      { parte_id: 'smt_parte4',           pub: 'Gabriel Villegas',                                    sala: 'principal'},
      { parte_id: 'nvc_parte1',           pub: 'Marcos Moya' },        // AMBIGUOUS
      { parte_id: 'estudio_congregacion', pub: 'Claudio González' },
      { parte_id: 'cierre',               pub: 'Marcelo Reyes' },
    ],
  },
  {
    semana: '2026-04-27', // CSV: 30-abr — solo 1 parte NVC
    // NOTA: Sala B de mejores_maestros (Rodrigo Romero) y smt_parte1 (Karla de Liempi / Isidora Palacios) no se inserta
    // NOTA: "Franklyn Orrego" puede no encontrarse si en DB está como "Franklin"
    asignaciones: [
      { parte_id: 'presidente',           pub: 'César Araya' },
      { parte_id: 'discurso_tesoros',     pub: 'Ricardo Reyes' },
      { parte_id: 'busqueda_tesoros',     pub: 'Wilmer Salinas' },
      { parte_id: 'mejores_maestros',     pub: 'Miguel Hamed' },
      { parte_id: 'smt_parte1',           pub: 'Margarita de Calderón', asist: 'Katherine Calderón',  sala: 'principal'},
      { parte_id: 'smt_parte2',           pub: 'Franklin Orrego',                                     sala: 'principal'}, // CSV: "Franklyn" → DB: "Franklin"
      { parte_id: 'smt_parte3',           pub: 'Mónica de Rondanelli',  asist: 'Teresa de Romero',    sala: 'principal'},
      { parte_id: 'nvc_parte1',           pub: 'Sergio Morales' },
      { parte_id: 'estudio_congregacion', pub: 'Diego Ortega' },
      { parte_id: 'cierre',               pub: 'César Araya' },
    ],
  },
]

// ─── Accent normalization ─────────────────────────────────────────────────────

/**
 * Elimina diacríticos (acentos) de un string.
 * La DB fue seeded desde un TXT en MAYÚSCULAS sin acentos, por lo que
 * ilike('%Hernán%') no matchea 'Hernan'. Este helper normaliza el término de búsqueda.
 */
function stripAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// ─── Name parsing ─────────────────────────────────────────────────────────────

/**
 * Convierte un nombre completo del CSV a (nombre, apellido) para el lookup en DB.
 * La DB almacena: nombre=primer nombre, apellido=todo lo demás.
 * Para "Nombre de Apellido" (casadas): nombre=Nombre, apellido=Apellido (sin "de").
 */
function parseCsvName(fullName: string): { nombre: string; apellido: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { nombre: parts[0], apellido: '' }

  // Patrón "Nombre de Apellido" o "Nombre del Apellido" → ignorar la preposición
  if (
    parts.length >= 3 &&
    (parts[1].toLowerCase() === 'de' || parts[1].toLowerCase() === 'del')
  ) {
    return { nombre: parts[0], apellido: parts.slice(2).join(' ') }
  }

  return { nombre: parts[0], apellido: parts.slice(1).join(' ') }
}

// ─── Lookup ───────────────────────────────────────────────────────────────────

type SupabaseClient = ReturnType<typeof createClient>

async function findPublicador(
  supabase: SupabaseClient,
  fullName: string,
  contexto: string,
): Promise<string | null> {
  const { nombre, apellido } = parseCsvName(fullName)

  // Stripear acentos del término de búsqueda — la DB tiene nombres sin acentos
  // (seeded desde TXT en MAYÚSCULAS). ilike('%Hernán%') no matchea 'Hernan'.
  const nombreQ  = stripAccents(nombre)
  const apellidoQ = apellido ? stripAccents(apellido) : null

  let query = supabase
    .from('publicadores')
    .select('id, nombre, apellido')
    .ilike('nombre', `%${nombreQ}%`)

  if (apellidoQ) {
    query = query.ilike('apellido', `%${apellidoQ}%`)
  }

  const { data, error } = await query

  if (error) {
    console.warn(`    ⚠ [${contexto}] Error buscando "${fullName}": ${error.message}`)
    return null
  }

  if (!data || data.length === 0) {
    console.warn(`    ✗ [${contexto}] No encontrado: "${fullName}" (nombre="${nombre}", apellido="${apellido}")`)
    return null
  }

  if (data.length > 1) {
    const matches = (data as { nombre: string; apellido: string }[])
      .map(p => `${p.nombre} ${p.apellido}`)
      .join(' | ')
    console.warn(`    ⚠ [${contexto}] Ambiguo: "${fullName}" → [${matches}]. Usando el primero.`)
  }

  return (data[0] as { id: string }).id
}

// ─── Resolve semana ───────────────────────────────────────────────────────────

async function resolveSemana(
  supabase: SupabaseClient,
  semana: string,
  raw: RawAsignacion[],
): Promise<ResolvedAsignacion[]> {
  const resolved: ResolvedAsignacion[] = []

  for (const a of raw) {
    const ctx = `${semana} ${a.parte_id}`
    const asignado_id  = await findPublicador(supabase, a.pub, ctx)
    const asistente_id = a.asist ? await findPublicador(supabase, a.asist, `${ctx} asist`) : null

    if (!asignado_id) continue  // asignado_id es NOT NULL en DB — skip si no se resuelve

    resolved.push({
      semana,
      parte_id:    a.parte_id,
      asignado_id,
      asistente_id,
      sala:        a.sala ?? null,
    })
  }

  return resolved
}

// ─── Dry-run resolver (usa cliente real para lookups, pero no modifica datos) ─

async function dryRunSemana(
  supabase: SupabaseClient,
  semana: string,
  raw: RawAsignacion[],
): Promise<void> {
  console.log(`\n  Semana ${semana} (${raw.length} asignaciones):`)
  const resolved = await resolveSemana(supabase, semana, raw)
  const omitidos = raw.length - resolved.length
  for (const r of resolved) {
    console.log(`    ✓ ${r.parte_id} → asignado: ${r.asignado_id}${r.asistente_id ? ` | asistente: ${r.asistente_id}` : ''}${r.sala ? ` | sala: ${r.sala}` : ''}`)
  }
  console.log(`  → ${resolved.length} ok, ${omitidos} no resueltos`)
}

// ─── Insertar semana ──────────────────────────────────────────────────────────

async function insertarSemana(
  supabase: SupabaseClient,
  semana: string,
  raw: RawAsignacion[],
): Promise<{ insertados: number; omitidos: number }> {
  // Resolver publicadores — ya filtra los no-encontrados (asignado_id NOT NULL)
  const resolved = await resolveSemana(supabase, semana, raw)
  const omitidos = raw.length - resolved.length

  // DELETE todas las asignaciones existentes para esta semana (idempotente)
  const { error: delError } = await supabase
    .from('asignaciones_semana')
    .delete()
    .eq('semana', semana)

  if (delError) {
    console.error(`  ❌ Error eliminando asignaciones de ${semana}: ${delError.message}`)
    return { insertados: 0, omitidos }
  }

  if (resolved.length === 0) {
    console.log(`  ⚠ Semana ${semana}: ninguna asignación resoluble, skip.`)
    return { insertados: 0, omitidos }
  }

  // INSERT las asignaciones resueltas
  const { error: insError } = await supabase
    .from('asignaciones_semana')
    .insert(resolved)

  if (insError) {
    console.error(`  ❌ Error insertando semana ${semana}: ${insError.message}`)
    return { insertados: 0, omitidos }
  }

  console.log(`  ✓ Semana ${semana}: ${resolved.length} insertadas${omitidos > 0 ? `, ${omitidos} omitidas (no encontradas)` : ''}`)
  return { insertados: resolved.length, omitidos }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL || 'http://placeholder', SERVICE_KEY || 'placeholder', {
  auth: { persistSession: false },
})

const semanas = semanaFiltro
  ? SEMANAS.filter(s => s.semana === semanaFiltro)
  : SEMANAS

if (semanaFiltro && semanas.length === 0) {
  console.error(`❌ Semana "${semanaFiltro}" no encontrada en los datos hardcodeados.`)
  console.error('   Semanas disponibles:', SEMANAS.map(s => s.semana).join(', '))
  process.exit(1)
}

if (isDryRun) {
  console.log(`\n📋 DRY RUN — verificando lookups para ${semanas.length} semana(s)...\n`)
  for (const { semana, asignaciones } of semanas) {
    await dryRunSemana(supabase, semana, asignaciones)
  }
  console.log('\n✅ Dry run completo. Corré sin --dry-run para insertar.')
  process.exit(0)
}

console.log(`\n🚀 Insertando asignaciones para ${semanas.length} semana(s)...\n`)

let totalInsertados = 0
let totalOmitidos   = 0

for (const { semana, asignaciones } of semanas) {
  const { insertados, omitidos } = await insertarSemana(supabase, semana, asignaciones)
  totalInsertados += insertados
  totalOmitidos   += omitidos
}

console.log('\n─────────────────────────────────────────────')
console.log(`✅ Total insertadas : ${totalInsertados}`)
if (totalOmitidos > 0) console.log(`⚠  Total omitidas  : ${totalOmitidos} (publicador no encontrado en DB)`)
console.log(`   Semanas         : ${semanas.length}`)
