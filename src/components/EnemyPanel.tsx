import { useEffect, useState } from 'react'
import type { Enemy } from '../data/enemies'

interface EnemyPanelProps {
  enemy: Enemy
  currentHp: number
  maxHp: number
  hit: boolean          // triggers the flash animation
  defeated: boolean     // shows DEFEATED overlay
}

export function EnemyPanel({ enemy, currentHp, maxHp, hit, defeated }: EnemyPanelProps) {
  const hpPct     = Math.max(0, (currentHp / maxHp) * 100)
  const hpColor   = hpPct > 50 ? '#00ffcc' : hpPct > 25 ? '#ffcc00' : '#ff0055'
  const [shake, setShake] = useState(false)

  // Trigger shake on hit
  useEffect(() => {
    if (hit) {
      setShake(true)
      const t = setTimeout(() => setShake(false), 350)
      return () => clearTimeout(t)
    }
  }, [hit])

  return (
    <div
      className="panel-bevel bg-surface border-2 p-3 w-full select-none relative overflow-hidden"
      style={{
        borderColor: enemy.color,
        boxShadow: `0 0 14px ${enemy.color}44`,
        animation: shake ? 'screenshake 0.35s ease forwards' : undefined,
      }}
    >
      {/* ── DEFEATED overlay ─────────────────────── */}
      {defeated && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-abyss/80">
          <span
            className="font-arcade text-xs text-cyan animate-pulse tracking-widest"
            style={{ textShadow: '0 0 12px #00ffcc' }}
          >
            ✓ ELIMINADO
          </span>
        </div>
      )}

      <div className="flex gap-3 items-center">
        {/* ── ASCII Art ──────────────────────────── */}
        <pre
          className="font-mono text-[10px] leading-[1.35] shrink-0"
          style={{ color: enemy.color, textShadow: `0 0 6px ${enemy.color}99` }}
          aria-hidden="true"
        >
          {enemy.ascii.join('\n')}
        </pre>

        {/* ── Info ───────────────────────────────── */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Name */}
          <div>
            <p
              className="font-arcade text-[9px] leading-tight truncate"
              style={{ color: enemy.color, textShadow: `0 0 8px ${enemy.color}` }}
            >
              {enemy.name}
            </p>
            <p className="font-mono text-[8px] text-subtext tracking-widest mt-0.5 opacity-70">
              {enemy.title}
            </p>
          </div>

          {/* HP Bar */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-mono text-[8px] text-subtext tracking-widest uppercase">HP</span>
              <span
                className="font-mono text-[9px] font-bold"
                style={{ color: hpColor }}
              >
                {currentHp} / {maxHp}
              </span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${hpPct}%`,
                  background: `linear-gradient(90deg, ${hpColor}, ${hpColor}88)`,
                  boxShadow: `0 0 6px ${hpColor}`,
                  transition: 'width 0.4s ease, background 0.4s ease',
                }}
              />
            </div>
          </div>

          {/* Damage flash text */}
          {hit && !defeated && (
            <span className="font-arcade text-[8px] text-red animate-pulse">
              ⚡ -{Math.ceil(maxHp / 3)} DMG
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
