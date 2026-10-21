interface MacroBarsProps {
  protein: number
  carbs: number
  fat: number
  proteinGoal: number
  carbsGoal: number
  fatGoal: number
}

const TONES = {
  coral: { tile: 'bg-coral/10', text: 'text-coral', bar: 'bg-coral' },
  amber: { tile: 'bg-amber/15', text: 'text-amber', bar: 'bg-amber' },
  sky: { tile: 'bg-sky/10', text: 'text-sky', bar: 'bg-sky' },
} as const

function Tile({
  label,
  value,
  goal,
  tone,
}: {
  label: string
  value: number
  goal: number
  tone: keyof typeof TONES
}) {
  const pct = goal > 0 ? Math.min(100, (value / goal) * 100) : 0
  const colors = TONES[tone]
  return (
    <div className={`flex-1 rounded-2xl p-3 ${colors.tile}`}>
      <p className={`text-[11px] font-bold uppercase tracking-wider ${colors.text}`}>{label}</p>
      <p className="mt-1 text-lg font-bold leading-none text-ink">
        {Math.round(value)}
        <span className="text-xs font-medium text-neutral-500"> / {goal}g</span>
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/80">
        <div className={`h-full rounded-full transition-all duration-500 ${colors.bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function MacroBars({
  protein,
  carbs,
  fat,
  proteinGoal,
  carbsGoal,
  fatGoal,
}: MacroBarsProps) {
  return (
    <div className="flex gap-2.5">
      <Tile label="Protein" value={protein} goal={proteinGoal} tone="coral" />
      <Tile label="Carbs" value={carbs} goal={carbsGoal} tone="amber" />
      <Tile label="Fat" value={fat} goal={fatGoal} tone="sky" />
    </div>
  )
}
