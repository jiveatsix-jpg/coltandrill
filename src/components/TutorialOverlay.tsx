import { useState } from 'react'

const TUTORIAL_SEEN_KEY = 'tacticalQuiz_tutorialSeen'

interface TutorialStep {
  title: string
  text: string
}

const STEPS: TutorialStep[] = [
  {
    title: 'COLT&DRILL',
    text: 'Un RPG táctico de preguntas para repasar teoría musical — y también filosofía, vida de campo y conspiraciones. Cada respuesta correcta le hace daño a un enemigo.',
  },
  {
    title: 'ELIGE TU MÓDULO',
    text: 'Fundamentos (Intervalos, Escalas, Acordes, Teoría General) o Estilos y otros módulos (Blues, Vaporwave, Chirigotas, Iluminación, Filosofía, Vida de Campo, Conspiraciones). Elige también el nivel y, si quieres, una subcategoría concreta.',
  },
  {
    title: 'COMBATE',
    text: 'Cada acierto le resta HP al enemigo actual y suma tu racha (combo); un fallo la corta. Derrota al enemigo para pasar al siguiente.',
  },
  {
    title: 'BESTIARIO',
    text: 'Cada enemigo derrotado queda registrado ahí — puedes ver tu progreso general y hasta remezclar sus temas musicales en el modo JAM.',
  },
  {
    title: 'RÉCORD',
    text: 'Tu mejor racha de respuestas correctas seguidas se guarda como récord personal, visible en la pantalla principal.',
  },
]

export function TutorialOverlay() {
  const [open, setOpen] = useState(() => {
    try {
      return !localStorage.getItem(TUTORIAL_SEEN_KEY)
    } catch {
      return false
    }
  })
  const [step, setStep] = useState(0)

  function close() {
    setOpen(false)
    setStep(0)
    try {
      localStorage.setItem(TUTORIAL_SEEN_KEY, 'true')
    } catch {
      /* ignore */
    }
  }

  function next() {
    if (step === STEPS.length - 1) {
      close()
      return
    }
    setStep(s => Math.min(STEPS.length - 1, s + 1))
  }

  function prev() {
    setStep(s => Math.max(0, s - 1))
  }

  const current = STEPS[step] ?? STEPS[0]!

  return (
    <>
      <button
        onClick={() => { setStep(0); setOpen(true) }}
        className="bg-abyss border border-border p-1.5 panel-bevel-sm hover:border-cyan transition-colors font-arcade text-[9px] text-cyan"
        title="Ver tutorial"
      >
        ?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/75 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close() }}
        >
          <div
            className="panel-bevel bg-surface border-2 border-cyan/50 p-6 w-full max-w-sm"
            style={{ boxShadow: '5px 5px 0 #000000, 0 0 18px #00ffcc33' }}
          >
            <p className="font-mono text-[9px] text-subtext tracking-widest mb-3">
              PASO {step + 1} DE {STEPS.length}
            </p>
            <h2 className="font-arcade text-[11px] text-cyan tracking-widest mb-4"
                style={{ textShadow: '0 0 8px #00ffcc' }}>
              {current.title}
            </h2>
            <p className="font-mono text-xs text-text leading-relaxed mb-6 min-h-[80px]">
              {current.text}
            </p>

            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 ${i === step ? 'bg-cyan' : 'bg-abyss border border-border'}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  disabled={step === 0}
                  className="arcade-btn panel-bevel-sm font-mono text-[9px] px-3 py-2 disabled:opacity-30"
                >
                  ATRÁS
                </button>
                <button
                  onClick={next}
                  className="arcade-btn panel-bevel-sm font-mono text-[9px] px-3 py-2 border-cyan text-cyan"
                >
                  {step === STEPS.length - 1 ? 'ENTENDIDO' : 'SIGUIENTE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
