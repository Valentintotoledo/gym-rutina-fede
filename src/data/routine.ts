import type { Day, Exercise } from '../types'

/**
 * Rutina de Juan — 5 días.
 * Días 1-2 → FUERZA · Días 3-5 → HIPERTROFIA.
 * Ejercicios, orden, series×reps y notas tomados de la planilla RUTINA_5DIAS_HIPER.
 */
export const ROUTINE: Day[] = [
  {
    id: 'lunes',
    nombreCorto: 'Lun',
    nombre: 'Lunes',
    titulo: 'Upper Power',
    tipo: 'FUERZA',
    foco: 'Espalda · Pecho Superior · Bíceps',
    ejercicios: [
      { id: 'lun-remo-barra-piso', nombre: 'Remo barra prono piso libre', grupo: 'ESPALDA', series: 4, reps: 4, repsLabel: '3-5', pesoBase: 60, nota: 'Explosivo. Espalda plana, tirón desde el suelo.' },
      { id: 'lun-dominadas-lastradas', nombre: 'Dominadas lastradas RIR 1', grupo: 'ESPALDA', series: 3, reps: 7, repsLabel: '6-8', pesoBase: 10, nota: 'Agarre prono. Retracción escapular total.' },
      { id: 'lun-australian-pullups', nombre: 'Australian pull ups prono (banco smith)', grupo: 'ESPALDA', series: 3, reps: 7, repsLabel: '6-8', pesoBase: 0, unidad: 'kg', step: 1, nota: 'Foco en contracción del dorsal. ROM completo.' },
      { id: 'lun-press-inclinado-barra', nombre: 'Press inclinado barra', grupo: 'PECHO SUPERIOR', series: 4, reps: 5, repsLabel: '5', pesoBase: 50, nota: '30-45°. Potencia máxima. Barra sobre clavícula.' },
      { id: 'lun-press-plano-mancuernas', nombre: 'Press plano mancuernas', grupo: 'PECHO SUPERIOR', series: 3, reps: 7, repsLabel: '6-8', pesoBase: 28, nota: 'ROM completo. Codos a 75°. Pesado.' },
      { id: 'lun-fondos-lastrados', nombre: 'Fondos lastrados', grupo: 'PECHO SUPERIOR', series: 3, reps: 7, repsLabel: '6-8', pesoBase: 10, nota: 'Torso ligeramente inclinado. Foco pecho.' },
      { id: 'lun-press-hombro-maq', nombre: 'Press hombro máquina + e. lateral', grupo: 'HOMBRO', series: 3, reps: 9, repsLabel: '8/10', pesoBase: 30, nota: 'Mantenimiento. Neutro protege articulación.' },
      { id: 'lun-curl-inclinado', nombre: 'Curl inclinado pesado', grupo: 'BÍCEPS', destacado: true, series: 4, reps: 7, repsLabel: '6-8', pesoBase: 14, nota: 'Pico bíceps. Banco 45°. Hombro extendido.' },
      { id: 'lun-press-frances', nombre: 'Press francés', grupo: 'TRÍCEPS', series: 4, reps: 7, repsLabel: '6-8', pesoBase: 25, nota: 'Mantenimiento. Control excéntrico lento.' },
    ],
  },
  {
    id: 'martes',
    nombreCorto: 'Mar',
    nombre: 'Martes',
    titulo: 'Lower Power',
    tipo: 'FUERZA',
    foco: 'Cuádriceps · Femorales · Gemelos',
    ejercicios: [
      { id: 'mar-sentadilla-libre', nombre: 'Sentadilla libre', grupo: 'CUÁDRICEPS', series: 5, reps: 4, repsLabel: '3-5', pesoBase: 80, nota: 'Fuerza base. Bar path vertical. Profundidad completa.' },
      { id: 'mar-hack-squat', nombre: 'Hack Squat', grupo: 'CUÁDRICEPS', series: 3, reps: 7, repsLabel: '6-8', pesoBase: 80, nota: 'Complemento. ROM completo. Rodillas sobre punta pies.' },
      { id: 'mar-peso-muerto-rumano', nombre: 'Peso muerto rumano', grupo: 'FEMORALES', destacado: true, series: 5, reps: 6, repsLabel: '5-8', pesoBase: 70, nota: 'Prioridad. Bisagra de cadera profunda. Pausa abajo.' },
      { id: 'mar-isquio-sentado', nombre: 'Isquio camilla sentado', grupo: 'FEMORALES', destacado: true, series: 4, reps: 9, repsLabel: '8-10', pesoBase: 35, nota: 'Prioridad. Tensión máxima en elongación.' },
      { id: 'mar-hip-thrust', nombre: 'Hip thrust', grupo: 'GLÚTEOS', series: 3, reps: 9, repsLabel: '8-10', pesoBase: 80, nota: 'Paso corto. Foco cuádriceps/glúteo. Pesada.' },
      { id: 'mar-gemelo-pendular', nombre: 'Gemelo de pie en pendular', grupo: 'GEMELOS', destacado: true, series: 5, reps: 9, repsLabel: '8-10', pesoBase: 60, nota: 'Prioridad. ROM máximo. Pausa 2s abajo.' },
      { id: 'mar-rueda-abdominal', nombre: 'Rueda abdominal', grupo: 'CORE', series: 4, reps: 12, repsLabel: '4 series', pesoBase: 0, pesoCorporal: true, nota: 'Extensión máxima controlada. Sin lumbar.' },
    ],
  },
  {
    id: 'miercoles',
    nombreCorto: 'Mié',
    nombre: 'Miércoles',
    titulo: 'Espalda Especialización',
    tipo: 'HIPERTROFIA',
    foco: '⭐ Densidad dorsal · Amplitud · Bíceps',
    ejercicios: [
      { id: 'mie-remo-barra-piso', nombre: 'Remo barra piso prono', grupo: 'EXPLOSIVO', series: 6, reps: 3, repsLabel: '3 @ 65-70%', pesoBase: 55, nota: 'Velocidad alta en concéntrico. Recuperación completa entre series.' },
      { id: 'mie-remo-banco-45', nombre: 'Remo banco 45', grupo: 'DENSIDAD', destacado: true, series: 4, reps: 9, repsLabel: '8-10', pesoBase: 25, nota: 'Pausa en contracción 1s. Máxima prioridad.' },
      { id: 'mie-remo-t', nombre: 'Remo T', grupo: 'DENSIDAD', destacado: true, series: 4, reps: 9, repsLabel: '8-10', pesoBase: 40, nota: 'Agarre supinado o neutro. Densidad central.' },
      { id: 'mie-remo-bajo-cable', nombre: 'Remo bajo cable inclinación adelante', grupo: 'DENSIDAD', destacado: true, series: 4, reps: 11, repsLabel: '10-12', pesoBase: 45, nota: 'Estiramiento completo + contracción peak.' },
      { id: 'mie-dominadas-supinas', nombre: 'Dominadas supinas', grupo: 'AMPLITUD', series: 4, reps: 10, repsLabel: '8-12', pesoBase: 0, pesoCorporal: true, unidad: 'reps', step: 1, nota: 'Amplitud escapular. Llevar codos al suelo.' },
      { id: 'mie-jalon-triangulo', nombre: 'Jalón cerrado triángulo', grupo: 'AMPLITUD', series: 4, reps: 11, repsLabel: '10-12', pesoBase: 50, nota: 'Agarre neutro. Codos hacia cadera.' },
      { id: 'mie-pullover-polea', nombre: 'Pullover polea', grupo: 'ESTIRAMIENTO', series: 3, reps: 15, repsLabel: '15', pesoBase: 25, nota: 'Finalizador. ROM máximo. Peso liviano.' },
      { id: 'mie-hombro-posterior', nombre: 'Máquina hombro posterior', grupo: 'DELT. POSTERIOR', series: 5, reps: 17, repsLabel: '15-20', pesoBase: 20, nota: 'Rotación externa. Alta rep. Salud del hombro.' },
      { id: 'mie-encogimientos-trapecio', nombre: 'Encogimientos trapecio', grupo: 'TRAPECIO', series: 4, reps: 13, repsLabel: '12-15', pesoBase: 30, nota: 'Pausa en el top. Retracción escapular.' },
      { id: 'mie-curl-scott', nombre: 'Curl Scott (Predicador)', grupo: 'BÍCEPS', destacado: true, series: 4, reps: 11, repsLabel: '10-12', pesoBase: 20, nota: 'Bíceps corto. Pico. Codo fijo en banco. ROT EXT.' },
    ],
  },
  {
    id: 'jueves',
    nombreCorto: 'Jue',
    nombre: 'Jueves',
    titulo: 'Lower Hipertrofia',
    tipo: 'HIPERTROFIA',
    foco: 'Femorales · Gemelos · Glúteos',
    ejercicios: [
      { id: 'jue-sentadilla-libre', nombre: 'Sentadilla libre', grupo: 'EXPLOSIVO', series: 6, reps: 3, repsLabel: '3 @ 65-70%', pesoBase: 70, nota: 'Velocidad concéntrica alta. Técnica impecable.' },
      { id: 'jue-hack-squat', nombre: 'Hack Squat', grupo: 'CUÁDRICEPS', series: 4, reps: 11, repsLabel: '10-12', pesoBase: 70, nota: 'Pies posición media. ROM completo.' },
      { id: 'jue-sentadilla-pendular', nombre: 'Sentadilla pendular', grupo: 'CUÁDRICEPS', series: 4, reps: 13, repsLabel: '12-15', pesoBase: 40, nota: 'ROM completo. Rodillas sin bloquear arriba.' },
      { id: 'jue-extensiones', nombre: 'Extensiones', grupo: 'CUÁDRICEPS', series: 4, reps: 17, repsLabel: '15-20', pesoBase: 35, nota: 'Finalizador. Pausa 1s en el top.' },
      { id: 'jue-peso-muerto-rumano', nombre: 'Peso muerto rumano', grupo: 'FEMORALES', destacado: true, series: 4, reps: 10, repsLabel: '8-12', pesoBase: 60, nota: 'Prioridad. Cadena posterior. Pausa abajo.' },
      { id: 'jue-isquio-acostado', nombre: 'Isquio acostado', grupo: 'FEMORALES', destacado: true, series: 4, reps: 13, repsLabel: '12-15', pesoBase: 30, nota: 'Excéntrico lento 3s. ROM completo.' },
      { id: 'jue-isquio-sentado', nombre: 'Isquio sentado', grupo: 'FEMORALES', destacado: true, series: 4, reps: 17, repsLabel: '15-20', pesoBase: 30, nota: 'Finalizador. Tensión en elongación.' },
      { id: 'jue-hip-thrust', nombre: 'Hip thrust', grupo: 'GLÚTEOS', series: 4, reps: 12, repsLabel: '12', pesoBase: 70, nota: 'Paso adelantado. Foco glúteo. ROM amplio.' },
      { id: 'jue-aductores', nombre: 'Aductores máquina', grupo: 'GLÚTEOS', series: 3, reps: 15, repsLabel: '15', pesoBase: 40, nota: 'Bisagra. Activa glúteo + femoral distal.' },
      { id: 'jue-gemelo-pie', nombre: 'Gemelo de pie', grupo: 'GEMELOS', destacado: true, series: 5, reps: 13, repsLabel: '12-15', pesoBase: 50, nota: 'Prioridad. Pausa 2s en estiramiento.' },
    ],
  },
  {
    id: 'viernes',
    nombreCorto: 'Vie',
    nombre: 'Viernes',
    titulo: 'Pecho Superior + Brazos',
    tipo: 'HIPERTROFIA',
    foco: '⭐ Pecho clavicular · Bíceps largo · Tríceps',
    ejercicios: [
      { id: 'vie-press-inclinado-barra', nombre: 'Press inclinado barra', grupo: 'EXPLOSIVO', series: 6, reps: 3, repsLabel: '3 @ 65-70%', pesoBase: 50, nota: 'Potencia. Barra rápida en concéntrico.' },
      { id: 'vie-press-inclinado-mancuernas', nombre: 'Press inclinado mancuernas', grupo: 'PECHO SUPERIOR', destacado: true, series: 4, reps: 10, repsLabel: '8-12', pesoBase: 28, nota: 'Máx prioridad. ROM completo. 30-45°.' },
      { id: 'vie-press-inclinado-maquina', nombre: 'Press inclinado máquina', grupo: 'PECHO SUPERIOR', destacado: true, series: 4, reps: 11, repsLabel: '10-12', pesoBase: 40, nota: 'Tensión constante. Rango útil.' },
      { id: 'vie-press-hammer-inclinado', nombre: 'Press Hammer inclinado (al lado de militar)', grupo: 'PECHO SUPERIOR', destacado: true, series: 3, reps: 11, repsLabel: '10-12', pesoBase: 40, nota: 'Agarre neutro. Protección articulación hombro.' },
      { id: 'vie-press-plano-mancuernas', nombre: 'Press plano mancuernas', grupo: 'PECHO PLANO', series: 3, reps: 11, repsLabel: '10-12', pesoBase: 26, nota: 'Complemento. Codos a 75°.' },
      { id: 'vie-aperturas-inclinadas', nombre: 'Aperturas inclinadas', grupo: 'APERTURAS', series: 4, reps: 13, repsLabel: '12-15', pesoBase: 12, nota: 'Estiramiento pectoral. Peso moderado.' },
      { id: 'vie-cruce-bajo-alto', nombre: 'Cruce bajo-alto (cable)', grupo: 'APERTURAS', series: 4, reps: 17, repsLabel: '15-20', pesoBase: 10, nota: 'Peak contraction. Fibras claviculares.' },
      { id: 'vie-curl-barra', nombre: 'Curl barra', grupo: 'BÍCEPS LARGO', destacado: true, series: 4, reps: 11, repsLabel: '10-12', pesoBase: 25, nota: 'Pico bíceps largo. Hombro extendido. Banco 45°.' },
      { id: 'vie-curl-cable-cerrado', nombre: 'Curl cable cerrado', grupo: 'BÍCEPS LARGO', destacado: true, series: 4, reps: 13, repsLabel: '12-15', pesoBase: 15, nota: 'Estiramiento máximo del largo. Cable bajo.' },
      { id: 'vie-extension-cabeza', nombre: 'Extensión sobre cabeza mancuerna', grupo: 'TRÍCEPS', series: 4, reps: 11, repsLabel: '10-12', pesoBase: 20, nota: 'Cabeza larga. ROM completo.' },
      { id: 'vie-extension-soga', nombre: 'Extensión soga (prono/neutro/supino)', grupo: 'TRÍCEPS', series: 4, reps: 13, repsLabel: '12-15', pesoBase: 25, nota: 'Separar la cuerda abajo. Contracción peak.' },
      { id: 'vie-vuelos-laterales', nombre: 'Vuelos laterales', grupo: 'HOMBRO', series: 5, reps: 12, repsLabel: '15/12/10/10/8', pesoBase: 10, nota: 'Mancuernas a RIR cero.' },
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
