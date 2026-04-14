/**
 * seed-publicadores.ts
 * Inserta los publicadores desde supabase/publicadores.txt en Supabase.
 *
 * Uso:
 *   npx tsx supabase/scripts/seed-publicadores.ts --congregacion-id <uuid>           # insert real
 *   npx tsx supabase/scripts/seed-publicadores.ts --congregacion-id <uuid> --dry-run # solo imprime, no inserta
 *
 * Variables de entorno requeridas (en .env.local):
 *   VITE_SUPABASE_URL          — URL del proyecto Supabase
 *   SUPABASE_SERVICE_ROLE_KEY  — service role key (bypasa RLS)
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// ─── Cargar .env.local manualmente ──────────────────────────────────────────

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

const env = { ...loadEnv(resolve(process.cwd(), '.env.local')), ...process.env }

const SUPABASE_URL = env['VITE_SUPABASE_URL'] ?? env['SUPABASE_URL'] ?? ''
const SERVICE_KEY  = env['SUPABASE_SERVICE_ROLE_KEY'] ?? ''

const isDryRun = process.argv.includes('--dry-run')

const congIdIdx = process.argv.indexOf('--congregacion-id')
const CONGREGACION_ID = congIdIdx !== -1 ? process.argv[congIdIdx + 1] : ''

if (!CONGREGACION_ID) {
  console.error('❌ Falta --congregacion-id <uuid>')
  console.error('   Ejemplo: npx tsx supabase/scripts/seed-publicadores.ts --congregacion-id c263174d-...')
  process.exit(1)
}

if (!isDryRun && (!SUPABASE_URL || !SERVICE_KEY)) {
  console.error('❌ Faltan variables de entorno:')
  console.error('   VITE_SUPABASE_URL         →', SUPABASE_URL ? '✓' : '✗ falta')
  console.error('   SUPABASE_SERVICE_ROLE_KEY  →', SERVICE_KEY  ? '✓' : '✗ falta')
  console.error('\nAgregá SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toTitleCase(str: string): string {
  const lower = ['de', 'del', 'la', 'las', 'los', 'y']
  return str
    .toLowerCase()
    .split(' ')
    .map((w, i) => (i === 0 || !lower.includes(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ')
}

function parseLine(line: string): { nombre: string; apellido: string } {
  // Las mujeres casadas chilenas usan "DE" como sufijo: "APELLIDO NOMBRE DE"
  // Lo removemos antes de parsear para evitar nombre="De"
  const normalized = line.trim().replace(/\s+DE\s*$/i, '').trim()
  const parts = normalized.split(/\s+/)
  if (parts.length === 1) return { nombre: toTitleCase(parts[0]), apellido: '' }
  const nombre   = toTitleCase(parts[parts.length - 1])
  const apellido = toTitleCase(parts.slice(0, -1).join(' '))
  return { nombre, apellido }
}

// ─── Main ────────────────────────────────────────────────────────────────────

const txtPath  = resolve(process.cwd(), 'supabase/publicadores.txt')

const lines = readFileSync(txtPath, 'utf8')
  .split('\n')
  .map(l => l.trim())
  .filter(Boolean)

const publicadores = lines.map(parseLine)

if (isDryRun) {
  console.log(`\n📋 DRY RUN — ${publicadores.length} publicadores a insertar:\n`)
  publicadores.forEach(({ nombre, apellido }, i) => {
    console.log(`  ${String(i + 1).padStart(3)}. apellido="${apellido}" | nombre="${nombre}"`)
  })
  console.log('\n✅ Dry run completo. Corré sin --dry-run para insertar.')
  process.exit(0)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

console.log(`\n🚀 Insertando ${publicadores.length} publicadores en Supabase...\n`)

let insertados = 0
let errores    = 0

for (const { nombre, apellido } of publicadores) {
  const { error } = await supabase
    .from('publicadores')
    .insert({ nombre, apellido, rol: 'publicador', activo: true, congregacion_id: CONGREGACION_ID })

  if (error) {
    console.error(`  ✗ ${apellido} ${nombre}: ${error.message}`)
    errores++
  } else {
    console.log(`  ✓ ${apellido} ${nombre}`)
    insertados++
  }
}

console.log(`\n─────────────────────────────────`)
console.log(`✅ Insertados : ${insertados}`)
if (errores > 0) console.log(`❌ Errores    : ${errores}`)
console.log(`Total        : ${publicadores.length}`)
