import type { WeeklyLog, DayId } from '../types'
import { MOCK_WEEKS } from '../types'
import { ROUTINE } from './routine'

const DAY_INDEX: Record<DayId, number> = {
  lunes: 0,
  martes: 1,
  miercoles: 2,
  jueves: 3,
  viernes: 4,
}

/**
 * Genera 4 semanas de historial coherente y progresivo (peso por serie),
 * con todos los días completados, para ver los gráficos poblados.
 */
export function generateMockLogs(): WeeklyLog[] {
  const logs: WeeklyLog[] = []
  const now = new Date()

  for (let semana = 1; semana <= MOCK_WEEKS; semana++) {
    for (const day of ROUTINE) {
      const weeksAgo = MOCK_WEEKS - semana
      const date = new Date(now)
      date.setDate(date.getDate() - weeksAgo * 7 - (4 - DAY_INDEX[day.id]))

      for (const ex of day.ejercicios) {
        const inc = ex.pesoBase >= 60 ? 5 : 2.5
        const peso = ex.pesoCorporal ? 0 : ex.pesoBase + inc * (semana - 1)
        logs.push({
          semana,
          dia: day.id,
          ejercicio: ex.id,
          pesos: new Array(ex.series).fill(peso),
          completado: true,
          fecha: date.toISOString(),
        })
      }
    }
  }

  return logs
}
