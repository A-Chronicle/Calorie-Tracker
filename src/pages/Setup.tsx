import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useTracker } from '../context/useTracker'
import { buildGoals } from '../lib/tdee'
import type { ActivityLevel, Goal, Sex } from '../types'

export default function Setup() {
  const { user, ready } = useAuth()
  const { profile, saveUserProfile } = useTracker()
  const navigate = useNavigate()
  const [preview, setPreview] = useState<number>()
  const [error, setError] = useState('')

  if (!ready) return null
  if (!user) return <Navigate to="/signin" replace />
  if (profile) return <Navigate to="/dashboard" replace />

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const data = new FormData(e.currentTarget)
    const sex = String(data.get('sex')) as Sex
    const activity = String(data.get('activity')) as ActivityLevel
    const goal = String(data.get('goal')) as Goal
    const age = Number(data.get('age'))
    const heightCm = Number(data.get('heightCm'))
    const weightKg = Number(data.get('weightKg'))
    const goals = buildGoals({ sex, age, heightCm, weightKg, activity, goal })
    try {
      await saveUserProfile({ sex, age, heightCm, weightKg, activity, goal, ...goals })
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your goals')
    }
  }

  function onChange(e: FormEvent<HTMLFormElement>) {
    const data = new FormData(e.currentTarget)
    const age = Number(data.get('age'))
    const heightCm = Number(data.get('heightCm'))
    const weightKg = Number(data.get('weightKg'))
    if (!age || !heightCm || !weightKg) return
    const goals = buildGoals({
      sex: String(data.get('sex')) as Sex,
      age,
      heightCm,
      weightKg,
      activity: String(data.get('activity')) as ActivityLevel,
      goal: String(data.get('goal')) as Goal,
    })
    setPreview(goals.calorieGoal)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">Almost there</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Set your daily target</h1>
      <p className="mt-2 text-sm text-neutral-500">
        We’ll estimate calories from your stats, the same way Cal AI starts with a personal goal.
      </p>

      <form onSubmit={onSubmit} onChange={onChange} className="mt-8 space-y-4">
        <label className="block text-sm font-medium">
          Sex
          <select name="sex" className="mt-1 w-full rounded-2xl bg-white px-3 py-2.5 outline-none ring-1 ring-black/5">
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          Age
          <input name="age" type="number" required min={13} className="mt-1 w-full rounded-2xl bg-white px-3 py-2.5 outline-none ring-1 ring-black/5" />
        </label>
        <label className="block text-sm font-medium">
          Height (cm)
          <input name="heightCm" type="number" required min={100} className="mt-1 w-full rounded-2xl bg-white px-3 py-2.5 outline-none ring-1 ring-black/5" />
        </label>
        <label className="block text-sm font-medium">
          Weight (kg)
          <input name="weightKg" type="number" step="0.1" required min={30} className="mt-1 w-full rounded-2xl bg-white px-3 py-2.5 outline-none ring-1 ring-black/5" />
        </label>
        <label className="block text-sm font-medium">
          Activity
          <select name="activity" defaultValue="moderate" className="mt-1 w-full rounded-2xl bg-white px-3 py-2.5 outline-none ring-1 ring-black/5">
            <option value="sedentary">Mostly sitting</option>
            <option value="light">Light exercise 1–3 days</option>
            <option value="moderate">Exercise 3–5 days</option>
            <option value="active">Hard exercise 6–7 days</option>
            <option value="very_active">Physical job + training</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          Goal
          <select name="goal" defaultValue="lose" className="mt-1 w-full rounded-2xl bg-white px-3 py-2.5 outline-none ring-1 ring-black/5">
            <option value="lose">Lose fat</option>
            <option value="maintain">Maintain</option>
            <option value="gain">Build muscle</option>
          </select>
        </label>

        {preview ? (
          <p className="rounded-2xl bg-white px-4 py-3 text-sm">
            Suggested target: <span className="font-bold">{preview} kcal/day</span>
          </p>
        ) : null}

        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <button type="submit" className="w-full rounded-2xl bg-neutral-950 py-3 text-sm font-semibold text-white">
          Start tracking
        </button>
      </form>
    </div>
  )
}
