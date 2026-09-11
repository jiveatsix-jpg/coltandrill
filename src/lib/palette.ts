// Same neon accent palette already used per-enemy in data/enemies.ts —
// reused here so modules get their own identity color the same way.
const ACCENT_COLORS = [
  '#ff0055', '#cc00ff', '#aaaaff', '#ffaa00', '#ff6600',
  '#00aaff', '#ff44aa', '#00ffaa', '#44ff44', '#ffff00', '#ff8800',
]

export function colorForId(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0
  }
  return ACCENT_COLORS[Math.abs(hash) % ACCENT_COLORS.length]
}
