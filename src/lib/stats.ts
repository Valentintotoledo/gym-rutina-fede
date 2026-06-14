import type { DayId, WeeklyLog } from '@/types'
import { TOTAL_WEEKS } from '@/types'
import { ALL_EXERCISES, getDay, getExercise, ROUTINE } from '@/data/routine'

const keyOf = (s: number, d: DayId, e: string) => `${s}|${d}|${e}`

function buildIndex(logs: WeeklyLog[]) {
  const m = new Map<string, WeeklyLog>()
  for (const l of logs) m.set(keyOf(l.semana, l.dia, l.ejercicio), l)
  return m
}

/** Volumen de una entrada = series × reps × kg (0 si es peso corporal sin lastre) */
function volumenEntrada(log: WeeklyLog): number {
  const ex = getExercise(log.ejercicio)
  if (!ex) return 0
  return ex.series * ex.reps * log.peso
}

export interface Kpis {
  diasEntrenados: number
  semanasCompletadas: number
  mejorProgreso: { nombre: string; delta: number } | null
  volumenTotal: number
}

export function computeKpis(logs: WeeklyLog[]): Kpis {
  const index = buildIndex(logs)

  // Días entrenados = días con todos sus ejercicios completados
  let diasEntrenados = 0
  let semanasCompletadas = 0
  for (let s = 1; s <= TOTAL_WEEKS; s++) {
    let diasOkEnSemana = 0
    for (const day of ROUTINE) {
      const completo = day.ejercicios.every(
        (ex) => index.get(keyOf(s, day.id, ex.id))?.completado
      )
      if (completo) {
        diasEntrenados++
        diasOkEnSemana++
      }
    }
    if (diasOkEnSemana === ROUTINE.length) semanasCompletadas++
  }

  // Volumen total (sólo entradas completadas)
  let volumenTotal = 0
  for (const l of logs) if (l.completado) volumenTotal += volumenEntrada(l)

  // Ejercicio con mayor progreso (kg) entre primer y último registro
  let mejorProgreso: Kpis['mejorProgreso'] = null
  for (const ex of ALL_EXERCISES) {
    if (ex.pesoCorporal) continue
    let primero: number | null = null
    let ultimo: number | null = null
    for (let s = 1; s <= TOTAL_WEEKS; s++) {
      const day = ROUTINE.find((d) => d.ejercicios.some((e) => e.id === ex.id))!
      const found = index.get(keyOf(s, day.id, ex.id))
      if (found) {
        if (primero === null) primero = found.peso
        ultimo = found.peso
      }
    }
    if (primero !== null && ultimo !== null) {
      const delta = ultimo - primero
      if (!mejorProgreso || delta > mejorProgreso.delta) {
        mejorProgreso = { nombre: ex.nombre, delta }
      }
    }
  }

  return { diasEntrenados, semanasCompletadas, mejorProgreso, volumenTotal }
}

/** Serie de volumen total por semana (para el BarChart). */
export function volumenPorSemana(
  logs: WeeklyLog[]
): { semana: string; volumen: number }[] {
  const porSemana = new Array(TOTAL_WEEKS + 1).fill(0)
  for (const l of logs) {
    if (l.completado) porSemana[l.semana] += volumenEntrada(l)
  }
  const out: { semana: string; volumen: number }[] = []
  for (let s = 1; s <= TOTAL_WEEKS; s++) {
    if (porSemana[s] > 0) out.push({ semana: `S${s}`, volumen: porSemana[s] })
  }
  return out
}

/** Evolución de peso de un ejercicio por semana (para el LineChart). */
export function progresionEjercicio(
  logs: WeeklyLog[],
  ejercicioId: string
): { semana: string; peso: number | null }[] {
  const index = buildIndex(logs)
  const day = getDay(
    ROUTINE.find((d) => d.ejercicios.some((e) => e.id === ejercicioId))?.id ??
      'lunes'
  )
  const out: { semana: string; peso: number | null }[] = []
  for (let s = 1; s <= TOTAL_WEEKS; s++) {
    const found = day && index.get(keyOf(s, day.id, ejercicioId))
    out.push({ semana: `S${s}`, peso: found ? found.peso : null })
  }
  return out
}

/** Distribución de días completados por tipo de entrenamiento (PieChart). */
export function distribucionPorTipo(
  logs: WeeklyLog[]
): { name: string; value: number; color: string }[] {
  const index = buildIndex(logs)
  let fuerza = 0
  let hipertrofia = 0
  for (let s = 1; s <= TOTAL_WEEKS; s++) {
    for (const day of ROUTINE) {
      const completo = day.ejercicios.every(
        (ex) => index.get(keyOf(s, day.id, ex.id))?.completado
      )
      if (!completo) continue
      if (day.tipo === 'FUERZA') fuerza++
      else hipertrofia++
    }
  }
  return [
    { name: 'Fuerza', value: fuerza, color: '#4F46E5' },
    { name: 'Hipertrofia', value: hipertrofia, color: '#F97316' },
  ]
}

/** Matriz semana × ejercicio con pesos registrados (tabla de historial). */
export function historialMatriz(logs: WeeklyLog[]) {
  const index = buildIndex(logs)
  const semanasConDatos: number[] = []
  for (let s = 1; s <= TOTAL_WEEKS; s++) {
    const hay = logs.some((l) => l.semana === s)
    if (hay) semanasConDatos.push(s)
  }
  const filas = ROUTINE.map((day) => ({
    day,
    ejercicios: day.ejercicios.map((ex) => ({
      ex,
      pesos: semanasConDatos.map((s) => {
        const f = index.get(keyOf(s, day.id, ex.id))
        return f ? f.peso : null
      }),
    })),
  }))
  return { semanas: semanasConDatos, filas }
}
