export type ModuleId = string
export type Level   = 'basico' | 'intermedio' | 'avanzado'

export interface Question {
  id: string
  prompt: string
  options: string[]
  answer: string
  moduleId: ModuleId
  level: Level
  subcategory: string
  origin: 'seed' | 'user'
}

export interface Subcategory {
  id: string
  label: string
}

export interface ModuleMeta {
  id: ModuleId
  label: string
  icon: string
  description: string
  levels: Level[]
  subcategories: Subcategory[]
  origin: 'seed' | 'user'
}

export interface TestPreset {
  id: string
  name: string
  moduleId: ModuleId
  level: Level
  subcategory: string | null
  questionIds?: string[]   // reserved for a future curated-set mode, unused/unimplemented for now
  createdAt: number
}

export const SEED_MODULES: ModuleMeta[] = [
]

export const LEVEL_LABELS: Record<Level, string> = {
  basico:      'BÁSICO',
  intermedio:  'INTERMEDIO',
  avanzado:    'AVANZADO',
}

export const SEED_QUESTIONS: Question[] = [
]

