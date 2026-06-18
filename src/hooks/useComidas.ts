import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  loadComidas,
  saveComidas,
  type FoodEntry,
} from '@/lib/comidas'
import { makeDebouncedPush, pull, push, subscribe } from '@/lib/sync'

const SYNC_KEY = 'comidas'

export function useComidas() {
  const [entries, setEntries] = useState<FoodEntry[]>([])
  const pushComidas = useMemo(() => makeDebouncedPush<FoodEntry[]>(SYNC_KEY), [])

  const sort = (arr: FoodEntry[]) =>
    [...arr].sort((a, b) => b.fecha.localeCompare(a.fecha))

  useEffect(() => {
    let active = true
    const local = sort(loadComidas())
    setEntries(local)

    void pull<FoodEntry[]>(SYNC_KEY).then((cloud) => {
      if (!active) return
      if (Array.isArray(cloud)) {
        const s = sort(cloud)
        setEntries(s)
        saveComidas(s)
      } else if (local.length) {
        void push(SYNC_KEY, local)
      }
    })

    const unsub = subscribe<FoodEntry[]>(SYNC_KEY, (cloud) => {
      if (!active || !Array.isArray(cloud)) return
      const s = sort(cloud)
      setEntries(s)
      saveComidas(s)
    })

    return () => {
      active = false
      unsub()
    }
  }, [])

  const persist = useCallback(
    (next: FoodEntry[]) => {
      const sorted = sort(next)
      setEntries(sorted)
      saveComidas(sorted)
      pushComidas(sorted)
    },
    [pushComidas]
  )

  const addEntry = useCallback(
    (
      comida: string,
      comidaLabel: string,
      descripcion: string,
      foto?: string,
      fechaISO?: string
    ) => {
      const entry: FoodEntry = {
        id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
        fecha: fechaISO ?? new Date().toISOString(),
        comida,
        comidaLabel,
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
