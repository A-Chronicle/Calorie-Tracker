import { useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Loader2, LogOut, X } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useTracker } from '../context/useTracker'
import { api, uploadPhoto } from '../lib/api'
import { compressImage } from '../lib/image'
import { buildGoals } from '../lib/tdee'
import type { ActivityLevel, Goal, Sex } from '../types'

export default function Profile() {
  const { user, signOut, updateAvatar } = useAuth()
  const { profile, saveUserProfile } = useTracker()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [avatarBusy, setAvatarBusy] = useState(false)
  const [avatarError, setAvatarError] = useState('')

  if (!profile) return null

  async function onPickAvatar(file: File) {
    setAvatarError('')
    setAvatarBusy(true)
    try {
      const dataUrl = await compressImage(file, 512, 0.82)
      const key = await uploadPhoto(dataUrl, 'avatars')
      const savedAvatar = await api<{ avatarUrl?: string }>('/profile?avatar=1', {
        method: 'PUT',
        body: { avatarKey: key },
      })
      updateAvatar(savedAvatar.avatarUrl)
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Could not update your picture')
    } finally {
      setAvatarBusy(false)
    }
  }

  async function removeAvatar() {
    setAvatarError('')
    setAvatarBusy(true)
    try {
      await api('/profile?avatar=1', { method: 'PUT', body: { avatarKey: null } })
      updateAvatar(undefined)
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Could not remove your picture')
    } finally {
      setAvatarBusy(false)
    }
  }

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
        <div className="relative shrink-0">
          <div className="h-20 w-20 overflow-hidden rounded-3xl border border-white/10 bg-panel shadow-xl shadow-black/30">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={`${user.name}'s profile picture`} className="h-full w-full object-cover" />
            ) : (
              <div className="brand-gradient flex h-full w-full items-center justify-center text-2xl font-black text-white">
                {initial}
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (file) void onPickAvatar(file)
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={avatarBusy}
            aria-label="Change profile picture"
            className="absolute -bottom-1 -right-1 rounded-full border-2 border-[#131311] bg-cream p-1.5 text-night shadow-lg transition-transform hover:scale-105 disabled:opacity-60"
          >
            {avatarBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
          </button>
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-2xl font-extrabold tracking-tight">{user?.name}</h1>
          <p className="truncate text-sm text-white/50">{user?.email}</p>
          <p className="mt-1 font-hand text-base leading-none text-white/35">tap the camera to say hello</p>
          {user?.avatarUrl ? (
            <button
              type="button"
              onClick={() => void removeAvatar()}
              disabled={avatarBusy}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white/40 transition-colors hover:text-coral disabled:opacity-50"
            >
              <X className="h-3 w-3" />
              Remove picture
            </button>
          ) : null}
        </div>
      </div>

      {avatarError ? (
        <p className="mt-3 rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">{avatarError}</p>
      ) : null}

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
