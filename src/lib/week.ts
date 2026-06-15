import { START_DATE, TOTAL_WEEKS } from '@/types'

const MS_DIA = 24 * 60 * 60 * 1000

function startMidnight(): number {
  const d = new Date(START_DATE + 'T00:00:00')
  return d.getTime()
}

/** Semana actual del plan (1..TOTAL_WEEKS) según la fecha de inicio. */
export function currentWeek(now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const diffDias = Math.floor((today - startMidnight()) / MS_DIA)
  const semana = Math.floor(diffDias / 7) + 1
  return Math.min(TOTAL_WEEKS, Math.max(1, semana))
}

/** Fecha (Date) en que cae un día de entrenamiento de una semana dada. */
export function fechaDeDia(semana: number, diaIndex: number): Date {
  // diaIndex 0 = lunes ... 4 = viernes
  const base = startMidnight() + (semana - 1) * 7 * MS_DIA + diaIndex * MS_DIA
  return new Date(base)
}
