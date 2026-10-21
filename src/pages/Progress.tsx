import { useMemo, useState, type FormEvent } from 'react'
import { useTracker } from '../context/useTracker'
import { lastNDateKeys, localDateKey } from '../lib/dates'

export default function Progress() {
  const { meals, profile, weights, logWeight } = useTracker()
  const [kg, setKg] = useState(profile?.weightKg.toString() ?? '')
  const [error, setError] = useState('')

  const days = useMemo(() => lastNDateKeys(7), [])
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

  const max = Math.max(profile?.calorieGoal ?? 1, ...daily.map((d) => d.calories), 1)
  const avg = Math.round(daily.reduce((s, d) => s + d.calories, 0) / daily.length)
  const loggedDays = daily.filter((d) => d.calories > 0).length

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
      <h1 className="text-2xl font-bold tracking-tight">Progress</h1>
      <p className="mt-1 text-sm text-neutral-500">Last 7 days of intake vs your goal.</p>

      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <section className="mt-6 grid grid-cols-2 gap-3">
        <Stat label="Avg calories" value={`${avg}`} />
        <Stat label="Days logged" value={`${loggedDays}/7`} />
      </section>

      <section className="mt-6 rounded-[28px] bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold">Calories</p>
        <div className="mt-4 flex h-40 items-end gap-2">
          {daily.map((day) => {
            const height = Math.max(6, (day.calories / max) * 100)
            const over = profile ? day.calories > profile.calorieGoal : false
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end rounded-full bg-neutral-100">
                  <div
                    className={`w-full rounded-full ${over ? 'bg-coral' : 'brand-gradient'}`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-neutral-500">
                  {day.date.slice(8)}
                </span>
              </div>
            )
          })}
        </div>
        {profile ? (
          <p className="mt-3 text-xs text-neutral-400">Goal line: {profile.calorieGoal} kcal</p>
        ) : null}
      </section>

      <section className="mt-6 rounded-[28px] bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold">Weight</p>
        <form onSubmit={onWeight} className="mt-3 flex gap-2">
          <input
            type="number"
            step="0.1"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            className="flex-1 rounded-2xl bg-neutral-100 px-3 py-2.5 text-sm outline-none"
            placeholder="kg"
          />
          <button type="submit" className="rounded-2xl brand-gradient px-4 shadow-lg shadow-coral/25 text-sm font-semibold text-white">
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
                  <span className="font-medium">{log.kg} kg</span>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-white p-4 shadow-sm">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}
