interface CalorieRingProps {
  consumed: number
  goal: number
}

export default function CalorieRing({ consumed, goal }: CalorieRingProps) {
  const size = 228
  const stroke = 18
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = goal > 0 ? Math.min(consumed / goal, 1) : 0
  const remaining = Math.round(goal - consumed)
  const over = remaining < 0
  const offset = circumference * (1 - ratio)

  return (
    <div className="relative mx-auto h-[228px] w-[228px]">
      <svg width={size} height={size} className="-rotate-90 drop-shadow-[0_0_18px_rgba(255,90,78,0.45)]" aria-hidden="true">
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5a4e" />
            <stop offset="100%" stopColor="#ffb020" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={over ? '#ff3b30' : 'url(#ring-gradient)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <p className="text-[46px] font-bold leading-none tracking-tight">{Math.abs(remaining)}</p>
        <p className="mt-1 text-sm font-semibold text-white/70">{over ? 'kcal over' : 'kcal left'}</p>
        <p className="mt-2 rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium text-white/80">
          {Math.round(consumed)} / {goal}
        </p>
      </div>
    </div>
  )
}
