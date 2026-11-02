import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useTracker } from '../context/useTracker'
import CalorieRing from '../components/CalorieRing'
import MacroBars from '../components/MacroBars'
import MealCard from '../components/MealCard'
import { formatDayHeading, localDateKey, shiftDateKey } from '../lib/dates'
import { MEAL_EMOJI } from '../lib/meals'
import type { MealType } from '../types'

const ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

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
  const firstName = user?.name.split(' ')[0]

  const grouped = ORDER.map((type) => {
    const meals = dayMeals.filter((m) => m.mealType === type)
    return {
      type,
      meals,
      calories: Math.round(meals.reduce((sum, m) => sum + m.calories, 0)),
    }
  }).filter((g) => g.meals.length)

  return (
    <main className="px-5 pb-8 pt-7">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/50">{greeting()}</p>
          <h1 className="truncate text-2xl font-extrabold tracking-tight">{firstName} 👋</h1>
        </div>
        <div className="brand-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-black text-white shadow-lg shadow-coral/30">
          {firstName?.charAt(0).toUpperCase()}
        </div>
      </header>

      <div className="glass mt-5 flex items-center justify-between rounded-full p-1.5">
        <button
          type="button"
          className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          onClick={() => setSelectedDate(shiftDateKey(selectedDate, -1))}
          aria-label="Previous day"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-bold">{formatDayHeading(selectedDate)}</p>
        <button
          type="button"
          className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-25"
          onClick={() => setSelectedDate(shiftDateKey(selectedDate, 1))}
          disabled={selectedDate >= localDateKey()}
          aria-label="Next day"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>
      ) : null}

      <section className="relative mt-5 overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#ff5a4e_0%,#ff8a3d_45%,#7c5cff_100%)] p-6 text-white shadow-2xl shadow-coral/25 animate-rise">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
              {over ? 'Over goal' : 'Left today'}
            </p>
            <p className="mt-1 text-6xl font-black leading-none tracking-tight">{Math.abs(remaining)}</p>
            <p className="mt-2 text-sm font-medium text-white/80">
              {Math.round(totals.calories)} / {profile.calorieGoal} kcal
            </p>
          </div>
          <CalorieRing consumed={totals.calories} goal={profile.calorieGoal} />
        </div>

        <div className="relative mt-6">
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

      <section className="mt-9">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Today&apos;s meals</h2>
            <p className="text-xs font-medium text-white/40">
              {dayMeals.length} logged
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLogOpen(true)}
            className="glass flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        {dayMeals.length === 0 ? (
          <button
            type="button"
            onClick={() => setLogOpen(true)}
            className="group mt-5 flex w-full flex-col items-center rounded-[28px] border border-dashed border-white/15 bg-white/[0.03] px-6 py-10 text-center transition-colors hover:border-coral/50 hover:bg-coral/5"
          >
            <span className="animate-float text-5xl">📸</span>
            <p className="mt-4 text-lg font-bold">Log your first meal</p>
            <p className="mt-1 max-w-[16rem] text-sm text-white/50">
              Snap a photo, search the food library, or type it in. We&apos;ll do the math.
            </p>
            <span className="brand-gradient mt-5 rounded-full px-5 py-2 text-sm font-bold text-white shadow-lg shadow-coral/30 transition-transform group-hover:scale-105">
              Get started
            </span>
          </button>
        ) : (
          <div className="mt-5 space-y-6">
            {grouped.map((group) => (
              <div key={group.type}>
                <div className="mb-2.5 flex items-center justify-between px-1">
                  <p className="flex items-center gap-2 text-sm font-bold capitalize text-white/90">
                    <span>{MEAL_EMOJI[group.type]}</span>
                    {group.type}
                  </p>
                  <span className="text-xs font-semibold text-white/40">{group.calories} kcal</span>
                </div>
                <div className="space-y-2.5">
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
