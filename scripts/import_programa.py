#!/usr/bin/env python3
"""
Importa PROGRAMA_MAYO_JUNIO.xlsx → SQL para asignaciones_semana.

Carga estructura (semana, parte_id, tema, sala) sin asignado_id.
Requiere migración 011_asignado_nullable_semana.sql aplicada.

Uso:
    python3 import_programa.py [archivo.xlsx] > output.sql
"""

import re
import sys
import openpyxl
from datetime import datetime, date, timedelta


def lunes_de_semana(d: date) -> date:
    """Retorna el lunes de la semana que contiene d (igual que getLunesDeSemana)."""
    return d - timedelta(days=d.weekday())

CONGREGACION_ID = 'c263174d-a4d8-4277-8c65-9bcc564e988a'

# Semanas a omitir (ej: visita del superintendente de circuito)
SKIP_WEEKS: set[date] = {date(2026, 6, 2)}


# ── Extracción de tema ────────────────────────────────────────────────────────

def _base_clean(text: str) -> str:
    """Limpia número inicial, duración y espacios."""
    text = re.sub(r'^\d+\.\s*', '', text)          # quita "N. "
    text = text.split('\n')[0].strip()              # primera línea solo
    text = re.sub(r'\(\d+\s+mins?\.?\)', '', text)  # quita "(X mins.)"
    text = re.sub(r'\s+', ' ', text).strip().rstrip('.')
    return text

def tema_general(col1: str | None) -> str | None:
    if not col1:
        return None
    return _base_clean(str(col1)) or None

def tema_lectura(col1: str | None) -> str | None:
    """Extrae referencia bíblica: 'Is 59:1-12', 'Jer 3:14-25'."""
    if not col1:
        return None
    m = re.search(r'\)\s+([A-Za-záéíóúÁÉÍÓÚ]+\s+\d+:\d+[-\d]*)', str(col1))
    return m.group(1).strip() if m else tema_general(col1)

def tema_estudio(col1: str | None) -> str | None:
    """Extrae referencia lfb: 'lfb lecciones 82, 83'."""
    if not col1:
        return None
    m = re.search(r'(lfb\s+.+?)$', str(col1), re.IGNORECASE)
    if m:
        return m.group(1).strip().rstrip('.')
    return tema_general(col1)


# ── Parsing del xlsx ──────────────────────────────────────────────────────────

def parse_weeks(filepath: str) -> list[tuple[date, list[tuple]]]:
    """Devuelve lista de (week_date, rows) por semana."""
    wb = openpyxl.load_workbook(filepath)
    ws = wb['Hoja1']
    all_rows = [r for r in ws.iter_rows(values_only=True) if any(c is not None for c in r)]

    weeks = []
    i = 0
    while i < len(all_rows):
        row = all_rows[i]
        if row[0] == 'Semana':
            i += 1
            if i < len(all_rows) and isinstance(all_rows[i][0], datetime):
                week_date = lunes_de_semana(all_rows[i][0].date())
                i += 1
                body = []
                while i < len(all_rows) and all_rows[i][0] != 'Semana':
                    body.append(all_rows[i])
                    i += 1
                weeks.append((week_date, body))
            continue
        i += 1

    return weeks


