import type { Day, Exercise } from '../types'

/**
 * Rutina de Juan — 5 días.
 * Días 1-2 → FUERZA · Días 3-5 → HIPERTROFIA.
 * Todos los días arrancan con CORE (rueda abdominal).
 */
export const ROUTINE: Day[] = [
  {
    id: 'lunes',
    nombreCorto: 'D1',
    nombre: 'Día 1',
    titulo: 'Upper Power',
    tipo: 'FUERZA',
    foco: 'Espalda · Pecho Superior · Bíceps',
    ejercicios: [
      { id: 'lun-core-rueda', nombre: 'Rueda abdominal (core)', grupo: 'CORE', series: 4, reps: 10, repsLabel: '10-15', pesoBase: 0, pesoCorporal: true, nota: 'Se hace al principio. Extensión máxima controlada, sin arquear la lumbar.' },
      { id: 'lun-remo-barra-piso', nombre: 'Remo barra prono piso libre', grupo: 'ESPALDA', series: 4, reps: 4, repsLabel: '3-5', pesoBase: 60, nota: 'Explosivo. Espalda plana, tirón desde el suelo. Descanso < 1 min.' },
      { id: 'lun-dominadas-lastradas', nombre: 'Dominadas lastradas RIR 1', grupo: 'ESPALDA', series: 3, reps: 7, repsLabel: '6-8', pesoBase: 10, nota: 'Agarre prono. Retracción escapular total.' },
      { id: 'lun-remo-t', nombre: 'Remo T', grupo: 'ESPALDA', series: 3, reps: 8, repsLabel: '6-8', pesoBase: 80, pesoNota: 'Peso en discos', nota: 'Con máquina y discos. Bastante peso, RIR 1 (arranqué en 80 y subí a 90).' },
      { id: 'lun-press-inclinado-barra', nombre: 'Press inclinado barra', grupo: 'PECHO SUPERIOR', series: 4, reps: 5, repsLabel: '5', pesoBase: 50, nota: '30-45°. Potencia máxima. Barra sobre clavícula.' },
      { id: 'lun-press-plano-mancuernas', nombre: 'Press plano mancuerna a una mano', grupo: 'PECHO SUPERIOR', series: 3, reps: 7, repsLabel: '6-8', pesoBase: 40, pesoNota: 'Peso por mancuerna', nota: 'Unilateral: bajás una mancuerna manteniendo la otra arriba y alternás. Las de 40 kg son las más pesadas del gym.' },
      { id: 'lun-fondos-lastrados', nombre: 'Fondos lastrados', grupo: 'PECHO SUPERIOR', series: 3, reps: 7, repsLabel: '6-8', pesoBase: 10, nota: 'Torso ligeramente inclinado. Foco pecho.' },
      { id: 'lun-press-hombro-maq', nombre: 'Press hombro máquina', grupo: 'HOMBRO', biserie: 'hombro', series: 3, reps: 9, repsLabel: '8-10', pesoBase: 80, nota: 'Bi-serie con elevación lateral. Neutro protege articulación.' },
      { id: 'lun-elevacion-lateral', nombre: 'Elevación lateral (mancuernas)', grupo: 'HOMBRO', biserie: 'hombro', series: 3, reps: 9, repsLabel: '8-10', pesoBase: 15, pesoNota: 'Peso por mancuerna', nota: 'Bi-serie con press hombro. RIR 0-1, sin balanceo.' },
      { id: 'lun-curl-inclinado', nombre: 'Curl inclinado (Spider)', grupo: 'BÍCEPS', destacado: true, series: 4, reps: 7, repsLabel: '6-8', pesoBase: 14, pesoNota: 'Peso por mancuerna', nota: 'Banco 45°, hombros extendidos, rotación externa de muñecas. Cabeza larga del bíceps.' },
      { id: 'lun-press-frances', nombre: 'Press francés', grupo: 'TRÍCEPS', series: 4, reps: 7, repsLabel: '6-8', pesoBase: 25, nota: 'Mantenimiento. Control excéntrico lento.' },
    ],
  },
  {
    id: 'martes',
    nombreCorto: 'D2',
    nombre: 'Día 2',
    titulo: 'Lower Power',
    tipo: 'FUERZA',
    foco: 'Cuádriceps · Femorales · Gemelos',
    ejercicios: [
      { id: 'mar-core-rueda', nombre: 'Rueda abdominal (core)', grupo: 'CORE', series: 4, reps: 10, repsLabel: '10-15', pesoBase: 0, pesoCorporal: true, nota: 'Se hace al principio. Extensión máxima controlada, sin arquear la lumbar.' },
      { id: 'mar-sentadilla-libre', nombre: 'Sentadilla libre', grupo: 'CUÁDRICEPS', series: 5, reps: 4, repsLabel: '3-5', pesoBase: 80, nota: 'Fuerza base. Bar path vertical. Profundidad completa.' },
      { id: 'mar-hack-squat', nombre: 'Hack Squat', grupo: 'CUÁDRICEPS', series: 3, reps: 7, repsLabel: '6-8', pesoBase: 80, nota: 'Complemento. ROM completo. Rodillas sobre punta pies.' },
      { id: 'mar-peso-muerto-rumano', nombre: 'Peso muerto rumano', grupo: 'FEMORALES', destacado: true, series: 5, reps: 6, repsLabel: '5-8', pesoBase: 70, nota: 'Prioridad. Bisagra de cadera profunda. Pausa abajo.' },
      { id: 'mar-isquio-sentado', nombre: 'Isquio camilla sentado', grupo: 'FEMORALES', destacado: true, series: 4, reps: 9, repsLabel: '8-10', pesoBase: 35, nota: 'Prioridad. Tensión máxima en elongación.' },
      { id: 'mar-hip-thrust', nombre: 'Hip thrust', grupo: 'GLÚTEOS', series: 3, reps: 9, repsLabel: '8-10', pesoBase: 80, nota: 'Paso corto. Foco cuádriceps/glúteo. Pesada.' },
      { id: 'mar-gemelo-pendular', nombre: 'Gemelo de pie en pendular', grupo: 'GEMELOS', destacado: true, series: 5, reps: 9, repsLabel: '8-10', pesoBase: 60, nota: 'Prioridad. ROM máximo. Pausa 2s abajo.' },
    ],
  },
  {
    id: 'miercoles',
    nombreCorto: 'D3',
    nombre: 'Día 3',
    titulo: 'Espalda Especialización',
    tipo: 'HIPERTROFIA',
    foco: '⭐ Densidad dorsal · Amplitud · Bíceps',
    ejercicios: [
      { id: 'mie-core-rueda', nombre: 'Rueda abdominal (core)', grupo: 'CORE', series: 4, reps: 10, repsLabel: '10-15', pesoBase: 0, pesoCorporal: true, nota: 'Se hace al principio. Extensión máxima controlada, sin arquear la lumbar.' },
      { id: 'mie-remo-barra-piso', nombre: 'Remo barra piso prono', grupo: 'EXPLOSIVO', series: 6, reps: 3, repsLabel: '3 @ 65-70%', pesoBase: 55, nota: 'Velocidad alta en concéntrico. Descanso < 1 min entre series.' },
      { id: 'mie-remo-banco-45', nombre: 'Remo banco 45 (mancuerna)', grupo: 'DENSIDAD', destacado: true, series: 4, reps: 9, repsLabel: '8-10', pesoBase: 40, pesoNota: 'Peso por mancuerna (40 kg máx del gym)', nota: 'Pausa en contracción 1s. Máxima prioridad.' },
      { id: 'mie-remo-t', nombre: 'Remo T (máquina + discos)', grupo: 'DENSIDAD', destacado: true, series: 4, reps: 9, repsLabel: '8-10', pesoBase: 40, pesoNota: 'Peso en discos', nota: 'Agarre supinado o neutro. Densidad central.' },
      { id: 'mie-remo-bajo-cable', nombre: 'Remo bajo cable (agarre triángulo)', grupo: 'DENSIDAD', destacado: true, series: 4, reps: 11, repsLabel: '10-12', pesoBase: 45, nota: 'Estiramiento completo + contracción peak.' },
      { id: 'mie-dominadas-supinas', nombre: 'Dominadas supinas', grupo: 'AMPLITUD', series: 4, reps: 10, repsLabel: '8-12', pesoBase: 0, pesoCorporal: true, unidad: 'reps', step: 1, nota: 'Amplitud escapular. Llevar codos al suelo.' },
      { id: 'mie-jalon-triangulo', nombre: 'Jalón cerrado (agarre neutro)', grupo: 'AMPLITUD', series: 4, reps: 11, repsLabel: '10-12', pesoBase: 50, nota: 'Agarre neutro. Codos hacia la cadera / bolsillo.' },
      { id: 'mie-pullover-polea', nombre: 'Pullover polea', grupo: 'ESTIRAMIENTO', series: 3, reps: 15, repsLabel: '15', pesoBase: 25, nota: 'Finalizador. ROM máximo. Peso liviano.' },
      { id: 'mie-trapecio-smith', nombre: 'Encogimientos trapecio en Smith', grupo: 'TRAPECIO', biserie: 'espalda-alta', series: 4, reps: 13, repsLabel: '12-15', pesoBase: 60, pesoNota: 'Contás solo los discos + barra (~12,5 kg)', nota: 'Bi-serie: primero trapecio en Smith, después hombro posterior. Pausa arriba.' },
      { id: 'mie-hombro-posterior', nombre: 'Hombro posterior en banco inclinado (mancuernas)', grupo: 'DELT. POSTERIOR', biserie: 'espalda-alta', series: 5, reps: 17, repsLabel: '15-20', pesoBase: 10, pesoNota: 'Peso por mancuerna', nota: 'Bi-serie con trapecio. Banco 45°. Con la fatiga, ~10 kg para 15 reps.' },
      { id: 'mie-curl-scott', nombre: 'Curl Scott (Predicador)', grupo: 'BÍCEPS', destacado: true, series: 4, reps: 11, repsLabel: '10-12', pesoBase: 20, nota: 'Bíceps corto. Pico. Codo fijo en banco. ROT EXT.' },
    ],
  },
  {
    id: 'jueves',
    nombreCorto: 'D4',
    nombre: 'Día 4',
    titulo: 'Lower Hipertrofia',
    tipo: 'HIPERTROFIA',
    foco: 'Femorales · Gemelos · Glúteos',
    ejercicios: [
      { id: 'jue-core-rueda', nombre: 'Rueda abdominal (core)', grupo: 'CORE', series: 4, reps: 10, repsLabel: '10-15', pesoBase: 0, pesoCorporal: true, nota: 'Se hace al principio. Extensión máxima controlada, sin arquear la lumbar.' },
      { id: 'jue-sentadilla-libre', nombre: 'Sentadilla libre', grupo: 'EXPLOSIVO', series: 6, reps: 3, repsLabel: '3 @ 65-70%', pesoBase: 70, nota: 'Velocidad concéntrica alta. Descanso < 1 min entre series.' },
      { id: 'jue-hack-squat', nombre: 'Hack Squat', grupo: 'CUÁDRICEPS', series: 4, reps: 11, repsLabel: '10-12', pesoBase: 70, nota: 'Pies posición media. ROM completo.' },
      { id: 'jue-sentadilla-pendular', nombre: 'Sentadilla pendular', grupo: 'CUÁDRICEPS', series: 4, reps: 13, repsLabel: '12-15', pesoBase: 40, nota: 'ROM completo. Rodillas sin bloquear arriba.' },
      { id: 'jue-extensiones', nombre: 'Extensión de cuádriceps', grupo: 'CUÁDRICEPS', series: 4, reps: 17, repsLabel: '15-20', pesoBase: 35, nota: 'Finalizador. Pausa 1s en el top.' },
      { id: 'jue-peso-muerto-rumano', nombre: 'Peso muerto rumano', grupo: 'FEMORALES', destacado: true, series: 4, reps: 10, repsLabel: '8-12', pesoBase: 60, nota: 'Prioridad. Cadena posterior. Pausa abajo.' },
      { id: 'jue-isquio-sentado', nombre: 'Isquio sentado', grupo: 'FEMORALES', destacado: true, series: 4, reps: 17, repsLabel: '15-20', pesoBase: 30, nota: 'Finalizador. Tensión en elongación.' },
      { id: 'jue-hip-thrust', nombre: 'Hip thrust', grupo: 'GLÚTEOS', series: 4, reps: 12, repsLabel: '12', pesoBase: 70, nota: 'Paso adelantado. Foco glúteo. ROM amplio.' },
      { id: 'jue-aductores', nombre: 'Aductores máquina', grupo: 'GLÚTEOS', series: 3, reps: 15, repsLabel: '15', pesoBase: 40, nota: 'Bisagra. Activa glúteo + femoral distal.' },
      { id: 'jue-gemelo-pie', nombre: 'Gemelo de pie', grupo: 'GEMELOS', destacado: true, series: 5, reps: 13, repsLabel: '12-15', pesoBase: 50, nota: 'Prioridad. Pausa 2s en estiramiento.' },
    ],
  },
  {
    id: 'viernes',
    nombreCorto: 'D5',
    nombre: 'Día 5',
    titulo: 'Pecho Superior + Brazos',
    tipo: 'HIPERTROFIA',
    foco: '⭐ Pecho clavicular · Bíceps largo · Tríceps',
    ejercicios: [
      { id: 'vie-core-rueda', nombre: 'Rueda abdominal (core)', grupo: 'CORE', series: 4, reps: 10, repsLabel: '10-15', pesoBase: 0, pesoCorporal: true, nota: 'Se hace al principio. Extensión máxima controlada, sin arquear la lumbar.' },
      { id: 'vie-cruce-alto', nombre: 'Cruce alto en polea (pre-exhausto)', grupo: 'PRE-EXHAUSTO', series: 4, reps: 17, repsLabel: '15-20', pesoBase: 10, pesoNota: 'Peso por lado de la polea', nota: 'Arranca el día pre-exhaustando el pecho. Peak contraction, fibras claviculares.' },
      { id: 'vie-press-inclinado-barra', nombre: 'Press inclinado barra', grupo: 'EXPLOSIVO', series: 6, reps: 3, repsLabel: '3', pesoBase: 80, nota: 'Explosivo, descanso < 1 min. ~80 kg dejando reps en reserva.' },
      { id: 'vie-press-inclinado-mancuernas', nombre: 'Press inclinado mancuernas', grupo: 'PECHO SUPERIOR', destacado: true, series: 4, reps: 10, repsLabel: '8-12', pesoBase: 28, pesoNota: 'Peso por mancuerna', nota: 'Máx prioridad. ROM completo. 30-45°.' },
      { id: 'vie-press-inclinado-maquina', nombre: 'Press inclinado máquina', grupo: 'PECHO SUPERIOR', destacado: true, series: 4, reps: 11, repsLabel: '10-12', pesoBase: 80, pesoNota: 'Total sumando discos de los dos lados', nota: 'Tensión constante. Rango útil.' },
      { id: 'vie-press-inclinado-smith', nombre: 'Press inclinado en Smith', grupo: 'PECHO SUPERIOR', destacado: true, series: 3, reps: 11, repsLabel: '10-12', pesoBase: 40, pesoNota: 'Discos (ambos lados) + barra (~12,5-15 kg)', nota: 'Agarre neutro. Protección articulación hombro.' },
      { id: 'vie-press-plano-mancuernas', nombre: 'Press plano mancuernas', grupo: 'PECHO PLANO', series: 3, reps: 11, repsLabel: '10-12', pesoBase: 36, pesoNota: 'Peso por mancuerna', nota: 'Con mancuernas de 36-40 kg según la fatiga. Codos a 75°.' },
      { id: 'vie-aperturas-inclinadas', nombre: 'Aperturas inclinadas', grupo: 'APERTURAS', series: 4, reps: 13, repsLabel: '12-15', pesoBase: 15, pesoNota: 'Peso por mancuerna', nota: 'Estiramiento pectoral. Peso moderado (~15 kg).' },
      { id: 'vie-curl-barra', nombre: 'Curl barra', grupo: 'BÍCEPS LARGO', destacado: true, series: 4, reps: 11, repsLabel: '10-12', pesoBase: 25, nota: 'Pico bíceps largo. Hombro extendido. Banco 45°.' },
      { id: 'vie-curl-cable-cerrado', nombre: 'Curl cable cerrado', grupo: 'BÍCEPS LARGO', destacado: true, series: 4, reps: 13, repsLabel: '12-15', pesoBase: 15, pesoNota: 'Peso en la polea', nota: 'Estiramiento máximo del largo. Cable bajo.' },
      { id: 'vie-extension-cabeza', nombre: 'Extensión sobre cabeza mancuerna', grupo: 'TRÍCEPS', series: 4, reps: 11, repsLabel: '10-12', pesoBase: 20, pesoNota: 'Peso por mancuerna', nota: 'Cabeza larga. ROM completo.' },
      { id: 'vie-extension-soga-1', nombre: 'Extensión soga unipodal', grupo: 'TRÍCEPS', biserie: 'triceps', series: 4, reps: 13, repsLabel: '12-15', pesoBase: 12.5, pesoNota: 'Peso por brazo', nota: 'Bi-serie a un brazo. Agarre neutro. Bajás de 15 a 12,5 kg por la fatiga.' },
      { id: 'vie-extension-soga-2', nombre: 'Extensión soga unipodal (agarre prono)', grupo: 'TRÍCEPS', biserie: 'triceps', series: 4, reps: 13, repsLabel: '12-15', pesoBase: 12.5, pesoNota: 'Peso por brazo', nota: 'Bi-serie con la anterior. Agarre prono, a un brazo.' },
      { id: 'vie-vuelos-laterales', nombre: 'Vuelos laterales', grupo: 'HOMBRO', series: 5, reps: 12, repsLabel: '15/12/10/10/8', pesoBase: 10, pesoNota: 'Peso por mancuerna', nota: 'Mancuernas a RIR cero.' },
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
