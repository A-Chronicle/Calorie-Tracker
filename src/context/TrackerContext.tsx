import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './useAuth'
import { TrackerContext, type NewMeal } from './tracker-context'
import { api, uploadPhoto } from '../lib/api'
import { localDateKey } from '../lib/dates'
import type { DailyTotals, Meal, Profile, WeightLog } from '../types'

interface DataResponse {
  profile: Profile | null
  meals: Meal[]
  weights: WeightLog[]
}

function emptyTotals(): DailyTotals {
  return { calories: 0, protein: 0, carbs: 0, fat: 0 }
}

export function TrackerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const email = user?.email ?? null
  // Keyed by email so each account mounts a fresh store and never sees another account's data.
  return (
    <TrackerStore key={email ?? ''} email={email}>
      {children}
    </TrackerStore>
  )
}

function TrackerStore({ email, children }: { email: string | null; children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [meals, setMeals] = useState<Meal[]>([])
  const [weights, setWeights] = useState<WeightLog[]>([])
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [selectedDate, setSelectedDate] = useState(localDateKey)
  const [logOpen, setLogOpen] = useState(false)

  useEffect(() => {
    if (!email) return
    let active = true
    api<DataResponse>('/data')
      .then((data) => {
        if (!active) return
        setProfile(data.profile)
        setMeals(data.meals)
        setWeights(data.weights)
        setLoaded(true)
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Could not load your data')
      })
    return () => {
      active = false
    }
  }, [email, attempt])

  const saveUserProfile = useCallback(async (next: Profile) => {
    const saved = await api<Profile>('/profile', { method: 'PUT', body: next })
    setProfile(saved)
  }, [])

  const addMeal = useCallback(async ({ photo, ...meal }: NewMeal) => {
    const photoKey = photo ? await uploadPhoto(photo) : undefined
    const created = await api<Meal>('/meals', { method: 'POST', body: { ...meal, photoKey } })
    setMeals((prev) => [created, ...prev])
  }, [])

  const deleteMeal = useCallback(async (id: string) => {
    await api(`/meals?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    setMeals((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const logWeight = useCallback(async (kg: number, date = localDateKey()) => {
    const saved = await api<WeightLog>('/weights', { method: 'PUT', body: { date, kg } })
    setWeights((prev) =>
      [...prev.filter((w) => w.date !== saved.date), saved].sort((a, b) => a.date.localeCompare(b.date)),
    )
    setProfile((prev) => (prev ? { ...prev, weightKg: kg } : prev))
  }, [])

  const dayMeals = useMemo(
    () =>
      meals
        .filter((m) => localDateKey(new Date(m.loggedAt)) === selectedDate)
        .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt)),
    [meals, selectedDate],
  )

  const totals = useMemo(
    () =>
      dayMeals.reduce<DailyTotals>(
        (acc, meal) => ({
          calories: acc.calories + meal.calories,
          protein: acc.protein + meal.protein,
          carbs: acc.carbs + meal.carbs,
          fat: acc.fat + meal.fat,
        }),
        emptyTotals(),
      ),
    [dayMeals],
  )

  const value = useMemo(
    () => ({
      profile,
      meals,
      weights,
      selectedDate,
      setSelectedDate,
      dayMeals,
      totals,
      logOpen,
      setLogOpen,
      saveUserProfile,
      addMeal,
      deleteMeal,
      logWeight,
    }),
    [
      addMeal,
      dayMeals,
      deleteMeal,
      logOpen,
      logWeight,
      meals,
      profile,
      saveUserProfile,
      selectedDate,
      totals,
      weights,
    ],
  )

  // Nothing renders until the account's data is here, so pages never mistake "not loaded yet" for "no profile".
  if (email && !loaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6f3ee] px-6">
        {loadError ? (
          <>
            <p className="text-center text-sm text-red-700">{loadError}</p>
            <button
              type="button"
              onClick={() => {
                setLoadError('')
                setAttempt((n) => n + 1)
              }}
              className="mt-4 rounded-2xl bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </>
        ) : (
          <p className="text-sm text-neutral-500">Loading your data…</p>
        )}
      </div>
    )
  }

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
}
