import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { DayId, WeeklyLog } from './types'
import { ALL_EXERCISES, getExercise, ROUTINE } from './data/routine'
import { loadLogs, saveLogs, resetToMock } from './lib/storage'

interface EntryView {
  peso: number
  completado: boolean
  fecha: string
  /** true si el peso proviene de un registro guardado para esa semana */
  registrado: boolean
}

interface GymContextValue {
  logs: WeeklyLog[]
  /** Devuelve el registro (con peso sugerido si no existe) */
  getEntry: (semana: number, dia: DayId, ejercicio: string) => EntryView
  setPeso: (semana: number, dia: DayId, ejercicio: string, peso: number) => void
  setCompletado: (
    semana: number,
    dia: DayId,
    ejercicio: string,
    completado: boolean
  ) => void
  /** Marca toda la jornada (día/semana) como completada y sella la fecha de hoy */
  guardarDia: (semana: number, dia: DayId) => void
  isDiaCompleto: (semana: number, dia: DayId) => boolean
  resetMock: () => void
}

const GymContext = createContext<GymContextValue | null>(null)

function keyOf(semana: number, dia: DayId, ejercicio: string) {
  return `${semana}|${dia}|${ejercicio}`
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<WeeklyLog[]>([])

  useEffect(() => {
    setLogs(loadLogs())
  }, [])

  // Índice rápido por clave
  const index = useMemo(() => {
    const m = new Map<string, WeeklyLog>()
    for (const l of logs) m.set(keyOf(l.semana, l.dia, l.ejercicio), l)
    return m
  }, [logs])

  const persist = useCallback((next: WeeklyLog[]) => {
    setLogs(next)
    saveLogs(next)
  }, [])

  /** Peso sugerido: último peso registrado en semanas anteriores, o el base. */
  const pesoSugerido = useCallback(
    (semana: number, ejercicio: string): number => {
      const ex = getExercise(ejercicio)
      if (ex?.pesoCorporal) return 0
      for (let w = semana - 1; w >= 1; w--) {
        for (const day of ROUTINE) {
          const found = index.get(keyOf(w, day.id, ejercicio))
          if (found) return found.peso
        }
      }
      return ex?.pesoBase ?? 0
    },
    [index]
  )

  const getEntry = useCallback(
    (semana: number, dia: DayId, ejercicio: string): EntryView => {
      const found = index.get(keyOf(semana, dia, ejercicio))
      if (found) {
        return {
          peso: found.peso,
          completado: found.completado,
          fecha: found.fecha,
          registrado: true,
        }
      }
      return {
        peso: pesoSugerido(semana, ejercicio),
        completado: false,
        fecha: '',
        registrado: false,
      }
    },
    [index, pesoSugerido]
  )

  const upsert = useCallback(
    (
      semana: number,
      dia: DayId,
      ejercicio: string,
      patch: Partial<WeeklyLog>
    ) => {
      const k = keyOf(semana, dia, ejercicio)
      const existing = index.get(k)
      const base: WeeklyLog = existing ?? {
        semana,
        dia,
        ejercicio,
        peso: pesoSugerido(semana, ejercicio),
        completado: false,
        fecha: new Date().toISOString(),
      }
      const updated: WeeklyLog = { ...base, ...patch }
      const next = existing
        ? logs.map((l) => (l === existing ? updated : l))
        : [...logs, updated]
      persist(next)
    },
    [index, logs, persist, pesoSugerido]
  )

  const setPeso = useCallback(
    (semana: number, dia: DayId, ejercicio: string, peso: number) => {
      upsert(semana, dia, ejercicio, { peso: Math.max(0, peso) })
    },
    [upsert]
  )

  const setCompletado = useCallback(
    (semana: number, dia: DayId, ejercicio: string, completado: boolean) => {
      upsert(semana, dia, ejercicio, {
        completado,
        fecha: new Date().toISOString(),
      })
    },
    [upsert]
  )

  const guardarDia = useCallback(
    (semana: number, dia: DayId) => {
      const day = ROUTINE.find((d) => d.id === dia)
      if (!day) return
      const fecha = new Date().toISOString()
      const next = [...logs]
      for (const ex of day.ejercicios) {
        const idx = next.findIndex(
          (l) => l.semana === semana && l.dia === dia && l.ejercicio === ex.id
        )
        if (idx >= 0) {
          next[idx] = { ...next[idx], completado: true, fecha }
        } else {
          next.push({
            semana,
            dia,
            ejercicio: ex.id,
            peso: pesoSugerido(semana, ex.id),
            completado: true,
            fecha,
          })
        }
      }
      persist(next)
    },
    [logs, persist, pesoSugerido]
  )

  const isDiaCompleto = useCallback(
    (semana: number, dia: DayId): boolean => {
      const day = ROUTINE.find((d) => d.id === dia)
      if (!day) return false
      return day.ejercicios.every(
        (ex) => index.get(keyOf(semana, dia, ex.id))?.completado
      )
    },
    [index]
  )

  const resetMock = useCallback(() => {
    persist(resetToMock())
  }, [persist])

  const value: GymContextValue = {
    logs,
    getEntry,
    setPeso,
    setCompletado,
    guardarDia,
    isDiaCompleto,
    resetMock,
  }

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>
}

export function useGym() {
  const ctx = useContext(GymContext)
  if (!ctx) throw new Error('useGym debe usarse dentro de <AppProvider>')
  return ctx
}

export { ALL_EXERCISES }
