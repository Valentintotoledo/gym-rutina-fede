import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseConfig'

/**
 * Sincronización en la nube (Supabase) con un modelo clave-valor simple.
 * Tabla `gym_kv (id text pk, data jsonb, updated_at timestamptz)`.
 * Cada clave ('logs', 'comidas') es una fila con todo el estado en `data`.
 * Si no hay credenciales, todo es no-op y la app usa solo localStorage.
 */

const TABLE = 'gym_kv'
const USER = 'juan' // app de un solo usuario

let client: SupabaseClient | null | undefined

export function syncEnabled(): boolean {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY)
}

function getClient(): SupabaseClient | null {
  if (!syncEnabled()) return null
  if (client === undefined) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    })
  }
  return client
}

function rowId(key: string): string {
  return `${USER}:${key}`
}

/** Trae el estado de la nube para una clave (o null si no hay / falla). */
export async function pull<T>(key: string): Promise<T | null> {
  const c = getClient()
  if (!c) return null
  const { data, error } = await c
    .from(TABLE)
    .select('data')
    .eq('id', rowId(key))
    .maybeSingle()
  if (error) {
    console.warn('[sync] pull', key, error.message)
    return null
  }
  return (data?.data as T) ?? null
}

/** Sube (upsert) el estado completo de una clave. */
export async function push<T>(key: string, value: T): Promise<void> {
  const c = getClient()
  if (!c) return
  const { error } = await c.from(TABLE).upsert({
    id: rowId(key),
    data: value,
    updated_at: new Date().toISOString(),
  })
  if (error) console.warn('[sync] push', key, error.message)
}

/** Devuelve una función con "debounce" para subir cambios sin saturar la red. */
export function makeDebouncedPush<T>(key: string, ms = 700): (value: T) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  let pending: T
  return (value: T) => {
    pending = value
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      void push(key, pending)
    }, ms)
  }
}

/** Se suscribe a cambios en tiempo real de una clave (otro dispositivo edita). */
export function subscribe<T>(
  key: string,
  onChange: (value: T) => void
): () => void {
  const c = getClient()
  if (!c) return () => {}
  const channel = c
    .channel(`kv:${key}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLE,
        filter: `id=eq.${rowId(key)}`,
      },
      (payload) => {
        const row = payload.new as { data?: T } | undefined
        if (row && row.data !== undefined) onChange(row.data as T)
      }
    )
    .subscribe()
  return () => {
    void c.removeChannel(channel)
  }
}
