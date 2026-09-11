import { useState, useEffect } from 'react'
import type { ModuleMeta, Level, Subcategory, Question } from '../data/questions'
import { LEVEL_LABELS } from '../data/questions'
import { createQuestion, updateQuestion, deleteQuestion, getQuestionsForModule } from '../data/library'

interface ModuleEditorProps {
  module: ModuleMeta | null
  onSave: (input: Omit<ModuleMeta, 'id' | 'origin'>) => void
  onCancel: () => void
}

const ALL_LEVELS: Level[] = ['basico', 'intermedio', 'avanzado']
const LETTER = ['A', 'B', 'C', 'D']

const slugify = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const inputClass =
  'bg-abyss border border-border p-2 font-mono text-xs text-text focus:border-cyan outline-none w-full'

export function ModuleEditor({ module, onSave, onCancel }: ModuleEditorProps) {
  const [label, setLabel] = useState(module?.label ?? '')
  const [icon, setIcon] = useState(module?.icon ?? '')
  const [description, setDescription] = useState(module?.description ?? '')
  const [levels, setLevels] = useState<Level[]>(module?.levels ?? [])
  const [subcategories, setSubcategories] = useState<Subcategory[]>(module?.subcategories ?? [])
  const [subInput, setSubInput] = useState('')

  // ── Question management (edit mode only) ────────────────────────────
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionForm, setQuestionForm] = useState<{ mode: 'create' | 'edit'; question: Question | null } | null>(
    null
  )
  const [confirmingQuestionId, setConfirmingQuestionId] = useState<string | null>(null)

  useEffect(() => {
    if (module) {
      setQuestions(getQuestionsForModule(module.id))
    }
  }, [module?.id])

  const refreshQuestions = () => {
    if (module) setQuestions(getQuestionsForModule(module.id))
  }

  const handleDeleteQuestion = (q: Question) => {
    if (confirmingQuestionId !== q.id) {
      setConfirmingQuestionId(q.id)
      return
    }
    setConfirmingQuestionId(null)
    deleteQuestion(q.id)
    refreshQuestions()
  }

  const handleSaveQuestion = (data: {
    prompt: string
    options: string[]
    answer: string
    level: Level
    subcategory: string
  }) => {
    if (!module) return
    if (questionForm?.mode === 'edit' && questionForm.question) {
      updateQuestion(questionForm.question.id, data)
    } else {
      createQuestion({ ...data, moduleId: module.id })
    }
    refreshQuestions()
    setQuestionForm(null)
  }

  const subcategoryLabel = (subId: string) =>
    module?.subcategories.find((s) => s.id === subId)?.label ?? subId

  const toggleLevel = (lvl: Level) => {
    setLevels((prev) => (prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]))
  }

  const addSubcategory = () => {
    const trimmed = subInput.trim()
    if (!trimmed) return
    const id = slugify(trimmed)
    if (!id || subcategories.some((s) => s.id === id)) {
      setSubInput('')
      return
    }
    setSubcategories((prev) => [...prev, { id, label: trimmed }])
    setSubInput('')
  }

  const removeSubcategory = (id: string) => {
    setSubcategories((prev) => prev.filter((s) => s.id !== id))
  }

  const canSave = label.trim().length > 0 && levels.length > 0

  const handleSave = () => {
    if (!canSave) return
    onSave({ label: label.trim(), icon, description, levels, subcategories })
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* ── Back ─────────────────────────────────────────── */}
      <button
        className="arcade-btn panel-bevel-sm font-mono text-[9px] px-4 py-2 self-start"
        style={{ width: 'fit-content' }}
        onClick={onCancel}
      >
        ← VOLVER
      </button>

      <p className="text-[9px] tracking-[0.4em] text-subtext font-mono uppercase">
        ▸ {module ? 'EDITAR MÓDULO' : 'NUEVO MÓDULO'}
      </p>

      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
        {/* ── Left column: module fields + save ───────────── */}
        <div className="flex flex-col gap-5">
          <div className="panel-bevel bg-surface border-2 border-border p-4 flex flex-col gap-4">
            {/* Label */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-mono text-subtext tracking-widest uppercase">
                Nombre
              </label>
              <input
                className={inputClass}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ej. RITMO AVANZADO"
              />
            </div>

            {/* Icon */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-mono text-subtext tracking-widest uppercase">
                Icono (emoji o glifo)
              </label>
              <input
                className={inputClass}
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="◈"
                maxLength={4}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-mono text-subtext tracking-widest uppercase">
                Descripción
              </label>
              <textarea
                className={inputClass}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Breve descripción del módulo"
              />
            </div>

            {/* Levels */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-mono text-subtext tracking-widest uppercase">
                Niveles
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ALL_LEVELS.map((lvl) => {
                  const active = levels.includes(lvl)
                  return (
                    <button
                      key={lvl}
                      type="button"
                      className={`arcade-btn panel-bevel-sm font-arcade text-[11px] py-2 ${
                        active ? 'text-cyan border-cyan' : ''
                      }`}
                      style={active ? { boxShadow: '4px 4px 0 #007755, 0 0 14px #00ffcc55' } : {}}
                      onClick={() => toggleLevel(lvl)}
                    >
                      {LEVEL_LABELS[lvl]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Subcategories */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-mono text-subtext tracking-widest uppercase">
                Subcategorías
              </label>
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  value={subInput}
                  onChange={(e) => setSubInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSubcategory()
                    }
                  }}
                  placeholder="Ej. IMPROVISACIÓN"
                />
                <button
                  type="button"
                  className="arcade-btn panel-bevel-sm font-arcade text-[8px] px-3 shrink-0"
                  style={{ width: 'fit-content' }}
                  onClick={addSubcategory}
                >
                  + AÑADIR
                </button>
              </div>
              {subcategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {subcategories.map((sub) => (
                    <span
                      key={sub.id}
                      className="px-2 py-1 font-mono text-[11px] border border-subtext/30 text-subtext flex items-center gap-2"
                    >
                      {sub.label}
                      <button
                        type="button"
                        className="text-red hover:text-cyan"
                        onClick={() => removeSubcategory(sub.id)}
                        aria-label={`Quitar ${sub.label}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Save */}
          <button
            className={`arcade-btn panel-bevel-sm font-arcade text-[10px] py-4
              ${canSave ? 'arcade-btn--primary' : 'opacity-40 cursor-not-allowed'}
            `}
            disabled={!canSave}
            onClick={canSave ? handleSave : undefined}
          >
            ▶ GUARDAR MÓDULO
          </button>
        </div>

        {/* ── Right column: questions ──────────────────────── */}
        {module ? (
          <div className="flex flex-col gap-3">
            <p className="text-[9px] tracking-[0.4em] text-subtext font-mono uppercase">
              ▸ PREGUNTAS DE ESTE MÓDULO
            </p>

            {questions.length > 0 && (
              <div className="flex flex-col gap-2">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className={`panel-bevel-sm bg-surface border-2 border-subtext/20 py-2 px-3 flex flex-col gap-1 ${
                      q.origin === 'seed' ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-mono text-text leading-tight truncate">
                        {q.prompt}
                      </span>
                      {q.origin === 'seed' && (
                        <span className="text-[7px] font-mono text-subtext border border-subtext/30 px-1 py-0.5 tracking-widest shrink-0">
                          SEMILLA
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-subtext opacity-70 uppercase">
                      <span>{LEVEL_LABELS[q.level]}</span>
                      <span>·</span>
                      <span>{subcategoryLabel(q.subcategory)}</span>
                    </div>

                    {q.origin === 'user' && (
                      <div className="flex gap-2 mt-1 pt-2 border-t border-border/30">
                        <button
                          type="button"
                          className="arcade-btn panel-bevel-sm font-arcade text-[7px] px-2 py-1.5 flex-1"
                          onClick={() => setQuestionForm({ mode: 'edit', question: q })}
                        >
                          EDITAR
                        </button>
                        <button
                          type="button"
                          className={`arcade-btn panel-bevel-sm font-arcade text-[7px] px-2 py-1.5 flex-1 ${
                            confirmingQuestionId === q.id ? 'arcade-btn--danger-armed' : 'arcade-btn--danger'
                          }`}
                          onClick={() => handleDeleteQuestion(q)}
                        >
                          {confirmingQuestionId === q.id ? '¿SEGURO? BORRAR' : 'BORRAR'}
                        </button>
                        {confirmingQuestionId === q.id && (
                          <button
                            type="button"
                            className="font-mono text-[7px] text-subtext underline shrink-0 px-1"
                            onClick={() => setConfirmingQuestionId(null)}
                          >
                            cancelar
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {questionForm ? (
              <QuestionFormPanel
                module={module}
                initial={questionForm.question}
                onSave={handleSaveQuestion}
                onCancel={() => setQuestionForm(null)}
              />
            ) : (
              <button
                type="button"
                className="arcade-btn panel-bevel-sm font-arcade text-[9px] py-3"
                onClick={() => setQuestionForm({ mode: 'create', question: null })}
              >
                + NUEVA PREGUNTA
              </button>
            )}
          </div>
        ) : (
          <p className="text-[11px] font-mono text-subtext opacity-60 uppercase tracking-widest text-center">
            Guardá el módulo para poder agregar preguntas
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Question form (create / edit) ────────────────────────────────────
interface QuestionFormPanelProps {
  module: ModuleMeta
  initial: Question | null
  onSave: (data: { prompt: string; options: string[]; answer: string; level: Level; subcategory: string }) => void
  onCancel: () => void
}

function QuestionFormPanel({ module, initial, onSave, onCancel }: QuestionFormPanelProps) {
  const [prompt, setPrompt] = useState(initial?.prompt ?? '')
  const [options, setOptions] = useState<string[]>(initial?.options ?? ['', '', '', ''])
  const [answerIndex, setAnswerIndex] = useState<number | null>(
    initial ? initial.options.findIndex((o) => o === initial.answer) : null
  )
  const [level, setLevel] = useState<Level | null>(initial?.level ?? module.levels[0] ?? null)
  const [subcategory, setSubcategory] = useState<string>(
    initial?.subcategory ?? module.subcategories[0]?.id ?? ''
  )

  const setOption = (i: number, value: string) => {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? value : o)))
  }

  const canSave =
    prompt.trim().length > 0 &&
    options.every((o) => o.trim().length > 0) &&
    answerIndex !== null &&
    level !== null

  const handleSave = () => {
    if (!canSave || answerIndex === null || level === null) return
    onSave({
      prompt: prompt.trim(),
      options: options.map((o) => o.trim()),
      answer: options[answerIndex].trim(),
      level,
      subcategory,
    })
  }

  return (
    <div className="panel-bevel bg-surface border-2 border-border p-4 flex flex-col gap-4">
      {/* Prompt */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-mono text-subtext tracking-widest uppercase">Pregunta</label>
        <textarea
          className={inputClass}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="Escribí la pregunta"
        />
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-mono text-subtext tracking-widest uppercase">
          Opciones (marcá la correcta)
        </label>
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              type="button"
              className={`arcade-btn panel-bevel-sm font-arcade text-[8px] w-8 h-8 shrink-0 ${
                answerIndex === i ? 'text-cyan border-cyan' : ''
              }`}
              style={answerIndex === i ? { boxShadow: '2px 2px 0 #007755, 0 0 10px #00ffcc55' } : {}}
              onClick={() => setAnswerIndex(i)}
              aria-label={`Marcar ${LETTER[i]} como correcta`}
            >
              {LETTER[i]}
            </button>
            <input
              className={inputClass}
              value={opt}
              onChange={(e) => setOption(i, e.target.value)}
              placeholder={`Opción ${LETTER[i]}`}
            />
          </div>
        ))}
      </div>

      {/* Level */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-mono text-subtext tracking-widest uppercase">Nivel</label>
        <div className="grid grid-cols-3 gap-2">
          {module.levels.map((lvl) => {
            const active = level === lvl
            return (
              <button
                key={lvl}
                type="button"
                className={`arcade-btn panel-bevel-sm font-arcade text-[11px] py-2 ${
                  active ? 'text-cyan border-cyan' : ''
                }`}
                style={active ? { boxShadow: '4px 4px 0 #007755, 0 0 14px #00ffcc55' } : {}}
                onClick={() => setLevel(lvl)}
              >
                {LEVEL_LABELS[lvl]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Subcategory */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-mono text-subtext tracking-widest uppercase">Subcategoría</label>
        {module.subcategories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {module.subcategories.map((sub) => {
              const active = subcategory === sub.id
              return (
                <button
                  key={sub.id}
                  type="button"
                  className={`px-3 py-1.5 font-mono text-[11px] border transition-all ${
                    active
                      ? 'bg-cyan text-abyss border-cyan'
                      : 'bg-transparent text-subtext border-subtext/30 hover:border-cyan/50'
                  }`}
                  onClick={() => setSubcategory(sub.id)}
                >
                  {sub.label}
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-[11px] font-mono text-subtext opacity-60">Este módulo no tiene subcategorías.</p>
        )}
      </div>

      {/* Save / Cancel */}
      <div className="flex gap-2">
        <button
          type="button"
          className={`arcade-btn panel-bevel-sm font-arcade text-[9px] py-3 flex-1
            ${canSave ? 'arcade-btn--primary' : 'opacity-40 cursor-not-allowed'}
          `}
          disabled={!canSave}
          onClick={canSave ? handleSave : undefined}
        >
          ▶ GUARDAR PREGUNTA
        </button>
        <button
          type="button"
          className="arcade-btn panel-bevel-sm font-arcade text-[9px] py-3 flex-1"
          onClick={onCancel}
        >
          CANCELAR
        </button>
      </div>
    </div>
  )
}
