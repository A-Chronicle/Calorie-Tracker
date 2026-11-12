import { useEffect, useMemo, useState } from 'react'
import { Flame } from 'lucide-react'
import { useTracker } from '../context/useTracker'
import { localDateKey, shiftDateKey } from '../lib/dates'
import KoalaMascot, { type KoalaMood } from './illustrations/KoalaMascot'

type Moment = 'idle' | 'logged' | 'within' | 'exact' | 'milestone' | 'over'

const MILESTONES = [3, 7, 14, 30, 60, 100, 365]
const CONFETTI = ['#c47b63', '#c8a878', '#8fb59b', '#a092bd', '#e9e5dd']

export default function KoaCompanion() {
  const { profile, meals, dayMeals, totals, selectedDate } = useTracker()
  const [celebrate, setCelebrate] = useState(false)

  const streak = useMemo(() => {
    const logged = new Set(meals.map((m) => localDateKey(new Date(m.loggedAt))))
    let count = 0
    let cursor = selectedDate
    while (logged.has(cursor)) {
      count += 1
      cursor = shiftDateKey(cursor, -1)
    }
    return count
  }, [meals, selectedDate])

  const moment = useMemo<Moment>(() => {
    if (!profile) return 'idle'
    if (dayMeals.length === 0) return 'idle'
    if (MILESTONES.includes(streak)) return 'milestone'

    const goal = profile.calorieGoal
    const closeToGoal = Math.abs(totals.calories - goal) <= Math.max(30, goal * 0.02)
    if (closeToGoal) return 'exact'
    if (totals.calories <= goal && dayMeals.length >= 2) return 'within'
    if (totals.calories > goal) return 'over'
    return 'logged'
  }, [profile, dayMeals.length, totals.calories, streak])

  const celebrating = moment === 'milestone' || moment === 'exact' || moment === 'within'
  const showCelebration = celebrate && celebrating

  useEffect(() => {
    if (!celebrating) return
    const key = `koa:${selectedDate}:${moment}`

    // Defer to a timer so the celebration starts as an animation, not a cascading render.
    const start = window.setTimeout(() => {
      try {
        if (localStorage.getItem(key)) return
        localStorage.setItem(key, '1')
      } catch {
        /* Storage can be blocked; show the cheer anyway. */
      }
      setCelebrate(true)
    }, 0)
    const stop = window.setTimeout(() => setCelebrate(false), 3400)

    return () => {
      window.clearTimeout(start)
      window.clearTimeout(stop)
    }
  }, [celebrating, moment, selectedDate])

  if (!profile) return null

  const mood: KoalaMood =
    celebrating ? 'cheer' : moment === 'over' ? 'nudge' : moment === 'idle' ? 'sleepy' : 'happy'

  const message =
    moment === 'milestone'
      ? `${streak} days in a row. You're unstoppable — I'm so proud!`
      : moment === 'exact'
        ? 'Right on your goal. That is a beautifully balanced day.'
        : moment === 'within'
          ? 'You stayed within your goal today. That is a win.'
          : moment === 'over'
            ? "A little over today — no drama. Tomorrow's a fresh page."
            : moment === 'logged'
              ? "Nice start. I'm right here cheering for you."
              : 'Nothing logged yet. Shall we find something tasty?'

  return (
    <section className="relative mt-5 overflow-hidden rounded-[28px] border border-white/[0.07] bg-panel/70 px-4 py-3.5">
      {showCelebration ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, index) => (
            <span
              key={index}
              className="confetti-piece absolute top-0 block h-2 w-1.5 rounded-sm"
              style={{
                left: `${5 + index * 6.7}%`,
                backgroundColor: CONFETTI[index % CONFETTI.length],
                animationDelay: `${(index % 7) * 0.09}s`,
              }}
            />
          ))}
        </div>
      ) : null}

      <div className="relative flex items-center gap-3.5">
        <KoalaMascot
          mood={mood}
          size={68}
          className={`shrink-0 ${showCelebration ? 'animate-koa-cheer' : 'animate-float'}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-hand text-xl leading-none text-coral/90">Koa says</p>
            {streak > 1 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-bold text-amber">
                <Flame className="h-3 w-3" />
                {streak} day streak
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm leading-snug text-white/70">{message}</p>
        </div>
      </div>
    </section>
  )
}
