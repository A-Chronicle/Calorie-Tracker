interface MacroBarsProps {
  protein: number
  carbs: number
  fat: number
  proteinGoal: number
  carbsGoal: number
  fatGoal: number
}

function Bar({
  label,
  value,
  goal,
  color,
}: {
  label: string
  value: number
  goal: number
  color: string
}) {
  const pct = goal > 0 ? Math.min(100, (value / goal) * 100) : 0
  return (
    <div className="flex-1">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
        <p className="text-sm font-semibold text-neutral-900">
          {Math.round(value)}
          <span className="font-normal text-neutral-400">/{goal}g</span>
        </p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
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
    <div className="flex gap-4">
      <Bar label="Protein" value={protein} goal={proteinGoal} color="#e24b3b" />
      <Bar label="Carbs" value={carbs} goal={carbsGoal} color="#e8a317" />
      <Bar label="Fat" value={fat} goal={fatGoal} color="#3b82c4" />
    </div>
  )
}
