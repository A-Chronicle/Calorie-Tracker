import { Droplet, Wheat, Zap, type LucideIcon } from 'lucide-react'

interface MacroBarsProps {
  protein: number
  carbs: number
  fat: number
  proteinGoal: number
  carbsGoal: number
  fatGoal: number
}

const PROTEIN = '#F0736B'
const CARBS = '#F2A65A'
const FAT = '#5C8DF6'

function MacroRing({
  label,
  value,
  goal,
  color,
  Icon,
}: {
  label: string
  value: number
  goal: number
  color: string
  Icon: LucideIcon
}) {
  const size = 58
  const stroke = 6
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = goal > 0 ? Math.min(value / goal, 1) : 0
  const diff = Math.round(goal - value)
  const over = diff < 0

  return (
    <div className="flex flex-1 flex-col items-center rounded-3xl bg-white/[0.07] px-2 py-3">
      <p className="text-base font-bold text-white">
        {Math.abs(diff)}g
      </p>
      <p className="text-[11px] font-medium text-white/60">
        {label} {over ? <span className="font-bold text-white">over</span> : 'left'}
      </p>
      <div className="relative mt-2" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - ratio)}
            className="transition-[stroke-dashoffset] duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
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
      <MacroRing label="Protein" value={protein} goal={proteinGoal} color={PROTEIN} Icon={Zap} />
      <MacroRing label="Carbs" value={carbs} goal={carbsGoal} color={CARBS} Icon={Wheat} />
      <MacroRing label="Fats" value={fat} goal={fatGoal} color={FAT} Icon={Droplet} />
    </div>
  )
}
