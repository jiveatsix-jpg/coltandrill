import type { ThemeMeta, Level } from '../data/questions'
import { LEVEL_LABELS } from '../data/questions'

interface ThemeSelectorProps {
  themes: ThemeMeta[]
  selectedTheme: ThemeMeta | null
  selectedLevel: Level | null
  selectedSubcategory: string | null
  onSelectTheme: (theme: ThemeMeta) => void
  onSelectLevel: (level: Level) => void
  onSelectSubcategory: (sub: string | null) => void
  onStart: () => void
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
}: ThemeSelectorProps) {
  const canStart = selectedTheme !== null && selectedLevel !== null

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* ── Section: Theme ──────────────────────────────── */}
      <div>
        <p className="text-[9px] tracking-[0.4em] text-subtext font-mono uppercase mb-3">
          ▸ 01 // Selecciona módulo
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[7px] tracking-widest text-cyan/40 font-mono uppercase mb-2 ml-1">
              [ 01-A ] // FUNDAMENTOS
            </p>
            <div className="grid grid-cols-2 gap-3">
              {themes.filter(t => t.category === 'fundamentos').map((theme) => {
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
                      <span className="text-[9px] font-arcade leading-tight">{theme.label}</span>
                    </div>
                    <span className="text-[8px] text-subtext font-mono leading-tight mt-1 normal-case opacity-70">
                      {theme.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-[7px] tracking-widest text-yellow-400/40 font-mono uppercase mb-2 ml-1">
              [ 01-B ] // ESTILOS MUSICALES
            </p>
            <div className="grid grid-cols-2 gap-3">
              {themes.filter(t => t.category === 'estilos').map((theme) => {
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
                      <span className="text-[9px] font-arcade leading-tight">{theme.label}</span>
                    </div>
                    <span className="text-[8px] text-subtext font-mono leading-tight mt-1 normal-case opacity-70">
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
                  className={`arcade-btn panel-bevel-sm flex-col gap-1 py-3 text-[9px] font-arcade
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
              className={`px-3 py-1.5 font-mono text-[8px] border transition-all ${
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
                  className={`px-3 py-1.5 font-mono text-[8px] border transition-all ${
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
          ${canStart ? 'text-cyan border-cyan' : 'opacity-40 cursor-not-allowed'}
        `}
        style={
          canStart
            ? { boxShadow: '4px 4px 0 #007755, 0 0 18px #00ffcc55' }
            : {}
        }
        disabled={!canStart}
        onClick={canStart ? onStart : undefined}
      >
        {canStart ? '▶ INICIAR SECUENCIA' : '— SELECCIONA MÓDULO Y NIVEL —'}
      </button>
    </div>
  )
}
