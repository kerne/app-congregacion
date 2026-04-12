import { useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import type { CargoCongregacion, PublicadorPublico } from '@/core/supabase/types'

interface PublicadorSelectorProps {
  publicadores: PublicadorPublico[]
  value: string
  onChange: (id: string) => void
  placeholder?: string
  disabled?: boolean
  cargosFiltro?: CargoCongregacion[]
}

export function PublicadorSelector({
  publicadores,
  value,
  onChange,
  placeholder = 'Seleccionar publicador...',
  disabled,
  cargosFiltro,
}: PublicadorSelectorProps) {
  const items = useMemo(() => {
    const filtrados = cargosFiltro && cargosFiltro.length > 0
      ? publicadores.filter((p) => p.cargo !== null && cargosFiltro.includes(p.cargo as CargoCongregacion))
      : publicadores
    return filtrados.map((p) => ({ id: p.id, label: `${p.nombre} ${p.apellido}` }))
  }, [publicadores, cargosFiltro])

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
