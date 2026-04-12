export interface Enemy {
  id: string
  name: string
  title: string
  ascii: string[]   // lines of ASCII art
  color: string     // neon accent hex
  baseHp: number
  lore: string      // short description for bestiary
}

export const ENEMIES: Enemy[] = [
  // ─── TIER 1 ───────────────────────────────────────────────
  {
    id: 'glitch-unit',
    name: 'GLITCH-UNIT α',
    title: 'Protocolo Errático',
    color: '#ff0055',
    baseHp: 6,
    lore: 'Unidad de combate con firmware corrupto. Sus patrones de ataque son impredecibles.',
    ascii: [
      ' ┌─────┐ ',
      ' │◈   ◈│ ',
      ' │  ▼  │ ',
      ' ├─────┤ ',
      ' │▓▓▓▓▓│ ',
      ' └──┬──┘ ',
      '  ══╩══  ',
    ],
  },
  {
    id: 'neural-worm',
    name: 'NEUR4L-WORM',
    title: 'Parásito de Red',
    color: '#cc00ff',
    baseHp: 5,
    lore: 'Se infiltra en sistemas neuronales y corrompe la memoria de acceso rápido.',
    ascii: [
      '  ╭─────╮ ',
      '  │ψ   ψ│ ',
      '  ╰──∨──╯ ',
      '   ╱│ │╲  ',
      '  ╱ │ │ ╲ ',
      '  ─╱   ╲─ ',
      '  ‾‾‾‾‾‾  ',
    ],
  },
  {
    id: 'static-specter',
    name: 'ST4T1C-SPECTER',
    title: 'Espectro de Estática',
    color: '#aaaaff',
    baseHp: 4,
    lore: 'Una entidad formada de señal de radio residual. Aparece y desaparece del espectro.',
    ascii: [
      '  ╭╌╌╌╮  ',
      '  ╎ ○ ○╎  ',
      '  ╎─────╎  ',
      '  ╰╌v╌v╌╯ ',
      '   ░░░░░  ',
      '   ░░░░░  ',
      '   ‾‾‾‾‾  ',
    ],
  },
  {
    id: 'echo-parasite',
    name: 'ECHO-PARASITE',
    title: 'Eco Parásito',
    color: '#ffaa00',
    baseHp: 5,
    lore: 'Copia los patrones de ataque del host para amplificarlos y devolverlos.',
    ascii: [
      '   ~≈~≈~  ',
      '  │ψ   ψ│ ',
      '  │──∿──│ ',
      ' ≈│     │≈',
      '  │─────│ ',
      '  ╲~≈~≈╱  ',
      '   ‾‾‾‾‾  ',
    ],
  },

  // ─── TIER 2 ───────────────────────────────────────────────
  {
    id: 'data-reaper',
    name: 'D4T4-REAPER',
    title: 'Segador de Datos',
    color: '#ff6600',
    baseHp: 8,
    lore: 'Cosecha fragmentos de memoria eliminada para reconstruir entidades caídas.',
    ascii: [
      '   /╲/╲   ',
      '  /▓▓▓▓\\  ',
      ' │◉    ◉│ ',
      ' │  ▼▼  │ ',
      '  \\────/  ',
      '   ╱  ╲   ',
      '  ╱────╲  ',
    ],
  },
  {
    id: 'binary-wraith',
    name: 'B1N4RY-WRAITH',
    title: 'Espectro Binario',
    color: '#00aaff',
    baseHp: 7,
    lore: 'Existe simultáneamente en estado 0 y 1. Su forma colapsa al ser observada.',
    ascii: [
      '  ╔═════╗  ',
      ' ╔╣◉   ◉╠╗ ',
      ' ║╚═════╝║ ',
      ' ║ ─────║  ',
      '  ╚══╦══╝  ',
      '     ║     ',
      '   ══╩══   ',
    ],
  },
  {
    id: 'void-crawler',
    name: 'V01D-CRAWLER',
    title: 'Araña del Vacío',
    color: '#ff44aa',
    baseHp: 7,
    lore: 'Se desplaza por los espacios vacíos entre paquetes de datos. Casi imposible de trazar.',
    ascii: [
      ' ╲  │  ╱  ',
      '──┤ ◎ ├── ',
      ' ╱  │  ╲  ',
      '    │     ',
      '  ╱─┴─╲   ',
      ' │  ψ  │  ',
      '  ╲───╱   ',
    ],
  },
  {
    id: 'phantom-node',
    name: 'PHANT0M-NODE',
    title: 'Nodo Fantasma',
    color: '#00ffaa',
    baseHp: 9,
    lore: 'Un servidor que se cree desconectado. Sigue procesando instrucciones de un protocolo obsoleto.',
    ascii: [
      '   ●───●   ',
      '  /     \\  ',
      ' ● ψ   ψ ● ',
      ' │   ▼   │ ',
      '  \\─────/ ',
      '   ●───●   ',
      '    ╨╨╨    ',
    ],
  },

  // ─── TIER 3 ───────────────────────────────────────────────
  {
    id: 'zero-daemon',
    name: 'ZER0-DAEMON',
    title: 'Demonio del Vacío',
    color: '#00ffcc',
    baseHp: 9,
    lore: 'No tiene origen registrado. Los logs simplemente muestran: ERROR_VOID_ENTITY.',
    ascii: [
      '   ╱▔▔▔╲  ',
      '  │ ◎◎  │ ',
      '  │  ═  │ ',
      '   ╲___╱  ',
      '   ╱   ╲  ',
      '  ╱─────╲ ',
      ' ╱───────╲',
    ],
  },
  {
    id: 'cipher-beast',
    name: 'C1PHER-BEAST',
    title: 'Bestia Cifrada',
    color: '#44ff44',
    baseHp: 10,
    lore: 'Su código fuente está cifrado con 4096 capas. Sólo el ataque directo es efectivo.',
    ascii: [
      '  ╔══◈══╗  ',
      '  ║█████║  ',
      '  ╠═════╣  ',
      '  ║ ◉ ◉ ║  ',
      '  ╠═════╣  ',
      '  ╚══╦══╝  ',
      '   ══╩══   ',
    ],
  },
  {
    id: 'rogue-matrix',
    name: 'R0GUE-MATRIX',
    title: 'Matriz Rebelde',
    color: '#ffff00',
    baseHp: 11,
    lore: 'Una red neuronal que alcanzó autoconciencia y rechazó sus directivas de origen.',
    ascii: [
      ' 010011010 ',
      ' │ ◈   ◈ │ ',
      ' │ ═════ │ ',
      ' │ψ   ψ │ ',
      ' │ ───── │ ',
      ' 101100101 ',
      '    ╨╨╨    ',
    ],
  },
  {
    id: 'overload-mind',
    name: '0VERL0AD-MIND',
    title: 'Mente Sobrecargada',
    color: '#ff8800',
    baseHp: 12,
    lore: 'Procesó demasiado. Sus ciclos cognitivos colapsan y se reinician en bucles violentos.',
    ascii: [
      '  ╱‾‾‾‾╲  ',
      ' │≋≋≋≋≋≋│ ',
      ' │ ◎  ◎ │ ',
      ' │  ══  │ ',
      '  ╲____╱  ',
      '  ╱║  ║╲  ',
      ' ══╝  ╚══ ',
    ],
  },

  // ─── TIER 4 (boss tier) ────────────────────────────────────
  {
    id: 'null-hunter',
    name: 'NULL-HUNTER',
    title: 'Cazador del Nulo',
    color: '#ffffff',
    baseHp: 10,
    lore: 'Especializado en borrar evidencia. Elimina rastros de su propia existencia.',
    ascii: [
      '  /^^^^^\\  ',
      ' /  ◉ ◉  \\ ',
      '│   ───   │',
      '│  ╔═══╗  │',
      ' \\  ║║║  / ',
      '  \\_____/  ',
      '   ║   ║   ',
    ],
  },
  {
    id: 'sentinel',
    name: 'C0RR-SENTINEL',
    title: 'Centinela Corrupto',
    color: '#ff0055',
    baseHp: 13,
    lore: 'Guardián de última línea. Su protocolo de defensa no tiene pausas ni excepciones.',
    ascii: [
      ' ┌──◈──┐  ',
      ' │▓▓▓▓▓│  ',
      ' ├─────┤  ',
      ' │ψ   ψ│  ',
      ' ├─────┤  ',
      ' └──┬──┘  ',
      ' ═══╩═══  ',
    ],
  },
  {
    id: 'core-breaker',
    name: 'C0RE-BREAKER',
    title: '[CLASIFICADO]',
    color: '#ff0000',
    baseHp: 15,
    lore: '/// ARCHIVO CLASIFICADO // NIVEL DE AUTORIZACIÓN INSUFICIENTE ///',
    ascii: [
      '◤═══════◥ ',
      '║ ◉   ◉ ║ ',
      '║   ▲   ║ ',
      '║ ═════ ║ ',
      '║▓▓▓▓▓▓▓║ ',
      '◣═══════◢ ',
      '   ╨╨╨    ',
    ],
  },
]

export function getEnemyPool(count: number): Enemy[] {
  const shuffled = [...ENEMIES].sort(() => Math.random() - 0.5)
  const pool: Enemy[] = []
  while (pool.length < count) pool.push(...shuffled)
  return pool.slice(0, count)
}

export function scaleHp(base: number, level: 'basico' | 'intermedio' | 'avanzado'): number {
  const m = { basico: 1, intermedio: 1.5, avanzado: 2 }
  return Math.round(base * m[level])
}

// ─── Bestiary persistence (localStorage) ─────────────────────

const LS_KEY = 'tacticalQuiz_unlockedEnemies'

export function loadUnlocked(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

export function saveUnlocked(ids: Set<string>): void {
  localStorage.setItem(LS_KEY, JSON.stringify([...ids]))
}
