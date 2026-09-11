import {
  SEED_MODULES,
  SEED_QUESTIONS,
} from './questions'
import type { ModuleId, Level, Question, ModuleMeta, TestPreset } from './questions'

// ─── ID generator (family-wide pattern) ─────────────────────────────
const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

// ─── localStorage keys ───────────────────────────────────────────────
const MODULES_KEY   = 'tacticalQuiz_userModules'
const QUESTIONS_KEY = 'tacticalQuiz_userQuestions'
const TESTS_KEY      = 'tacticalQuiz_userTests'

// ─── Private load/save helpers ───────────────────────────────────────
function loadUserModules(): ModuleMeta[] {
  try {
    const raw = localStorage.getItem(MODULES_KEY)
    return raw ? (JSON.parse(raw) as ModuleMeta[]) : []
  } catch {
    return []
  }
}

function saveUserModules(mods: ModuleMeta[]): void {
  localStorage.setItem(MODULES_KEY, JSON.stringify(mods))
}

function loadUserQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY)
    return raw ? (JSON.parse(raw) as Question[]) : []
  } catch {
    return []
  }
}

function saveUserQuestions(qs: Question[]): void {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(qs))
}

function loadUserTests(): TestPreset[] {
  try {
    const raw = localStorage.getItem(TESTS_KEY)
    return raw ? (JSON.parse(raw) as TestPreset[]) : []
  } catch {
    return []
  }
}

function saveUserTests(tests: TestPreset[]): void {
  localStorage.setItem(TESTS_KEY, JSON.stringify(tests))
}

// ─── Module CRUD ──────────────────────────────────────────────────────
export function createModule(input: Omit<ModuleMeta, 'id' | 'origin'>): ModuleMeta {
  const mods = loadUserModules()
  const mod: ModuleMeta = { ...input, id: newId(), origin: 'user' }
  mods.push(mod)
  saveUserModules(mods)
  return mod
}

export function updateModule(id: ModuleId, patch: Partial<Omit<ModuleMeta, 'id' | 'origin'>>): void {
  const mods = loadUserModules()
  const idx = mods.findIndex((m) => m.id === id)
  if (idx === -1) return
  mods[idx] = { ...mods[idx], ...patch }
  saveUserModules(mods)
}

export function deleteModule(id: ModuleId): void {
  const mods = loadUserModules()
  if (!mods.some((m) => m.id === id)) return

  saveUserModules(mods.filter((m) => m.id !== id))

  const qs = loadUserQuestions()
  saveUserQuestions(qs.filter((q) => q.moduleId !== id))

  const tests = loadUserTests()
  saveUserTests(tests.filter((t) => t.moduleId !== id))
}

// ─── Question CRUD (data layer only — UI is a later phase) ───────────
export function createQuestion(input: Omit<Question, 'id' | 'origin'>): Question {
  const qs = loadUserQuestions()
  const q: Question = { ...input, id: newId(), origin: 'user' }
  qs.push(q)
  saveUserQuestions(qs)
  return q
}

export function updateQuestion(id: string, patch: Partial<Omit<Question, 'id' | 'origin'>>): void {
  const qs = loadUserQuestions()
  const idx = qs.findIndex((q) => q.id === id)
  if (idx === -1) return
  qs[idx] = { ...qs[idx], ...patch }
  saveUserQuestions(qs)
}

export function deleteQuestion(id: string): void {
  const qs = loadUserQuestions()
  if (!qs.some((q) => q.id === id)) return
  saveUserQuestions(qs.filter((q) => q.id !== id))
}

// ─── Test preset CRUD (data layer only — UI is a later phase) ────────
export function createTest(input: Omit<TestPreset, 'id' | 'createdAt'>): TestPreset {
  const tests = loadUserTests()
  const test: TestPreset = { ...input, id: newId(), createdAt: Date.now() }
  tests.push(test)
  saveUserTests(tests)
  return test
}

export function deleteTest(id: string): void {
  const tests = loadUserTests()
  saveUserTests(tests.filter((t) => t.id !== id))
}

// ─── Merged read APIs (the only functions the rest of the app should
//     use to query content — seed arrays stay private to this module) ─
export function getAllModules(): ModuleMeta[] {
  return [...SEED_MODULES, ...loadUserModules()]
}

export function getAllQuestionsFor(moduleId: ModuleId, level: Level, subcategory?: string): Question[] {
  let pool = [...SEED_QUESTIONS, ...loadUserQuestions()].filter(
    (q) => q.moduleId === moduleId && q.level === level
  )

  if (subcategory && subcategory !== 'all') {
    pool = pool.filter((q) => q.subcategory === subcategory)
  }
  return [...pool]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map((q) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5),
    }))
}

export function getAllTests(): TestPreset[] {
  return loadUserTests()
}

// ─── Authoring read API — ALL questions for a module, unshuffled and
//     uncapped, for management UIs (not gameplay sampling) ────────────
export function getQuestionsForModule(moduleId: ModuleId): Question[] {
  return [...SEED_QUESTIONS, ...loadUserQuestions()].filter((q) => q.moduleId === moduleId)
}
