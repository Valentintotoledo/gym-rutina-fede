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
  pesos: number[]
  reps: number[]
  completado: boolean
  fecha: string
  /** true si el peso proviene de un registro guardado para esa semana */
  registrado: boolean
}

interface GymContextValue {
  logs: WeeklyLog[]
  /** Devuelve el registro (con pesos sugeridos si no existe) */
  getEntry: (semana: number, dia: DayId, ejercicio: string) => EntryView
  /** Cambia el peso de una serie puntual */
  setPesoSerie: (
    semana: number,
    dia: DayId,
    ejercicio: string,
    serie: number,
    peso: number
  ) => void
  /** Cambia las repeticiones hechas en una serie puntual */
  setRepSerie: (
    semana: number,
    dia: DayId,
    ejercicio: string,
    serie: number,
    reps: number
  ) => void
  setCompletado: (
    semana: number,
    dia: DayId,
    ejercicio: string,
    completado: boolean
  ) => void
  /** Marca toda la jornada (día/semana) como completada y sella la fecha indicada (o hoy) */
  guardarDia: (semana: number, dia: DayId, fecha?: string) => void
  isDiaCompleto: (semana: number, dia: DayId) => boolean
  resetMock: () => void
}

const GymContext = createContext<GymContextValue | null>(null)

function keyOf(semana: number, dia: DayId, ejercicio: string) {
  return `${semana}|${dia}|${ejercicio}`
}

/** Ajusta un array de pesos al número de series del ejercicio (rellena/recorta). */
function normalizePesos(pesos: number[] | undefined, series: number, fill: number): number[] {
  const out = new Array(series).fill(fill)
  if (pesos) for (let i = 0; i < series && i < pesos.length; i++) out[i] = pesos[i]
  return out
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

  /** Peso sugerido por serie: máximo registrado en semanas anteriores, o el base. */
  const pesoSugerido = useCallback(
    (semana: number, ejercicio: string): number => {
      const ex = getExercise(ejercicio)
      if (ex?.pesoCorporal) return 0
      for (let w = semana - 1; w >= 1; w--) {
        for (const day of ROUTINE) {
          const found = index.get(keyOf(w, day.id, ejercicio))
          if (found && found.pesos.length) return Math.max(...found.pesos)
        }
      }
      return ex?.pesoBase ?? 0
    },
    [index]
  )

  const getEntry = useCallback(
    (semana: number, dia: DayId, ejercicio: string): EntryView => {
      const ex = getExercise(ejercicio)
      const series = ex?.series ?? 1
      const found = index.get(keyOf(semana, dia, ejercicio))
      if (found) {
        return {
          pesos: normalizePesos(found.pesos, series, pesoSugerido(semana, ejercicio)),
          reps: normalizePesos(found.reps, series, 0),
          completado: found.completado,
          fecha: found.fecha,
          registrado: true,
        }
      }
      return {
        pesos: normalizePesos(undefined, series, pesoSugerido(semana, ejercicio)),
        reps: normalizePesos(undefined, series, 0),
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
      const ex = getExercise(ejercicio)
      const series = ex?.series ?? 1
      const k = keyOf(semana, dia, ejercicio)
      const existing = index.get(k)
      const base: WeeklyLog = existing ?? {
        semana,
        dia,
        ejercicio,
        pesos: normalizePesos(undefined, series, pesoSugerido(semana, ejercicio)),
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

  const setPesoSerie = useCallback(
    (
      semana: number,
      dia: DayId,
      ejercicio: string,
      serie: number,
      peso: number
    ) => {
      const ex = getExercise(ejercicio)
      const series = ex?.series ?? 1
      const actual = getEntry(semana, dia, ejercicio).pesos
      const pesos = normalizePesos(actual, series, 0)
      if (serie >= 0 && serie < pesos.length) pesos[serie] = Math.max(0, peso)
      upsert(semana, dia, ejercicio, { pesos })
    },
    [getEntry, upsert]
  )

  const setRepSerie = useCallback(
    (
      semana: number,
      dia: DayId,
      ejercicio: string,
      serie: number,
      reps: number
    ) => {
      const ex = getExercise(ejercicio)
      const series = ex?.series ?? 1
      const actual = getEntry(semana, dia, ejercicio).reps
      const next = normalizePesos(actual, series, 0)
      if (serie >= 0 && serie < next.length) next[serie] = Math.max(0, Math.round(reps))
      upsert(semana, dia, ejercicio, { reps: next })
    },
    [getEntry, upsert]
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
    (semana: number, dia: DayId, fechaISO?: string) => {
      const day = ROUTINE.find((d) => d.id === dia)
      if (!day) return
      const fecha = fechaISO ?? new Date().toISOString()
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
            pesos: normalizePesos(undefined, ex.series, pesoSugerido(semana, ex.id)),
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
    setPesoSerie,
    setRepSerie,
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
