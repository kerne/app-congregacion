import { useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import type { PublicadorPublico } from '@/core/supabase/types'

interface PublicadorSelectorProps {
  publicadores: PublicadorPublico[]
  value: string
  onChange: (id: string) => void
  placeholder?: string
  disabled?: boolean
}

export function PublicadorSelector({
  publicadores,
  value,
  onChange,
  placeholder = 'Seleccionar publicador...',
  disabled,
}: PublicadorSelectorProps) {
  const items = useMemo(
    () => publicadores.map((p) => ({ id: p.id, label: `${p.nombre} ${p.apellido}` })),
    [publicadores],
  )

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
