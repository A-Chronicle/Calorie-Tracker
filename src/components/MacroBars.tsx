import { Droplet, Wheat, Zap, type LucideIcon } from 'lucide-react'

interface MacroBarsProps {
  protein: number
  carbs: number
  fat: number
  proteinGoal: number
  carbsGoal: number
  fatGoal: number
}

function MacroTile({
  label,
  value,
  goal,
  Icon,
}: {
  label: string
  value: number
  goal: number
  Icon: LucideIcon
}) {
  const ratio = goal > 0 ? Math.min(value / goal, 1) : 0
  const diff = Math.round(goal - value)
  const over = diff < 0

  return (
    <div className="flex-1 rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-white/80">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1.5 text-lg font-bold leading-none text-white">
        {Math.round(value)}
        <span className="text-xs font-semibold text-white/60">g</span>
      </p>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white transition-[width] duration-700 ease-out"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <p className="mt-1.5 text-[11px] font-medium text-white/70">
        {over ? `${Math.abs(diff)}g over` : `${diff}g left`}
      </p>
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
    <div className="flex gap-2">
      <MacroTile label="Protein" value={protein} goal={proteinGoal} Icon={Zap} />
      <MacroTile label="Carbs" value={carbs} goal={carbsGoal} Icon={Wheat} />
      <MacroTile label="Fats" value={fat} goal={fatGoal} Icon={Droplet} />
    </div>
  )
}
