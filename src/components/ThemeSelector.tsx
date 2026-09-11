import { useState } from 'react'
import type { ModuleMeta, Level } from '../data/questions'
import { LEVEL_LABELS } from '../data/questions'

interface ThemeSelectorProps {
  themes: ModuleMeta[]
  selectedTheme: ModuleMeta | null
  selectedLevel: Level | null
  selectedSubcategory: string | null
  onSelectTheme: (theme: ModuleMeta) => void
  onSelectLevel: (level: Level) => void
  onSelectSubcategory: (sub: string | null) => void
  onStart: () => void
  onBack: () => void
  onSaveTest: (name: string) => void
  highScore: number
}

export function ThemeSelector({
  themes,
  selectedTheme,
  selectedLevel,
  selectedSubcategory,
  onSelectTheme,
  onSelectLevel,
  onSelectSubcategory,
  onStart,
  onBack,
  onSaveTest,
}: ThemeSelectorProps) {
  const canStart = selectedTheme !== null && selectedLevel !== null

  const [isNamingTest, setIsNamingTest] = useState(false)
  const [testName, setTestName] = useState('')

  const submitSaveTest = () => {
    const trimmed = testName.trim()
    if (trimmed === '') return
    onSaveTest(trimmed)
    setTestName('')
    setIsNamingTest(false)
  }

  const cancelSaveTest = () => {
    setTestName('')
    setIsNamingTest(false)
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* ── Back ─────────────────────────────────────────── */}
      <button
        className="arcade-btn panel-bevel-sm font-mono text-[9px] px-4 py-2 self-start"
        style={{ width: 'fit-content' }}
        onClick={onBack}
      >
        ← VOLVER
      </button>

      {/* ── Section: Theme ──────────────────────────────── */}
      <div>
        <p className="text-[9px] tracking-[0.4em] text-subtext font-mono uppercase mb-3">
          ▸ 01 // Selecciona módulo
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => {
                const active = selectedTheme?.id === theme.id
                return (
                  <button
                    key={theme.id}
                    id={`theme-${theme.id}`}
                    onClick={() => onSelectTheme(theme)}
                    className={`
                      arcade-btn panel-bevel-sm flex-col items-start gap-1 py-3 px-3 text-left transition-all
                      ${active ? 'border-cyan text-cyan' : 'border-subtext/20'}
                    `}
                    style={
                      active
                        ? { boxShadow: '4px 4px 0 #007755, 0 0 14px #00ffcc55', background: '#041a12' }
                        : {}
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{theme.icon}</span>
                      <span className="text-[11px] font-arcade leading-tight">{theme.label}</span>
                    </div>
                    <span className="text-[12px] text-subtext font-mono leading-tight mt-1 normal-case opacity-70">
                      {theme.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section: Level ──────────────────────────────── */}
      {selectedTheme && (
        <div className="animate-fadeIn">
          <p className="text-[9px] tracking-[0.4em] text-subtext font-mono uppercase mb-3">
            ▸ 02 // Selecciona nivel
          </p>
          <div className="grid grid-cols-3 gap-3">
            {selectedTheme.levels.map((lvl) => {
              const active = selectedLevel === lvl
              const levelColors: Record<string, string> = {
                basico:     '#00ffcc',
                intermedio: '#ffcc00',
                avanzado:   '#ff0055',
              }
              const color = levelColors[lvl]
              return (
                <button
                  key={lvl}
                  id={`level-${lvl}`}
                  onClick={() => onSelectLevel(lvl)}
                  className={`arcade-btn panel-bevel-sm flex-col gap-1 py-3 text-[11px] font-arcade
                    ${active ? '' : ''}
                  `}
                  style={
                    active
                      ? {
                          borderColor: color,
                          color: color,
                          background: '#0a0a12',
                          boxShadow: `4px 4px 0 #002211, 0 0 14px ${color}44`,
                        }
                      : {}
                  }
                >
                  {LEVEL_LABELS[lvl]}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Section: Subcategory ────────────────────────── */}
      {selectedTheme && selectedLevel && (
        <div className="animate-fadeIn">
          <p className="text-[9px] tracking-[0.4em] text-subtext font-mono uppercase mb-3">
            ▸ 03 // Selecciona subcategoría
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectSubcategory(null)}
              className={`px-3 py-1.5 font-mono text-[11px] border transition-all ${
                !selectedSubcategory 
                  ? 'bg-cyan text-abyss border-cyan' 
                  : 'bg-transparent text-subtext border-subtext/30 hover:border-cyan/50'
              }`}
            >
              [ TODAS LAS ÁREAS ]
            </button>
            {selectedTheme.subcategories.map((sub) => {
              const active = selectedSubcategory === sub.id
              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubcategory(sub.id)}
                  className={`px-3 py-1.5 font-mono text-[11px] border transition-all ${
                    active 
                      ? 'bg-cyan text-abyss border-cyan' 
                      : 'bg-transparent text-subtext border-subtext/30 hover:border-cyan/50'
                  }`}
                  style={active ? { boxShadow: '0 0 10px #00ffccaa' } : {}}
                >
                  {sub.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Start Button ────────────────────────────────── */}
      <button
        id="start-btn"
        className={`arcade-btn panel-bevel-sm font-arcade text-[10px] py-4 mt-2
          ${canStart ? 'arcade-btn--primary' : 'opacity-40 cursor-not-allowed'}
        `}
        disabled={!canStart}
        onClick={canStart ? onStart : undefined}
      >
        {canStart ? '▶ INICIAR SECUENCIA' : '— SELECCIONA MÓDULO Y NIVEL —'}
      </button>

      {canStart && (
        isNamingTest ? (
          <div className="flex gap-2 self-start items-center">
            <input
              autoFocus
              className="bg-abyss border border-border p-2 font-mono text-xs text-text focus:border-cyan outline-none"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  submitSaveTest()
                }
              }}
              placeholder="Nombre del test"
            />
            <button
              className="arcade-btn arcade-btn--primary panel-bevel-sm font-mono text-[9px] px-3 py-2 shrink-0"
              style={{ width: 'fit-content' }}
              onClick={submitSaveTest}
            >
              GUARDAR
            </button>
            <button
              className="arcade-btn panel-bevel-sm font-mono text-[9px] px-3 py-2 shrink-0"
              style={{ width: 'fit-content' }}
              onClick={cancelSaveTest}
            >
              CANCELAR
            </button>
          </div>
        ) : (
          <button
            id="save-test-btn"
            className="arcade-btn panel-bevel-sm font-mono text-[9px] px-4 py-2 self-start"
            style={{ width: 'fit-content' }}
            onClick={() => setIsNamingTest(true)}
          >
            + GUARDAR COMO TEST
          </button>
        )
      )}
    </div>
  )
}
