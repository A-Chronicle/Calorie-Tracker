import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useTracker } from '../context/useTracker'
import CalorieRing from '../components/CalorieRing'
import MacroBars from '../components/MacroBars'
import MealCard from '../components/MealCard'
import { formatDayHeading, localDateKey, shiftDateKey } from '../lib/dates'
import type { MealType } from '../types'

const ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

export default function Dashboard() {
  const { user } = useAuth()
  const { profile, selectedDate, setSelectedDate, dayMeals, totals, deleteMeal, setLogOpen } =
    useTracker()

  const [error, setError] = useState('')

  if (!profile) return null

  async function removeMeal(id: string) {
    setError('')
    try {
      await deleteMeal(id)
    } catch {
      setError('Could not delete that meal. Try again.')
    }
  }

  const remaining = Math.round(profile.calorieGoal - totals.calories)
  const over = remaining < 0

  const grouped = ORDER.map((type) => ({
    type,
    meals: dayMeals.filter((m) => m.mealType === type),
  })).filter((g) => g.meals.length)

  return (
    <main className="px-5 pb-8 pt-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-sm font-extrabold text-white">
            C
          </div>
          <p className="text-lg font-bold tracking-tight">CAL-c</p>
        </div>
        <p className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-600 shadow-sm">
          Hi, {user?.name.split(' ')[0]}
        </p>
      </header>

      <div className="mt-6 flex items-center gap-2">
        <button
          type="button"
          className="rounded-full bg-white p-1.5 shadow-sm hover:bg-neutral-100"
          onClick={() => setSelectedDate(shiftDateKey(selectedDate, -1))}
          aria-label="Previous day"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="min-w-[110px] text-center text-base font-bold">{formatDayHeading(selectedDate)}</p>
        <button
          type="button"
          className="rounded-full bg-white p-1.5 shadow-sm hover:bg-neutral-100 disabled:opacity-30"
          onClick={() => setSelectedDate(shiftDateKey(selectedDate, 1))}
          disabled={selectedDate >= localDateKey()}
          aria-label="Next day"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <section className="mt-5 rounded-[32px] bg-[#1C1C1E] p-5 text-white shadow-xl shadow-ink/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-5xl font-bold tracking-tight">{Math.abs(remaining)}</p>
            <p className="mt-1 text-sm font-medium text-white/60">{over ? 'Calories over' : 'Calories left'}</p>
          </div>
          <CalorieRing consumed={totals.calories} goal={profile.calorieGoal} />
        </div>
        <p className="mt-3 text-xs text-white/50">
          {Math.round(totals.calories)} of {profile.calorieGoal} kcal eaten
        </p>

        <div className="mt-5">
          <MacroBars
            protein={totals.protein}
            carbs={totals.carbs}
            fat={totals.fat}
            proteinGoal={profile.proteinGoal}
            carbsGoal={profile.carbsGoal}
            fatGoal={profile.fatGoal}
          />
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Meals</h2>
          <button
            type="button"
            onClick={() => setLogOpen(true)}
            className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-ink/20"
          >
            Add
          </button>
        </div>

        {dayMeals.length === 0 ? (
          <button
            type="button"
            onClick={() => setLogOpen(true)}
            className="mt-4 w-full rounded-3xl border border-dashed border-neutral-300 bg-white/60 px-6 py-10 text-center"
          >
            <p className="font-semibold text-neutral-800">Snap your first meal</p>
            <p className="mt-1 text-sm text-neutral-500">
              Photo, search, or type — we estimate calories and macros.
            </p>
          </button>
        ) : (
          <div className="mt-4 space-y-5">
            {grouped.map((group) => (
              <div key={group.type}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {group.type}
                </p>
                <div className="space-y-2">
                  {group.meals.map((meal) => (
                    <MealCard key={meal.id} meal={meal} onDelete={removeMeal} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
