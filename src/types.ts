export const TOTAL_WEEKS = 12
export const MOCK_WEEKS = 4

/** Fecha de inicio del plan (semana 1 arranca este día). */
export const START_DATE = '2026-06-15'

export type DayId = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes'

export type TrainingType = 'FUERZA' | 'HIPERTROFIA'

export interface Exercise {
  id: string
  nombre: string
  /** Grupo muscular (ej "ESPALDA", "PECHO SUPERIOR") */
  grupo: string
  /** true si el grupo está marcado como prioridad (⭐ en la planilla) */
  destacado?: boolean
  series: number
  /** Reps representativas (numéricas) para el cálculo de volumen */
  reps: number
  /** Etiqueta para mostrar las reps (ej "6-8", "3 @ 65-70%", "15/12/10/10/8") */
  repsLabel: string
  /** Nota / técnica del ejercicio */
  nota?: string
  /** Peso base sugerido (kg) para la semana 1 */
  pesoBase: number
  /** true para ejercicios de peso corporal / isométricos (no suman volumen por carga) */
  pesoCorporal?: boolean
  /** Unidad del registro: 'kg' (default) o 'reps' (cantidad de repeticiones) */
  unidad?: 'kg' | 'reps'
  /** Incremento de los botones +/- (default 2.5) */
  step?: number
}

export interface Day {
  id: DayId
  nombreCorto: string
  nombre: string
  /** Título grande del día (ej "Upper Power") */
  titulo: string
  tipo: TrainingType
  foco: string
  ejercicios: Exercise[]
}

/** Registro persistido por (semana, día, ejercicio) — un peso por serie */
export interface WeeklyLog {
  semana: number // 1 a 12
  dia: DayId
  ejercicio: string // id del ejercicio
  pesos: number[] // kg por serie
  completado: boolean
  fecha: string // ISO date
}