def classify_rows(week_date: date, rows: list[tuple]) -> list[dict]:
    """Convierte filas xlsx en dicts de asignacion."""
    section = 'apertura'
    smt_count = 0
    nvc_count = 0
    result = []

    for row in rows:
        col0 = str(row[0] or '').strip()
        col1 = str(row[1] or '').strip()
        col0_up = col0.upper()
        col1_low = col1.lower()

        # ── Marcadores de sección ──────────────────────────────────────────
        if 'TESOROS DE LA BIBLIA' in col0_up:
            section = 'tesoros'
            continue
        if 'SEAMOS MEJORES MAESTROS' in col0_up:
            section = 'smt'
            smt_count = 0
            continue
        if 'NUESTRA VIDA CRISTIANA' in col0_up:
            section = 'nvc'
            nvc_count = 0
            continue
        if 'SUPERINTENDENTE DE CIRCUITO' in col0_up:
            break

        # ── APERTURA ──────────────────────────────────────────────────────
        if section == 'apertura':
            if 'canción' in col1_low and 'oración' in col1_low and 'Presidente' in str(row[2] or ''):
                result.append({'parte_id': 'presidente', 'tema': None, 'sala': None})

        # ── TESOROS ───────────────────────────────────────────────────────
        elif section == 'tesoros':
            if 'busquemos perlas' in col1_low:
                result.append({'parte_id': 'busqueda_tesoros', 'tema': None, 'sala': None})

            elif 'lectura de la biblia' in col1_low:
                tema = tema_lectura(col1)
                result.append({'parte_id': 'lectura_biblia', 'tema': tema, 'sala': 'principal'})
                if row[5]:  # columna sala B
                    result.append({'parte_id': 'lectura_biblia', 'tema': tema, 'sala': 'B'})

            elif re.match(r'^\d+\.', col1) or re.match(r'^\d+\.', col0):
                result.append({'parte_id': 'discurso_tesoros', 'tema': tema_general(col1), 'sala': None})

        # ── SMT ───────────────────────────────────────────────────────────
        elif section == 'smt':
            if 'canción' in col1_low:
                continue
            smt_count += 1
            parte_id = f'smt_parte{min(smt_count, 4)}'
            tema = tema_general(col1)
            result.append({'parte_id': parte_id, 'tema': tema, 'sala': 'principal'})
            if row[5]:  # sala B
                result.append({'parte_id': parte_id, 'tema': tema, 'sala': 'B'})

        # ── NVC ───────────────────────────────────────────────────────────
        elif section == 'nvc':
            # Canción sola sin número → skip
            if 'canción' in col1_low and not re.match(r'^\d+\.', col1):
                continue

            if 'estudio bíblico de la congregación' in col1_low:
                result.append({'parte_id': 'estudio_congregacion', 'tema': tema_estudio(col1), 'sala': None})
                result.append({'parte_id': 'lector_estudio', 'tema': None, 'sala': None})

            elif 'palabras de conclusión' in col1_low or 'palabras de conclusion' in col1_low:
                result.append({'parte_id': 'cierre', 'tema': None, 'sala': None})

            elif 'canción' in col1_low and 'oración' in col1_low and str(row[2] or '').lower().startswith('oración'):
                result.append({'parte_id': 'oracion_final', 'tema': None, 'sala': None})

            elif col1:
                nvc_count += 1
                if nvc_count <= 2:
                    result.append({'parte_id': f'nvc_parte{nvc_count}', 'tema': tema_general(col1), 'sala': None})

    # Adjuntar semana
    for r in result:
        r['semana'] = week_date
    return result


# ── Generación SQL ────────────────────────────────────────────────────────────

def _sql_str(val: str | None) -> str:
    if val is None:
        return 'NULL'
    escaped = val.replace("'", "''")
    return f"'{escaped}'"

def to_sql(weeks_data: list[tuple[date, list[dict]]]) -> str:
    lines = [
        "-- ================================================================",
        "-- Import: PROGRAMA_MAYO_JUNIO.xlsx → asignaciones_semana",
        "-- Sin asignado_id (pendientes de asignación desde la UI)",
        "-- ================================================================",
        "",
        "BEGIN;",
        "",
    ]

    # DELETE previo para las semanas que vamos a importar
    semanas = sorted({a['semana'].isoformat() for _, asigs in weeks_data for a in asigs})
    if semanas:
        semanas_list = ', '.join(f"'{s}'" for s in semanas)
        lines += [
            f"DELETE FROM asignaciones_semana",
            f"  WHERE congregacion_id = '{CONGREGACION_ID}'",
            f"  AND semana IN ({semanas_list});",
            "",
        ]

    for week_date, asigs in weeks_data:
        lines.append(f"-- Semana {week_date.isoformat()} ({len(asigs)} partes)")
        for a in asigs:
            semana    = _sql_str(a['semana'].isoformat())
            parte_id  = _sql_str(a['parte_id'])
            tema      = _sql_str(a['tema'])
            sala      = _sql_str(a['sala'])
            cong      = _sql_str(CONGREGACION_ID)
            lines.append(
                f"INSERT INTO asignaciones_semana (semana, parte_id, tema, sala, congregacion_id)"
                f" VALUES ({semana}, {parte_id}, {tema}, {sala}, {cong});"
            )
        lines.append("")

    lines += ["COMMIT;", ""]
    return '\n'.join(lines)


# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    filepath = sys.argv[1] if len(sys.argv) > 1 else 'PROGRAMA_MAYO_JUNIO.xlsx'

    weeks = parse_weeks(filepath)
    weeks_data = []

    for week_date, rows in weeks:
        if week_date in SKIP_WEEKS:
            print(f'[SKIP] Semana circuito: {week_date}', file=sys.stderr)
            continue
        asigs = classify_rows(week_date, rows)
        print(f'[OK]   {week_date}: {len(asigs)} filas', file=sys.stderr)
        weeks_data.append((week_date, asigs))

    print(to_sql(weeks_data))
