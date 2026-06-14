import { useCallback, useEffect, useState } from 'react'
import {
  loadComidas,
  saveComidas,
  type FoodEntry,
} from '@/lib/comidas'

export function useComidas() {
  const [entries, setEntries] = useState<FoodEntry[]>([])

  useEffect(() => {
    setEntries(loadComidas())
  }, [])

  const persist = useCallback((next: FoodEntry[]) => {
    // Más recientes primero
    const sorted = [...next].sort((a, b) => b.fecha.localeCompare(a.fecha))
    setEntries(sorted)
    saveComidas(sorted)
  }, [])

  const addEntry = useCallback(
    (descripcion: string, foto?: string) => {
      const entry: FoodEntry = {
        id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
        fecha: new Date().toISOString(),
        descripcion: descripcion.trim(),
        foto,
      }
      persist([entry, ...entries])
    },
    [entries, persist]
  )

  const removeEntry = useCallback(
    (id: string) => {
      persist(entries.filter((e) => e.id !== id))
    },
    [entries, persist]
  )

  return { entries, addEntry, removeEntry }
}
