/**
 * Datos del proyecto Supabase (Settings → API en supabase.com).
 *
 * Mientras estén vacíos, la app funciona SOLO en este dispositivo
 * (guardado local, sin sincronizar). Apenas se completan los dos valores,
 * la rutina y las comidas se sincronizan entre el celular y la computadora.
 *
 * Se pueden definir como variables de entorno en Render
 * (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) o pegarse directo acá abajo.
 */
const ENV_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? ''
const ENV_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? ''

// ↓ Pegá acá la URL y la "anon public key" si no usás variables de entorno.
const INLINE_URL = ''
const INLINE_KEY = ''

export const SUPABASE_URL = ENV_URL || INLINE_URL
export const SUPABASE_ANON_KEY = ENV_KEY || INLINE_KEY
