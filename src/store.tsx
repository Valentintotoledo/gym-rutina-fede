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
import { makeDebouncedPush, pull, push, subscribe } from './lib/sync'

const SYNC_KEY = 'logs'

interface EntryView {
  pesos: number[]
  reps: number[]
  completado: boolean
  saltado: boolean
  nota: string
  fecha: string
  /** true si el peso proviene de un registro guardado para esa semana */
  registrado: boolean
}

/** Pesos usados en la semana anterior (más reciente con datos) de un ejercicio. */
export interface PesosPrevios {
  semana: number
  pesos: number[]
}

interface GymContextValue {
  logs: WeeklyLog[]
  /** Devuelve el registro (con pesos sugeridos si no existe) */
  getEntry: (semana: number, dia: DayId, ejercicio: string) => EntryView
  /** Cambia el peso de una serie puntual. Si propagar=true, replica a las series siguientes. */
  setPesoSerie: (
    semana: number,
    dia: DayId,
    ejercicio: string,
    serie: number,
    peso: number,
    propagar?: boolean
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
  /** Marca / desmarca un ejercicio como "no lo hice" (saltado) */
  setSaltado: (
    semana: number,
    dia: DayId,
    ejercicio: string,
    saltado: boolean
  ) => void
  /** Guarda la nota libre de un ejercicio */
  setNota: (semana: number, dia: DayId, ejercicio: string, nota: string) => void
  /** Pesos de la semana anterior (para mostrar de referencia) */
  pesosPrevios: (semana: number, ejercicio: string) => PesosPrevios | null
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

/**
 * ¿Se hizo realmente el ejercicio? Se considera hecho cuando hay datos
 * cargados: en ejercicios de carga (kg) cuando hay reps anotadas; en los
 * que se miden por cantidad (dominadas / peso corporal) cuando hay conteo.
 */
function hizoEjercicio(
  ejercicioId: string,
  pesos: number[] | undefined,
  reps: number[] | undefined
): boolean {
  const ex = getExercise(ejercicioId)
  const porConteo = ex?.unidad === 'reps' || ex?.pesoCorporal
  if (porConteo) return (pesos ?? []).some((p) => p > 0)
  return (reps ?? []).some((r) => r > 0)
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<WeeklyLog[]>([])

  // Subida con debounce a la nube (no-op si no hay credenciales)
  const pushLogs = useMemo(() => makeDebouncedPush<WeeklyLog[]>(SYNC_KEY), [])

  useEffect(() => {
    let active = true
    const local = loadLogs()
    setLogs(local)

    // Trae lo que haya en la nube; si está vacía, sube lo local
    void pull<WeeklyLog[]>(SYNC_KEY).then((cloud) => {
      if (!active) return
      if (Array.isArray(cloud)) {
        setLogs(cloud)
        saveLogs(cloud)
      } else if (local.length) {
        void push(SYNC_KEY, local)
      }
    })

    // Se actualiza solo cuando otro dispositivo guarda
    const unsub = subscribe<WeeklyLog[]>(SYNC_KEY, (cloud) => {
      if (!active || !Array.isArray(cloud)) return
      setLogs(cloud)
      saveLogs(cloud)
    })

    return () => {
      active = false
      unsub()
    }
  }, [])

  // Índice rápido por clave
  const index = useMemo(() => {
    const m = new Map<string, WeeklyLog>()
    for (const l of logs) m.set(keyOf(l.semana, l.dia, l.ejercicio), l)
    return m
  }, [logs])

  const persist = useCallback(
    (next: WeeklyLog[]) => {
      setLogs(next)
      saveLogs(next)
      pushLogs(next)
    },
    [pushLogs]
  )

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
          saltado: !!found.saltado,
          nota: found.nota ?? '',
          fecha: found.fecha,
          registrado: true,
        }
      }
      return {
        pesos: normalizePesos(undefined, series, pesoSugerido(semana, ejercicio)),
        reps: normalizePesos(undefined, series, 0),
        completado: false,
        saltado: false,
        nota: '',
        fecha: '',
        registrado: false,
      }
    },
    [index, pesoSugerido]
  )

  /** Pesos usados en la semana anterior más reciente con datos. */
  const pesosPrevios = useCallback(
    (semana: number, ejercicio: string): PesosPrevios | null => {
      for (let w = semana - 1; w >= 1; w--) {
        for (const day of ROUTINE) {
          const found = index.get(keyOf(w, day.id, ejercicio))
          if (found && found.pesos.some((p) => p > 0)) {
            return { semana: w, pesos: found.pesos }
          }
        }
      }
      return null
    },
    [index]
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
      peso: number,
      propagar = false
    ) => {
      const ex = getExercise(ejercicio)
      const series = ex?.series ?? 1
      const entry = getEntry(semana, dia, ejercicio)
      const pesos = normalizePesos(entry.pesos, series, 0)
      const v = Math.max(0, peso)
      if (serie >= 0 && serie < pesos.length) {
        // Al escribir la serie 1 (o cualquiera), se replica a las siguientes
        const hasta = propagar ? pesos.length : serie + 1
        for (let j = serie; j < hasta; j++) pesos[j] = v
      }
      const hecho = hizoEjercicio(ejercicio, pesos, entry.reps)
      upsert(semana, dia, ejercicio, {
        pesos,
        completado: hecho,
        ...(hecho ? { saltado: false } : {}),
      })
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
      const entry = getEntry(semana, dia, ejercicio)
      const next = normalizePesos(entry.reps, series, 0)
      if (serie >= 0 && serie < next.length) next[serie] = Math.max(0, Math.round(reps))
      const hecho = hizoEjercicio(ejercicio, entry.pesos, next)
      upsert(semana, dia, ejercicio, {
        reps: next,
        completado: hecho,
        ...(hecho ? { saltado: false } : {}),
      })
    },
    [getEntry, upsert]
  )

  const setCompletado = useCallback(
    (semana: number, dia: DayId, ejercicio: string, completado: boolean) => {
      upsert(semana, dia, ejercicio, {
        completado,
        // Marcar hecho a mano quita el "no lo hice"
        ...(completado ? { saltado: false } : {}),
        fecha: new Date().toISOString(),
      })
    },
    [upsert]
  )

  const setSaltado = useCallback(
    (semana: number, dia: DayId, ejercicio: string, saltado: boolean) => {
      const entry = getEntry(semana, dia, ejercicio)
      upsert(semana, dia, ejercicio, {
        saltado,
        // "No lo hice" fuerza no-completado; al desmarcarlo, recalcula por datos
        completado: saltado
          ? false
          : hizoEjercicio(ejercicio, entry.pesos, entry.reps),
      })
    },
    [getEntry, upsert]
  )

  const setNota = useCallback(
    (semana: number, dia: DayId, ejercicio: string, nota: string) => {
      upsert(semana, dia, ejercicio, { nota })
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
        // Sólo se marca hecho el ejercicio que realmente tiene datos cargados
        if (idx >= 0) {
          const hecho = hizoEjercicio(ex.id, next[idx].pesos, next[idx].reps)
          next[idx] = { ...next[idx], completado: hecho, fecha }
        }
        // Si no hay registro, no se crea nada (no se hizo el ejercicio)
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
    setSaltado,
    setNota,
    pesosPrevios,
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
