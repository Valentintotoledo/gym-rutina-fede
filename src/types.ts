export const TOTAL_WEEKS = 12
export const MOCK_WEEKS = 4

export type DayId = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes'

export type TrainingType = 'FUERZA' | 'HIPERTROFIA'

export interface Exercise {
  id: string
  nombre: string
  series: number
  reps: number
  /** Etiqueta para mostrar las reps (ej "6", "12", "60s") */
  repsLabel: string
  /** Peso base sugerido (kg) para la semana 1 */
  pesoBase: number
  /** true para ejercicios de peso corporal / isométricos (no suman volumen por carga) */
  pesoCorporal?: boolean
  youtube: string
}

export interface Day {
  id: DayId
  nombreCorto: string
  nombre: string
  tipo: TrainingType
  foco: string
  ejercicios: Exercise[]
}

/** Registro persistido por (semana, día, ejercicio) */
export interface WeeklyLog {
  semana: number // 1 a 12
  dia: DayId
  ejercicio: string // id del ejercicio
  peso: number // kg
  completado: boolean
  fecha: string // ISO date
}
