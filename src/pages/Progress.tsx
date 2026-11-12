import { useMemo, useState, type FormEvent } from 'react'
import { useTracker } from '../context/useTracker'
import { lastNDateKeys, localDateKey } from '../lib/dates'

type Range = 7 | 30

export default function Progress() {
  const { meals, profile, weights, logWeight } = useTracker()
  const [kg, setKg] = useState(profile?.weightKg.toString() ?? '')
  const [range, setRange] = useState<Range>(7)
  const [error, setError] = useState('')

  const days = useMemo(() => lastNDateKeys(range, localDateKey()), [range])
  const daily = useMemo(
    () =>
      days.map((date) => ({
        date,
        calories: meals
          .filter((m) => localDateKey(new Date(m.loggedAt)) === date)
          .reduce((sum, m) => sum + m.calories, 0),
      })),
    [days, meals],
  )

  const goal = profile?.calorieGoal ?? 0
  const max = Math.max(goal, ...daily.map((d) => d.calories), 1)
  const loggedDays = daily.filter((d) => d.calories > 0).length
  const totalCalories = daily.reduce((s, d) => s + d.calories, 0)
  const avg = loggedDays ? Math.round(totalCalories / loggedDays) : 0
  const latestWeight = weights.at(-1)?.kg ?? profile?.weightKg

  async function onWeight(e: FormEvent) {
    e.preventDefault()
    setError('')
    const value = Number(kg)
    if (!value) return
    try {
      await logWeight(value)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your weight')
    }
  }

  const recentWeights = weights.slice(-7)

  return (
    <main className="px-5 pb-8 pt-7">
      <p className="text-sm font-medium text-white/50">Your journey</p>
      <h1 className="text-3xl font-extrabold tracking-tight">Progress</h1>

      {error ? (
        <p className="mt-4 rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>
      ) : null}

      <section className="mt-6 grid grid-cols-2 gap-3">
        <MetricCard
          label="Avg calories"
          value={`${avg}`}
          sub="kcal per logged day"
          fraction={goal ? Math.min(avg / goal, 1) : 0}
          from="#b8735f"
          to="#c9a87c"
        />
        <MetricCard
          label="Days logged"
          value={`${loggedDays}/${range}`}
          sub={latestWeight ? `Last weight ${latestWeight} kg` : 'No weight yet'}
          fraction={range ? loggedDays / range : 0}
          from="#7fa08a"
          to="#7d94b0"
        />
      </section>

      <div className="glass mt-5 flex rounded-full p-1">
        {([7, 30] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRange(value)}
            className={`flex-1 rounded-full py-2 text-sm font-bold transition-all ${
              range === value ? 'brand-gradient text-white shadow-lg shadow-coral/25' : 'text-white/50 hover:text-white'
            }`}
          >
            {value} Days
          </button>
        ))}
      </div>

      <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-panel p-5">
        <div className="flex items-center justify-between">
          <p className="font-bold">Calories</p>
          {goal ? (
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/70">Goal {goal}</span>
          ) : null}
        </div>
        <div className="mt-5 flex h-44 items-end gap-1.5">
          {daily.map((day) => {
            const height = day.calories > 0 ? Math.max(4, (day.calories / max) * 100) : 0
            const over = goal > 0 && day.calories > goal
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-36 w-full items-end">
                  <div
                    className={`w-full rounded-full transition-[height] duration-700 ${
                      over ? 'bg-[linear-gradient(180deg,#b8735f,#c9a87c)]' : 'bg-[linear-gradient(180deg,#7fa08a,#7d94b0)]'
                    }`}
                    style={{ height: `${height}%` }}
                    title={`${day.date}: ${day.calories} kcal`}
                  />
                </div>
                {range === 7 || day.date.endsWith('01') || day.date.endsWith('15') ? (
                  <span className="text-[10px] font-semibold text-white/40">{day.date.slice(8)}</span>
                ) : (
                  <span className="text-[10px]" aria-hidden="true">&nbsp;</span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-panel p-5">
        <p className="font-bold">Weight</p>
        <form onSubmit={onWeight} className="mt-3 flex gap-2">
          <input
            type="number"
            step="0.1"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            className="field text-sm"
            placeholder="kg"
          />
          <button type="submit" className="brand-gradient shrink-0 rounded-2xl px-5 text-sm font-bold text-white shadow-lg shadow-coral/25">
            Save
          </button>
        </form>
        {recentWeights.length ? (
          <ul className="mt-4 divide-y divide-white/[0.06]">
            {recentWeights
              .slice()
              .reverse()
              .map((log) => (
                <li key={log.date} className="flex justify-between py-2.5 text-sm">
                  <span className="text-white/45">{log.date}</span>
                  <span className="font-bold">{log.kg} kg</span>
                </li>
              ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-white/40">No weigh-ins yet.</p>
        )}
      </section>
    </main>
  )
}

function MetricCard({
  label,
  value,
  sub,
  fraction,
  from,
  to,
}: {
  label: string
  value: string
  sub: string
  fraction: number
  from: string
  to: string
}) {
  const size = 72
  const stroke = 8
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const id = `metric-${label.replace(/\s+/g, '-')}`

  return (
    <div className="rounded-[24px] border border-white/[0.07] bg-panel p-4">
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <defs>
            <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${id})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - Math.min(fraction, 1))}
            className="transition-[stroke-dashoffset] duration-700"
          />
        </svg>
      </div>
      <p className="mt-3 text-center text-xs font-semibold text-white/50">{label}</p>
      <p className="mt-0.5 text-center text-2xl font-extrabold">{value}</p>
      <p className="mt-1 text-center text-[11px] text-white/35">{sub}</p>
    </div>
  )
}
