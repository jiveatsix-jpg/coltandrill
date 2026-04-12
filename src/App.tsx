import { useState, useCallback, useEffect, useRef } from 'react'
import { QuizCard } from './components/QuizCard'
import { ThemeSelector } from './components/ThemeSelector'
import { EnemyPanel } from './components/EnemyPanel'
import { Bestiary } from './components/Bestiary'
import { getQuestions, THEMES } from './data/questions'
import { getEnemyPool, scaleHp, loadUnlocked, saveUnlocked } from './data/enemies'
import { 
  playStart, playHit, playDefeated, playComplete, playSelect, 
  startBackgroundMusic, stopBackgroundMusic 
} from './lib/sounds'
import type { Question, ThemeMeta, Level } from './data/questions'
import type { Enemy } from './data/enemies'
import './index.css'

type GameState = 'booting' | 'idle' | 'selecting' | 'playing' | 'done' | 'bestiary'

export default function App() {
  const [gameState, setGameState]       = useState<GameState>('booting')
  const [questions, setQuestions]       = useState<Question[]>([])
  const questionsRef                    = useRef<Question[]>([])
  const [currentIdx, setCurrentIdx]     = useState(0)
  const [streak, setStreak]             = useState(0)
  const [highScore, setHighScore]       = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [shake, setShake]               = useState(false)

  const [selectedTheme, setSelectedTheme] = useState<ThemeMeta | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  // Enemy state
  const [enemyPool, setEnemyPool]         = useState<Enemy[]>([])
  const [enemyIndex, setEnemyIndex]       = useState(0)
  const [enemyHp, setEnemyHp]             = useState(0)
  const [enemyMaxHp, setEnemyMaxHp]       = useState(0)
  const [enemyHit, setEnemyHit]           = useState(false)
  const [enemyDefeated, setEnemyDefeated] = useState(false)
  const enemyPoolRef = useRef<Enemy[]>([])
  const enemyIdxRef  = useRef(0)
  const enemyHpRef   = useRef(0)
  const enemyMaxRef  = useRef(0)

  // Bestiary / unlock state
  const [unlockedEnemies, setUnlockedEnemies] = useState<Set<string>>(() => loadUnlocked())
  const [musicEnabled, setMusicEnabled] = useState(() => {
    return localStorage.getItem('tacticalQuiz_music') === 'true'
  })
  const [newUnlock, setNewUnlock]             = useState<Enemy | null>(null)
  const unlockedRef = useRef<Set<string>>(loadUnlocked())

  // Music Logic
  useEffect(() => {
    if (musicEnabled && gameState !== 'booting') {
      startBackgroundMusic()
    } else {
      stopBackgroundMusic()
    }
    localStorage.setItem('tacticalQuiz_music', String(musicEnabled))
  }, [musicEnabled, gameState])
  // Boot sequence logic
  const [bootLines, setBootLines] = useState<string[]>([])
  useEffect(() => {
    if (gameState !== 'booting') return
    const lines = [
      '> INITIALIZING CORE_KERNEL_v1.0.4',
      '> LOADING AUDIO_ENGINE... [OK]',
      '> CONNECTING TO MUSICAL_DATABASE... [OK]',
      '> SCANNING FOR THREATS... [15 ENTITIES DETECTED]',
      '> LOAD_THEME: VAPORWAVE... [OK]',
      '> LOAD_THEME: BLUES... [OK]',
      '> PROTOCOL: TACTICAL_TRAINING_INITIATED',
      '> ACCESS GRANTED.'
    ]
    let current = 0
    const timer = setInterval(() => {
      if (current < lines.length) {
        setBootLines(prev => [...prev, lines[current]])
        current++
      } else {
        clearInterval(timer)
        setTimeout(() => setGameState('idle'), 800)
      }
    }, 150)
    return () => clearInterval(timer)
  }, [gameState])

  useEffect(() => {
    const stored = localStorage.getItem('tacticalQuiz_highScore')
    if (stored) setHighScore(Number(stored))
  }, [])

  const handleSelectTheme = useCallback((theme: ThemeMeta) => {
    setSelectedTheme(theme)
    setSelectedLevel(null)
    setSelectedSubcategory(null)
    playSelect()
  }, [])

  const handleSelectLevel = useCallback((level: Level) => {
    setSelectedLevel(level)
    setSelectedSubcategory(null)
    playSelect()
  }, [])

  const handleSelectSubcategory = useCallback((sub: string | null) => {
    setSelectedSubcategory(sub)
    playSelect()
  }, [])

  const spawnEnemy = useCallback((pool: Enemy[], idx: number, level: Level) => {
    const enemy  = pool[idx % pool.length]
    const maxHp  = scaleHp(enemy.baseHp, level)
    enemyIdxRef.current = idx
    enemyHpRef.current  = maxHp
    enemyMaxRef.current = maxHp
    setEnemyIndex(idx)
    setEnemyHp(maxHp)
    setEnemyMaxHp(maxHp)
    setEnemyDefeated(false)
  }, [])

  const startGame = useCallback(() => {
    if (!selectedTheme || !selectedLevel) return
    const q = getQuestions(selectedTheme.id, selectedLevel, selectedSubcategory || undefined)
    if (q.length === 0) return

    const poolSize = Math.max(1, Math.ceil(q.length / 3))
    const pool     = getEnemyPool(poolSize)
    enemyPoolRef.current = pool

    questionsRef.current = q
    setQuestions(q)
    setCurrentIdx(0)
    setStreak(0)
    setTotalCorrect(0)
    setEnemyPool(pool)
    spawnEnemy(pool, 0, selectedLevel)
    setGameState('playing')
    playStart()
  }, [selectedTheme, selectedLevel, spawnEnemy])

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (correct) {
        const newStreak = streak + 1
        setStreak(newStreak)
        setTotalCorrect((c) => c + 1)
        if (newStreak > highScore) {
          setHighScore(newStreak)
          localStorage.setItem('tacticalQuiz_highScore', String(newStreak))
        }

        // Deal damage
        const dmg   = Math.max(1, Math.ceil(enemyMaxRef.current / 3))
        const newHp = Math.max(0, enemyHpRef.current - dmg)
        enemyHpRef.current = newHp
        setEnemyHp(newHp)
        setEnemyHit(true)
        playHit()
        setTimeout(() => setEnemyHit(false), 400)

        // Enemy defeated?
        if (newHp <= 0 && selectedLevel) {
          const defeatedEnemy = enemyPoolRef.current[enemyIdxRef.current % enemyPoolRef.current.length]
          setEnemyDefeated(true)
          playDefeated()

          // Unlock logic
          if (defeatedEnemy && !unlockedRef.current.has(defeatedEnemy.id)) {
            const next = new Set(unlockedRef.current)
            next.add(defeatedEnemy.id)
            unlockedRef.current = next
            saveUnlocked(next)
            setUnlockedEnemies(new Set(next))
            setNewUnlock(defeatedEnemy)
            setTimeout(() => setNewUnlock(null), 2500)
          }

          const nextIdx = enemyIdxRef.current + 1
          setTimeout(() => {
            spawnEnemy(enemyPoolRef.current, nextIdx, selectedLevel)
          }, 700)
        }
      } else {
        setStreak(0)
        setShake(true)
        setTimeout(() => setShake(false), 350)
      }

      const total = questionsRef.current.length
      const next  = currentIdx + 1
      if (next >= total) {
        playComplete()
        setTimeout(() => setGameState('done'), 650)
      } else {
        setCurrentIdx(next)
      }
    },
    [streak, highScore, currentIdx, selectedLevel, spawnEnemy]
  )

  const goToSelect  = useCallback(() => { setSelectedLevel(null); setGameState('selecting') }, [])
  const goToIdle    = useCallback(() => setGameState('idle'), [])
  const goToBestiary = useCallback(() => { playSelect(); setGameState('bestiary') }, [])

  const currentEnemy = enemyPool[enemyIndex % Math.max(1, enemyPool.length)] ?? null

  return (
    <div className="crt-container bg-abyss min-h-screen text-text selection:bg-cyan selection:text-abyss">
      {/* ── CRT Static Overlays ────────────────────── */}
      <div className="bg-radar-grid" />
      <div className="scanlines" aria-hidden="true" />
      <div className="crt-overlay" aria-hidden="true" />

      <div
        className={`
          relative z-10 w-full min-h-screen flex items-center justify-center px-4 py-10
          ${shake ? 'glitch-effect' : ''}
        `}
      >
        {/* ── NEW UNLOCK TOAST ─────────────────────────────────── */}
        {newUnlock && (
          <div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 panel-bevel-sm border-2 animate-bounce"
            style={{
              borderColor: newUnlock.color,
              background: '#0a0a12',
              boxShadow: `0 0 20px ${newUnlock.color}66`,
              minWidth: '280px',
              textAlign: 'center',
            }}
          >
            <p className="font-mono text-[9px] text-subtext tracking-widest uppercase mb-1">▶ Nueva entrada desbloqueada</p>
            <p
              className="font-arcade text-[10px] tracking-widest"
              style={{ color: newUnlock.color, textShadow: `0 0 8px ${newUnlock.color}` }}
            >
              {newUnlock.name}
            </p>
          </div>
        )}

        <div className="w-full max-w-xl mx-auto">
          
          {/* ─── BOOT Screen ─────────────────────────── */}
          {gameState === 'booting' && (
            <div className="boot-terminal p-8 panel-bevel border-2 border-cyan/30 ">
              <div className="flex flex-col gap-1">
                {bootLines.map((line, i) => (
                  <div key={i} className="boot-line">{line}</div>
                ))}
                <div className="cursor-block mt-2" />
              </div>
            </div>
          )}

          {/* ─── Header ───────────────────────────────────── */}
          {gameState !== 'booting' && (
            <header className="mb-4 text-center relative">
              <div className="absolute right-0 top-0 flex gap-2">
                <button
                  onClick={() => setMusicEnabled(!musicEnabled)}
                  className="bg-abyss border border-border p-1.5 panel-bevel-sm hover:border-cyan transition-colors"
                  title="Toggle Music"
                >
                  {musicEnabled ? '🔊' : '🔇'}
                </button>
              </div>
              <h1 className="font-arcade text-xs sm:text-sm text-cyan cursor-blink tracking-widest leading-loose animate-flicker">
                COLT&amp;DRILL
              </h1>
              <p className="text-[10px] text-subtext tracking-[0.4em] mt-1 font-mono uppercase opacity-70">
                Music Tactical Quiz // v1.0
              </p>
              {gameState === 'playing' && selectedTheme && selectedLevel && (
                <p className="text-[9px] text-subtext tracking-widest mt-0.5 font-mono uppercase opacity-60">
                  {selectedTheme.label} — {selectedLevel.toUpperCase()}
                </p>
              )}
              <div className="mt-3 h-px bg-border w-full" />
            </header>
          )}

          {/* ─── IDLE Screen ──────────────────────────────── */}
          {gameState === 'idle' && (
          <div className="flex flex-col items-center gap-5">
            <div className="panel-bevel bg-surface border-2 border-border p-5 text-center w-full">
              <p className="font-mono text-subtext text-xs tracking-widest leading-relaxed uppercase">
                Sistema de entrenamiento táctico
                <br />
                <span className="text-cyan">Teoría Musical</span>
                <br /><br />
                Elige tu módulo y nivel.
                <br />
                Responde con rapidez.
                <br />
                No falles.
              </p>
            </div>

            <div className="flex gap-3 w-full">
              <button
                id="enter-select-btn"
                className="arcade-btn panel-bevel-sm text-cyan border-cyan font-arcade text-[9px] py-4 flex-1"
                style={{ boxShadow: '4px 4px 0 #007755, 0 0 18px #00ffcc55' }}
                onClick={goToSelect}
              >
                ▶ SELECCIONAR MÓDULO
              </button>
              <button
                id="bestiary-btn"
                className="arcade-btn panel-bevel-sm font-arcade text-[9px] py-4 flex-1 relative"
                onClick={goToBestiary}
              >
                ◈ BESTIARIO
                <span className="absolute -top-1 -right-1 font-mono text-[8px] text-cyan bg-abyss border border-cyan px-1">
                  {unlockedEnemies.size}/{15}
                </span>
              </button>
            </div>

            {highScore > 0 && (
              <p className="font-mono text-[10px] text-subtext tracking-widest">
                RÉCORD PREVIO:{' '}
                <span className="stat-value text-xs">{String(highScore).padStart(2, '0')}</span>
              </p>
            )}
          </div>
        )}

        {/* ─── SELECTION Screen ─────────────────────────── */}
        {gameState === 'selecting' && (
          <ThemeSelector
            themes={THEMES}
            selectedTheme={selectedTheme}
            selectedLevel={selectedLevel}
            selectedSubcategory={selectedSubcategory}
            onSelectTheme={handleSelectTheme}
            onSelectLevel={handleSelectLevel}
            onSelectSubcategory={handleSelectSubcategory}
            onStart={startGame}
            highScore={highScore}
          />
        )}

        {/* ─── BESTIARY Screen ──────────────────────────── */}
        {gameState === 'bestiary' && (
          <Bestiary unlocked={unlockedEnemies} onBack={goToIdle} />
        )}

        {/* ─── PLAYING Screen ───────────────────────────── */}
        {gameState === 'playing' && questions.length > 0 && (
          <div className="flex flex-col gap-3">
            {currentEnemy && (
              <EnemyPanel
                enemy={currentEnemy}
                currentHp={enemyHp}
                maxHp={enemyMaxHp}
                hit={enemyHit}
                defeated={enemyDefeated}
              />
            )}
            <QuizCard
              key={currentIdx}
              question={questions[currentIdx]}
              questionNumber={currentIdx + 1}
              total={questions.length}
              streak={streak}
              highScore={highScore}
              onAnswer={handleAnswer}
            />
          </div>
        )}

        {/* ─── DONE Screen ──────────────────────────────── */}
        {gameState === 'done' && (
          <div className="flex flex-col items-center gap-5">
            <div
              className="panel-bevel bg-surface border-2 border-cyan p-6 text-center w-full"
              style={{ boxShadow: '0 0 24px #00ffcc44' }}
            >
              <p className="font-arcade text-[10px] text-subtext tracking-widest mb-4">
                SECUENCIA COMPLETADA
              </p>
              {selectedTheme && selectedLevel && (
                <p className="font-mono text-[9px] text-subtext tracking-widest mb-2 opacity-60">
                  {selectedTheme.label} — {selectedLevel.toUpperCase()}
                </p>
              )}
              <p className="font-arcade text-2xl text-cyan mb-2" style={{ textShadow: '0 0 16px #00ffcc' }}>
                {totalCorrect} / {questions.length}
              </p>
              <p className="font-mono text-xs text-subtext tracking-widest mt-3">
                RACHA MÁXIMA:{' '}
                <span className="stat-value text-sm">{String(highScore).padStart(2, '0')}</span>
              </p>
              <p className="font-mono text-[9px] text-subtext tracking-widest mt-2 opacity-60">
                BESTIARIO: {unlockedEnemies.size} / 15
              </p>
            </div>

            <div className="flex gap-3 w-full">
              <button
                id="restart-btn"
                className="arcade-btn panel-bevel-sm text-cyan border-cyan font-arcade text-[9px] py-4 flex-1"
                style={{ boxShadow: '4px 4px 0 #007755, 0 0 18px #00ffcc55' }}
                onClick={startGame}
              >
                ↺ REPETIR
              </button>
              <button
                id="change-module-btn"
                className="arcade-btn panel-bevel-sm font-arcade text-[9px] py-4 flex-1"
                onClick={goToSelect}
              >
                ◈ CAMBIAR MÓDULO
              </button>
              <button
                id="bestiary-done-btn"
                className="arcade-btn panel-bevel-sm font-arcade text-[9px] py-4 flex-1"
                onClick={goToBestiary}
              >
                ◈ BESTIARIO
              </button>
            </div>
          </div>
        )}

        {/* ─── Footer ───────────────────────────────────── */}
        <footer className="mt-5 text-center">
          <p className="text-[9px] text-subtext opacity-40 tracking-widest font-mono uppercase">
            Sistema activo // All systems nominal
          </p>
        </footer>
      </div>
    </div>
  </div>
  )
}
