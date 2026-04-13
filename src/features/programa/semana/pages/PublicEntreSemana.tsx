import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { NavSemana } from '@/shared/components/NavSemana'
import { TableSkeleton } from '@/shared/components/TableSkeleton'
import { ProgramaSemanaView } from '../components/ProgramaSemanaView'
import { useQuery } from '@tanstack/react-query'
import { getAsignacionesSemana } from '../api'
import {
  getLunesDeSemana,
  siguienteSemana,
  semanaAnterior,
  toISODate,
  formatRangoSemana,
  parseFecha,
} from '@/shared/utils/fechas'

export function PublicEntreSemana() {
  const { congregacionId } = useOutletContext<{ congregacionId: string }>()
  const [semana, setSemana] = useState(() => toISODate(getLunesDeSemana(new Date())))

  const { data: asignaciones = [], isLoading } = useQuery({
    queryKey: ['public', 'asignaciones-semana', congregacionId, semana],
    queryFn: () => getAsignacionesSemana(congregacionId, semana),
    enabled: !!congregacionId,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Reunión Entre Semana</h1>
          <p className="text-sm text-muted-foreground capitalize">
            {formatRangoSemana(parseFecha(semana))}
          </p>
        </div>
        <NavSemana
          label={formatRangoSemana(parseFecha(semana))}
          onPrev={() => setSemana(toISODate(semanaAnterior(parseFecha(semana))))}
          onNext={() => setSemana(toISODate(siguienteSemana(parseFecha(semana))))}
          onHoy={() => setSemana(toISODate(getLunesDeSemana(new Date())))}
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} cols={3} />
      ) : (
        <ProgramaSemanaView
          asignaciones={asignaciones}
          canEdit={false}
          onEdit={() => {}}
          emptyMessage="El programa de esta semana no está disponible aún"
        />
      )}
    </div>
  )
}
