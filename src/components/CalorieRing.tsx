interface CalorieRingProps {
  consumed: number
  goal: number
}

export default function CalorieRing({ consumed, goal }: CalorieRingProps) {
  const size = 228
  const stroke = 16
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = goal > 0 ? Math.min(consumed / goal, 1) : 0
  const remaining = Math.round(goal - consumed)
  const over = remaining < 0
  const offset = circumference * (1 - ratio)

  return (
    <div className="relative mx-auto h-[228px] w-[228px]">
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#ece9e4"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={over ? '#e24b3b' : '#171717'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[44px] font-bold leading-none tracking-tight text-neutral-950">
          {Math.abs(remaining)}
        </p>
        <p className="mt-1 text-sm font-medium text-neutral-500">
          {over ? 'calories over' : 'calories left'}
        </p>
        <p className="mt-0.5 text-xs text-neutral-400">
          {Math.round(consumed)} / {goal}
        </p>
      </div>
    </div>
  )
}
