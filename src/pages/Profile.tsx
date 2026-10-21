import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useTracker } from '../context/useTracker'
import { buildGoals } from '../lib/tdee'
import type { ActivityLevel, Goal, Sex } from '../types'

export default function Profile() {
  const { user, signOut } = useAuth()
  const { profile, saveUserProfile } = useTracker()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  if (!profile) return null

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSaved(false)
    const data = new FormData(e.currentTarget)
    const sex = String(data.get('sex')) as Sex
    const activity = String(data.get('activity')) as ActivityLevel
    const goal = String(data.get('goal')) as Goal
    const next = {
      sex,
      age: Number(data.get('age')),
      heightCm: Number(data.get('heightCm')),
      weightKg: Number(data.get('weightKg')),
      activity,
      goal,
      ...buildGoals({
        sex,
        age: Number(data.get('age')),
        heightCm: Number(data.get('heightCm')),
        weightKg: Number(data.get('weightKg')),
        activity,
        goal,
      }),
    }
    try {
      await saveUserProfile(next)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your goals')
    }
  }

  async function handleSignOut() {
    try {
      await signOut()
    } catch {
      /* Session is cleared locally even if the server call failed. */
    }
    navigate('/signin')
  }

  return (
    <main className="px-5 pb-8 pt-8">
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-neutral-500">{user?.email}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-[28px] bg-white p-5 shadow-sm">
        <Select name="sex" label="Sex" defaultValue={profile.sex} options={[['female', 'Female'], ['male', 'Male']]} />
        <NumberField name="age" label="Age" defaultValue={profile.age} />
        <NumberField name="heightCm" label="Height (cm)" defaultValue={profile.heightCm} />
        <NumberField name="weightKg" label="Weight (kg)" defaultValue={profile.weightKg} step="0.1" />
        <Select
          name="activity"
          label="Activity"
          defaultValue={profile.activity}
          options={[
            ['sedentary', 'Sedentary'],
            ['light', 'Light'],
            ['moderate', 'Moderate'],
            ['active', 'Active'],
            ['very_active', 'Very active'],
          ]}
        />
        <Select
          name="goal"
          label="Goal"
          defaultValue={profile.goal}
          options={[
            ['lose', 'Lose fat'],
            ['maintain', 'Maintain'],
            ['gain', 'Build muscle'],
          ]}
        />
        <p className="text-xs text-neutral-500">
          Current targets: {profile.calorieGoal} kcal · {profile.proteinGoal}g protein
        </p>
        <button type="submit" className="w-full rounded-2xl bg-neutral-950 py-3 text-sm font-semibold text-white">
          Recalculate goals
        </button>
        {saved ? <p className="text-center text-sm text-emerald-600">Goals updated</p> : null}
        {error ? <p className="text-center text-sm text-red-700">{error}</p> : null}
      </form>

      <button
        type="button"
        onClick={handleSignOut}
        className="mt-6 w-full rounded-2xl bg-white py-3 text-sm font-semibold text-neutral-700 shadow-sm"
      >
        Sign out
      </button>
    </main>
  )
}

function NumberField({
  name,
  label,
  defaultValue,
  step,
}: {
  name: string
  label: string
  defaultValue: number
  step?: string
}) {
  return (
    <label className="block text-xs font-medium text-neutral-500">
      {label}
      <input
        name={name}
        type="number"
        step={step}
        required
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-2xl bg-[#f6f3ee] px-3 py-2.5 text-sm text-neutral-950 outline-none"
      />
    </label>
  )
}

function Select({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string
  label: string
  defaultValue: string
  options: [string, string][]
}) {
  return (
    <label className="block text-xs font-medium text-neutral-500">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-2xl bg-[#f6f3ee] px-3 py-2.5 text-sm text-neutral-950 outline-none"
      >
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </label>
  )
}
