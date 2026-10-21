import { Flame } from 'lucide-react'

interface CalorieRingProps {
  consumed: number
  goal: number
  size?: number
}

export default function CalorieRing({ consumed, goal, size = 112 }: CalorieRingProps) {
  const stroke = 11
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = goal > 0 ? Math.min(consumed / goal, 1) : 0
  const over = consumed > goal

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={over ? '#F0736B' : '#FFFFFF'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Flame className="h-7 w-7 text-white" />
      </div>
    </div>
  )
}
