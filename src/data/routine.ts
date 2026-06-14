import type { Day, Exercise } from '../types'

/**
 * Rutina personalizada de Fede — 5 días (Lun a Vie).
 * Cada ejercicio tiene su mejor video de técnica en YouTube.
 */
export const ROUTINE: Day[] = [
  {
    id: 'lunes',
    nombreCorto: 'Lun',
    nombre: 'Lunes',
    tipo: 'FUERZA',
    foco: 'Tren superior',
    ejercicios: [
      { id: 'press-banca', nombre: 'Press de banca', series: 4, reps: 6, repsLabel: '6', pesoBase: 50, youtube: 'https://www.youtube.com/watch?v=rT7DgCr-3pg' },
      { id: 'press-militar', nombre: 'Press militar', series: 4, reps: 6, repsLabel: '6', pesoBase: 35, youtube: 'https://www.youtube.com/watch?v=2yjwXTZQDDI' },
      { id: 'dominadas', nombre: 'Dominadas', series: 4, reps: 8, repsLabel: '8', pesoBase: 0, pesoCorporal: true, youtube: 'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
      { id: 'remo-barra', nombre: 'Remo con barra', series: 4, reps: 6, repsLabel: '6', pesoBase: 45, youtube: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ' },
    ],
  },
  {
    id: 'martes',
    nombreCorto: 'Mar',
    nombre: 'Martes',
    tipo: 'HIPERTROFIA',
    foco: 'Pecho y tríceps',
    ejercicios: [
      { id: 'press-inclinado', nombre: 'Press inclinado mancuernas', series: 4, reps: 10, repsLabel: '10', pesoBase: 22, youtube: 'https://www.youtube.com/watch?v=8iPEnn-ltC8' },
      { id: 'aperturas', nombre: 'Aperturas', series: 3, reps: 12, repsLabel: '12', pesoBase: 12, youtube: 'https://www.youtube.com/watch?v=eozdVDA78K0' },
      { id: 'fondos', nombre: 'Fondos en paralelas', series: 3, reps: 10, repsLabel: '10', pesoBase: 0, pesoCorporal: true, youtube: 'https://www.youtube.com/watch?v=2z8JmcrW-As' },
      { id: 'extension-triceps', nombre: 'Extensiones de tríceps', series: 3, reps: 12, repsLabel: '12', pesoBase: 25, youtube: 'https://www.youtube.com/watch?v=nRiJVZDpdL0' },
    ],
  },
  {
    id: 'miercoles',
    nombreCorto: 'Mié',
    nombre: 'Miércoles',
    tipo: 'HIPERTROFIA',
    foco: 'Espalda y bíceps',
    ejercicios: [
      { id: 'jalon-pecho', nombre: 'Jalón al pecho', series: 4, reps: 10, repsLabel: '10', pesoBase: 50, youtube: 'https://www.youtube.com/watch?v=CAwf7n6Luuc' },
      { id: 'remo-polea', nombre: 'Remo en polea', series: 4, reps: 12, repsLabel: '12', pesoBase: 45, youtube: 'https://www.youtube.com/watch?v=UCXxvVItLoM' },
      { id: 'curl-barra', nombre: 'Curl con barra', series: 3, reps: 10, repsLabel: '10', pesoBase: 25, youtube: 'https://www.youtube.com/watch?v=kwG2ipFRgfo' },
      { id: 'curl-martillo', nombre: 'Curl martillo', series: 3, reps: 12, repsLabel: '12', pesoBase: 14, youtube: 'https://www.youtube.com/watch?v=zC3nLlEvin4' },
    ],
  },
  {
    id: 'jueves',
    nombreCorto: 'Jue',
    nombre: 'Jueves',
    tipo: 'FUERZA',
    foco: 'Tren inferior',
    ejercicios: [
      { id: 'sentadilla', nombre: 'Sentadilla', series: 4, reps: 6, repsLabel: '6', pesoBase: 60, youtube: 'https://www.youtube.com/watch?v=ultWZbUMPL8' },
      { id: 'peso-muerto', nombre: 'Peso muerto', series: 4, reps: 5, repsLabel: '5', pesoBase: 70, youtube: 'https://www.youtube.com/watch?v=op9kVnSso6Q' },
      { id: 'prensa', nombre: 'Prensa de piernas', series: 4, reps: 10, repsLabel: '10', pesoBase: 120, youtube: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ' },
      { id: 'gemelos', nombre: 'Gemelos de pie', series: 4, reps: 15, repsLabel: '15', pesoBase: 80, youtube: 'https://www.youtube.com/watch?v=gwLzBJYoWlI' },
    ],
  },
  {
    id: 'viernes',
    nombreCorto: 'Vie',
    nombre: 'Viernes',
    tipo: 'HIPERTROFIA',
    foco: 'Hombros y core',
    ejercicios: [
      { id: 'press-arnold', nombre: 'Press Arnold', series: 4, reps: 10, repsLabel: '10', pesoBase: 18, youtube: 'https://www.youtube.com/watch?v=6Z15_WdXmVw' },
      { id: 'elevaciones-laterales', nombre: 'Elevaciones laterales', series: 4, reps: 15, repsLabel: '15', pesoBase: 10, youtube: 'https://www.youtube.com/watch?v=3VcKaXpzqRo' },
      { id: 'face-pull', nombre: 'Face pull', series: 3, reps: 15, repsLabel: '15', pesoBase: 25, youtube: 'https://www.youtube.com/watch?v=rep-qVOkqgk' },
      { id: 'plancha', nombre: 'Plancha', series: 3, reps: 60, repsLabel: '60s', pesoBase: 0, pesoCorporal: true, youtube: 'https://www.youtube.com/watch?v=B296mZDhrP4' },
      { id: 'abdominales', nombre: 'Abdominales', series: 3, reps: 20, repsLabel: '20', pesoBase: 0, pesoCorporal: true, youtube: 'https://www.youtube.com/watch?v=1919eTCoESo' },
    ],
  },
]

export const ALL_EXERCISES: Exercise[] = ROUTINE.flatMap((d) => d.ejercicios)

export function getExercise(id: string): Exercise | undefined {
  return ALL_EXERCISES.find((e) => e.id === id)
}

export function getDay(id: string): Day | undefined {
  return ROUTINE.find((d) => d.id === id)
}

/** Día de la rutina que corresponde al día de la semana actual (Lun-Vie). */
export function todayDayId(): Day['id'] {
  const map: Record<number, Day['id']> = {
    1: 'lunes',
    2: 'martes',
    3: 'miercoles',
    4: 'jueves',
    5: 'viernes',
  }
  return map[new Date().getDay()] ?? 'lunes'
}
