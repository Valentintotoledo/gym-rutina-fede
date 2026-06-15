const KEY = 'gym.auth.v1'
const USUARIO = 'juan.pamies1'
const CLAVE = 'todogym123'

export function isAuthed(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function login(usuario: string, clave: string): boolean {
  if (usuario.trim().toLowerCase() === USUARIO && clave === CLAVE) {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* noop */
    }
    return true
  }
  return false
}

export function logout(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}
