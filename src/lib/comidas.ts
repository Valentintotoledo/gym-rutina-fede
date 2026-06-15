export interface FoodEntry {
  id: string
  fecha: string // ISO
  /** id de la comida (almuerzo, pre-entreno, etc.) */
  comida: string
  /** etiqueta visible de la comida */
  comidaLabel: string
  descripcion: string
  foto?: string // data URL (JPEG comprimido)
}

const KEY = 'gym.comidas.v1'

export function loadComidas(): FoodEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as FoodEntry[]
  } catch {
    return []
  }
}

export function saveComidas(entries: FoodEntry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries))
  } catch {
    /* noop (cuota llena) */
  }
}

/**
 * Lee un File de imagen y devuelve un data URL JPEG redimensionado
 * (máx ~900px lado mayor, calidad 0.7) para que entre cómodo en localStorage.
 */
export function fileToCompressedDataURL(file: File, maxSide = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('No se pudo cargar la imagen'))
      img.onload = () => {
        const ratio = Math.min(1, maxSide / Math.max(img.width, img.height))
        const w = Math.round(img.width * ratio)
        const h = Math.round(img.height * ratio)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas no disponible'))
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
