import { useState, useEffect } from 'react'
import { ENEMIES } from '../data/enemies'
import { 
  startBestiaryJam, stopBestiaryJam, toggleTrack, isTrackActive, playSelect 
} from '../lib/sounds'
import type { Enemy } from '../data/enemies'

interface BestiaryProps {
  unlocked: Set<string>
  onBack: () => void
}

export function Bestiary({ unlocked, onBack }: BestiaryProps) {
  const [jamming, setJamming] = useState(false)
  const [activeTracksCount, setActiveTracksCount] = useState(0)

  const total = ENEMIES.length
  const found = unlocked.size

  useEffect(() => {
    // Sync active tracks count on mount
    let count = 0
    ENEMIES.forEach(e => {
      if (isTrackActive(e.id)) count++
    })
    setActiveTracksCount(count)

    return () => {
      stopBestiaryJam()
    }
  }, [])

  const handleToggleJam = () => {
    if (jamming) {
      stopBestiaryJam()
      setJamming(false)
    } else {
      startBestiaryJam()
      setJamming(true)
    }
    playSelect()
  }

  const handleUpdate = () => {
    let count = 0
    ENEMIES.forEach(e => {
      if (isTrackActive(e.id)) count++
    })
    setActiveTracksCount(count)
  }

  const handleBack = () => {
    stopBestiaryJam()
    onBack()
  }

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* ── Header ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-arcade text-[9px] text-cyan tracking-widest"
             style={{ textShadow: '0 0 8px #00ffcc' }}>
            BESTIARIO
          </p>
          <p className="font-mono text-[9px] text-subtext tracking-widest mt-0.5">
            {found} / {total} REGISTROS
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className={`panel-bevel-sm font-arcade text-[8px] px-3 py-2 transition-all ${
              jamming ? 'bg-cyan text-abyss border-cyan' : 'bg-abyss text-cyan border-cyan/50'
            }`}
            onClick={handleToggleJam}
            style={jamming ? { boxShadow: '0 0 15px #00ffcc' } : {}}
          >
            {jamming ? '■ STOP JAM' : '▶ START JAM'}
          </button>
          <button
            className="arcade-btn panel-bevel-sm font-mono text-[9px] px-4 py-2"
            onClick={handleBack}
          >
            ← VOLVER
          </button>
        </div>
      </div>

      {/* ── Progress bar ───────────────────────── */}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${(found / total) * 100}%` }}
        />
      </div>
      
      {jamming && (
        <div className="flex items-center justify-between px-1">
          <p className="font-mono text-[8px] text-cyan animate-pulse">
            SISTEMA DE COMPOSICIÓN ACTIVO: {activeTracksCount} PISTAS
          </p>
          <div className="flex gap-1">
             {[...Array(8)].map((_, i) => (
               <div 
                 key={i} 
                 className="w-1 h-3 bg-cyan/40"
                 style={{ animation: `jiggle 0.5s infinite ${i * 0.1}s` }}
               />
             ))}
          </div>
        </div>
      )}

      <div className="h-px bg-border w-full" />

      {/* ── Enemy Grid ─────────────────────────── */}
      <div
        className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 pb-4"
        style={{ maxHeight: '60vh' }}
      >
        {ENEMIES.map((enemy, i) => {
          const isUnlocked = unlocked.has(enemy.id)
          return (
            <BestiaryCard
              key={enemy.id}
              enemy={enemy}
              index={i}
              isUnlocked={isUnlocked}
              onUpdate={handleUpdate}
            />
          )
        })}
      </div>
    </div>
  )
}

/* ── Individual card ────────────────────────────────────────── */

function BestiaryCard({
  enemy,
  index,
  isUnlocked,
  onUpdate,
}: {
  enemy: Enemy
  index: number
  isUnlocked: boolean
  onUpdate: () => void
}) {
  const [active, setActive] = useState(() => isTrackActive(enemy.id))

  const handleToggle = () => {
    const newState = !active
    setActive(newState)
    toggleTrack(enemy.id, newState)
    playSelect()
    onUpdate()
  }

  if (!isUnlocked) {
    return (
      <div
        className="panel-bevel-sm bg-surface border-2 border-border p-3 flex flex-col gap-2 opacity-60"
      >
        {/* Silhouette ASCII */}
        <pre
          className="font-mono text-[9px] leading-[1.3] text-border select-none"
          aria-hidden="true"
        >
          {enemy.ascii.map((line) =>
            line.replace(/[^\s]/g, '█')
          ).join('\n')}
        </pre>
        <div>
          <p className="font-arcade text-[8px] text-subtext tracking-wider">???</p>
          <p className="font-mono text-[7px] text-subtext opacity-50 mt-0.5 tracking-widest">
            #{String(index + 1).padStart(3, '0')} — BLOQUEADO
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="panel-bevel-sm bg-surface border-2 p-3 flex flex-col gap-2 relative group"
      style={{
        borderColor: enemy.color,
        boxShadow: active ? `0 0 15px ${enemy.color}66` : `0 0 5px ${enemy.color}22`,
      }}
    >
      {/* ASCII art */}
      <pre
        className="font-mono text-[9px] leading-[1.3] select-none"
        style={{ color: enemy.color, textShadow: `0 0 4px ${enemy.color}88` }}
        aria-hidden="true"
      >
        {enemy.ascii.join('\n')}
      </pre>

      {/* Info */}
      <div className="flex-1">
        <p
          className="font-arcade text-[7px] leading-tight tracking-wider truncate"
          style={{ color: enemy.color }}
        >
          {enemy.name}
        </p>
        <p className="font-mono text-[7px] text-subtext opacity-70 mt-0.5 tracking-widest">
          #{String(index + 1).padStart(3, '0')} {enemy.title}
        </p>
        <p className="font-mono text-[7px] text-subtext opacity-50 mt-1 leading-tight">
          {enemy.lore}
        </p>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
        <p className="font-mono text-[6px] tracking-widest uppercase opacity-60">HP: {enemy.baseHp}</p>
        <button
          onClick={handleToggle}
          className={`px-2 py-1 font-arcade text-[6px] border transition-all ${
            active 
              ? 'bg-[var(--accent)] text-abyss border-transparent' 
              : 'bg-transparent text-subtext border-subtext/30 hover:border-text'
          }`}
          style={{ 
            '--accent': enemy.color,
            boxShadow: active ? `0 0 8px ${enemy.color}` : 'none'
          } as React.CSSProperties}
        >
          {active ? '🔉 ON' : '🔈 OFF'}
        </button>
      </div>
    </div>
  )
}
