import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useTracker } from '../context/useTracker'
import { buildGoals } from '../lib/tdee'
import type { ActivityLevel, Goal, Sex } from '../types'
import AuthLayout, { AuthButton, AuthError, AuthLabel } from '../components/AuthLayout'

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
    <AuthLayout
      title={
        <>
          Set your <span className="brand-text">daily target</span>
        </>
      }
      subtitle="We estimate your calories from your stats. You can change this anytime."
    >
      <form onSubmit={onSubmit} onChange={onChange} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <AuthLabel label="Sex">
            <select name="sex" className="field text-sm normal-case tracking-normal">
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </AuthLabel>
          <AuthLabel label="Age">
            <input name="age" type="number" required min={13} className="field text-sm normal-case tracking-normal" />
          </AuthLabel>
          <AuthLabel label="Height (cm)">
            <input name="heightCm" type="number" required min={100} className="field text-sm normal-case tracking-normal" />
          </AuthLabel>
          <AuthLabel label="Weight (kg)">
            <input name="weightKg" type="number" step="0.1" required min={30} className="field text-sm normal-case tracking-normal" />
          </AuthLabel>
        </div>

        <AuthLabel label="Activity">
          <select name="activity" defaultValue="moderate" className="field text-sm normal-case tracking-normal">
            <option value="sedentary">Mostly sitting</option>
            <option value="light">Light exercise 1–3 days</option>
            <option value="moderate">Exercise 3–5 days</option>
            <option value="active">Hard exercise 6–7 days</option>
            <option value="very_active">Physical job + training</option>
          </select>
        </AuthLabel>

        <AuthLabel label="Goal">
          <select name="goal" defaultValue="lose" className="field text-sm normal-case tracking-normal">
            <option value="lose">Lose fat</option>
            <option value="maintain">Maintain</option>
            <option value="gain">Build muscle</option>
          </select>
        </AuthLabel>

        {preview ? (
          <div className="animate-rise rounded-3xl border border-white/10 bg-panel p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/45">Suggested target</p>
            <p className="mt-1 bg-[linear-gradient(120deg,#ff5a4e,#ffb020)] bg-clip-text text-4xl font-black text-transparent">
              {preview}
              <span className="ml-1 text-base text-white/50">kcal/day</span>
            </p>
          </div>
        ) : null}

        {error ? <AuthError>{error}</AuthError> : null}

        <AuthButton loadingText="Saving…">Start tracking</AuthButton>
      </form>
    </AuthLayout>
  )
}
