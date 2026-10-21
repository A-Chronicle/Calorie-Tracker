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
    <main className="px-5 pb-8 pt-8">
      <h1 className="text-3xl font-bold tracking-tight">Progress</h1>

      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <section className="mt-6 grid grid-cols-2 gap-3">
        <MetricCard
          label="Avg calories"
          value={`${avg}`}
          sub="kcal per logged day"
          fraction={goal ? Math.min(avg / goal, 1) : 0}
        />
        <MetricCard
          label="Days logged"
          value={`${loggedDays}/${range}`}
          sub={latestWeight ? `Last weight ${latestWeight} kg` : 'No weight yet'}
          fraction={range ? loggedDays / range : 0}
        />
      </section>

      <div className="mt-6 flex rounded-full bg-white p-1 shadow-sm">
        {([7, 30] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRange(value)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
              range === value ? 'bg-ink text-white' : 'text-neutral-500'
            }`}
          >
            {value} Days
          </button>
        ))}
      </div>

      <section className="mt-4 rounded-[28px] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-bold">Calories</p>
          {goal ? <p className="text-xs font-semibold text-neutral-500">Goal {goal} kcal</p> : null}
        </div>
        <div className="mt-5 flex h-44 items-end gap-1.5">
          {daily.map((day) => {
            const height = day.calories > 0 ? Math.max(4, (day.calories / max) * 100) : 0
            const over = goal > 0 && day.calories > goal
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-36 w-full items-end">
                  <div
                    className={`w-full rounded-full ${over ? 'bg-coral' : 'bg-ink'}`}
                    style={{ height: `${height}%` }}
                    title={`${day.date}: ${day.calories} kcal`}
                  />
                </div>
                {range === 7 || day.date.endsWith('01') || day.date.endsWith('15') ? (
                  <span className="text-[10px] font-medium text-neutral-500">{day.date.slice(8)}</span>
                ) : (
                  <span className="text-[10px]" aria-hidden="true">&nbsp;</span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-4 rounded-[28px] bg-white p-5 shadow-sm">
        <p className="font-bold">Weight</p>
        <form onSubmit={onWeight} className="mt-3 flex gap-2">
          <input
            type="number"
            step="0.1"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            className="flex-1 rounded-2xl bg-neutral-100 px-3 py-2.5 text-sm outline-none"
            placeholder="kg"
          />
          <button type="submit" className="rounded-2xl bg-ink px-5 text-sm font-semibold text-white">
            Save
          </button>
        </form>
        {recentWeights.length ? (
          <ul className="mt-4 space-y-2">
            {recentWeights
              .slice()
              .reverse()
              .map((log) => (
                <li key={log.date} className="flex justify-between text-sm">
                  <span className="text-neutral-500">{log.date}</span>
                  <span className="font-semibold">{log.kg} kg</span>
                </li>
              ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-neutral-400">No weigh-ins yet.</p>
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
}: {
  label: string
  value: string
  sub: string
  fraction: number
}) {
  const size = 64
  const stroke = 7
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div className="rounded-[24px] bg-white p-4 shadow-sm">
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EDEDF0" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1C1C1E"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - Math.min(fraction, 1))}
            className="transition-[stroke-dashoffset] duration-500"
          />
        </svg>
      </div>
      <p className="mt-3 text-center text-xs font-medium text-neutral-500">{label}</p>
      <p className="mt-0.5 text-center text-xl font-bold">{value}</p>
      <p className="mt-1 text-center text-[11px] text-neutral-400">{sub}</p>
    </div>
  )
}
