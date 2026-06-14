import type { WeeklyLog, DayId } from '../types'
import { MOCK_WEEKS } from '../types'
import { ROUTINE } from './routine'

/** Incremento de carga por semana según el ejercicio (kg). */
const INCREMENT: Record<string, number> = {
  // Básicos pesados → +5/sem
  'press-banca': 5,
  'remo-barra': 5,
  sentadilla: 5,
  'peso-muerto': 5,
  prensa: 10,
  'jalon-pecho': 5,
  'remo-polea': 5,
  'press-militar': 2.5,
}

const DAY_INDEX: Record<DayId, number> = {
  lunes: 0,
  martes: 1,
  miercoles: 2,
  jueves: 3,
  viernes: 4,
}

/**
 * Genera 4 semanas de historial coherente y progresivo, con todos los días
 * completados, para que los gráficos se vean poblados desde el primer ingreso.
 */
export function generateMockLogs(): WeeklyLog[] {
  const logs: WeeklyLog[] = []
  const now = new Date()

  for (let semana = 1; semana <= MOCK_WEEKS; semana++) {
    for (const day of ROUTINE) {
      // Fecha aproximada: semanas hacia atrás desde hoy + offset del día
      const weeksAgo = MOCK_WEEKS - semana
      const date = new Date(now)
      date.setDate(date.getDate() - weeksAgo * 7 - (4 - DAY_INDEX[day.id]))

      for (const ex of day.ejercicios) {
        const inc = INCREMENT[ex.id] ?? 2.5
        const peso = ex.pesoCorporal ? 0 : ex.pesoBase + inc * (semana - 1)
        logs.push({
          semana,
          dia: day.id,
          ejercicio: ex.id,
          peso,
          completado: true,
          fecha: date.toISOString(),
        })
      }
    }
  }

  return logs
}
