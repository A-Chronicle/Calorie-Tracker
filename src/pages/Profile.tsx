import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
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

  const initial = user?.name.charAt(0).toUpperCase()

  return (
    <main className="px-5 pb-8 pt-7">
      <div className="flex items-center gap-4">
        <div className="brand-gradient flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl text-2xl font-black text-white shadow-xl shadow-coral/30">
          {initial}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-extrabold tracking-tight">{user?.name}</h1>
          <p className="truncate text-sm text-white/50">{user?.email}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2.5">
        <Stat label="Calories" value={profile.calorieGoal} unit="kcal" />
        <Stat label="Protein" value={profile.proteinGoal} unit="g" />
        <Stat label="Weight" value={profile.weightKg} unit="kg" />
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-4 rounded-[28px] border border-white/[0.07] bg-panel p-5">
        <div className="flex items-center justify-between">
          <p className="font-bold">Your stats</p>
          <span className="text-xs font-semibold text-white/40">Targets update on save</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select name="sex" label="Sex" defaultValue={profile.sex} options={[['female', 'Female'], ['male', 'Male']]} />
          <NumberField name="age" label="Age" defaultValue={profile.age} />
          <NumberField name="heightCm" label="Height (cm)" defaultValue={profile.heightCm} />
          <NumberField name="weightKg" label="Weight (kg)" defaultValue={profile.weightKg} step="0.1" />
        </div>
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

        {error ? (
          <p className="rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-center text-sm text-coral">{error}</p>
        ) : null}
        {saved ? (
          <p className="rounded-2xl border border-mint/30 bg-mint/10 px-4 py-3 text-center text-sm font-semibold text-mint">
            Goals updated ✨
          </p>
        ) : null}

        <button
          type="submit"
          className="brand-gradient w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-xl shadow-coral/25 transition-transform active:scale-[0.99]"
        >
          Recalculate goals
        </button>
      </form>

      <button
        type="button"
        onClick={handleSignOut}
        className="glass mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </main>
  )
}

function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-panel p-3 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1 text-xl font-extrabold">
        {value}
        <span className="ml-0.5 text-[11px] font-semibold text-white/40">{unit}</span>
      </p>
    </div>
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
    <label className="block text-[11px] font-semibold uppercase tracking-wide text-white/45">
      <span className="mb-1.5 block">{label}</span>
      <input name={name} type="number" step={step} required defaultValue={defaultValue} className="field text-sm normal-case tracking-normal" />
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
    <label className="block text-[11px] font-semibold uppercase tracking-wide text-white/45">
      <span className="mb-1.5 block">{label}</span>
      <select name={name} defaultValue={defaultValue} className="field text-sm normal-case tracking-normal">
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </label>
  )
}
