import type { WeeklyLog } from '../types'
import { generateMockLogs } from '../data/mock'

const KEY = 'gym.logs.v2'

function read(): WeeklyLog[] | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as WeeklyLog[]
  } catch {
    return null
  }
}

/** Carga los logs guardados. Arranca vacío: Fede registra sus pesos reales. */
export function loadLogs(): WeeklyLog[] {
  return read() ?? []
}

export function saveLogs(logs: WeeklyLog[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(logs))
  } catch {
    /* noop */
  }
}

export function clearLogs(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}

/** Carga datos de ejemplo (4 semanas) para ver los gráficos poblados. */
export function resetToMock(): WeeklyLog[] {
  const mock = generateMockLogs()
  saveLogs(mock)
  return mock
}
