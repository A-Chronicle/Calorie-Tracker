import { useId } from 'react'
import { Flame } from 'lucide-react'

interface CalorieRingProps {
  consumed: number
  goal: number
  size?: number
}

export default function CalorieRing({ consumed, goal, size = 132 }: CalorieRingProps) {
  const id = useId()
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = goal > 0 ? Math.min(consumed / goal, 1) : 0

  return (
    <div className="relative shrink-0 animate-float" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)]" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e9e5dd" />
            <stop offset="100%" stopColor="#c8a878" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <Flame className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}
