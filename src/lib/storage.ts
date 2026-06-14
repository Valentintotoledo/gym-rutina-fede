import type { WeeklyLog } from '../types'
import { generateMockLogs } from '../data/mock'

const KEY = 'gym.logs.v1'
const SEEDED_KEY = 'gym.seeded.v1'

function read(): WeeklyLog[] | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as WeeklyLog[]
  } catch {
    return null
  }
}

/**
 * Carga los logs. Si es el primer ingreso (sin datos), siembra 4 semanas mock
 * para que los gráficos se vean poblados.
 */
export function loadLogs(): WeeklyLog[] {
  const existing = read()
  if (existing && existing.length > 0) return existing

  // Solo sembramos una vez: si el usuario borró todo a propósito, respetamos.
  const alreadySeeded = (() => {
    try {
      return localStorage.getItem(SEEDED_KEY) === '1'
    } catch {
      return false
    }
  })()

  if (alreadySeeded) return existing ?? []

  const mock = generateMockLogs()
  saveLogs(mock)
  try {
    localStorage.setItem(SEEDED_KEY, '1')
  } catch {
    /* noop */
  }
  return mock
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
    localStorage.removeItem(SEEDED_KEY)
  } catch {
    /* noop */
  }
}

/** Restaura los datos mock (descarta lo cargado). */
export function resetToMock(): WeeklyLog[] {
  const mock = generateMockLogs()
  saveLogs(mock)
  try {
    localStorage.setItem(SEEDED_KEY, '1')
  } catch {
    /* noop */
  }
  return mock
}
