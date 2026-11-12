import { Trash2 } from 'lucide-react'
import { mealHourLabel } from '../lib/dates'
import MealIcon from './illustrations/MealIcon'
import type { Meal } from '../types'

interface MealCardProps {
  meal: Meal
  onDelete: (id: string) => void
}

export default function MealCard({ meal, onDelete }: MealCardProps) {
  return (
    <article className="group flex items-center gap-3 rounded-3xl border border-white/[0.07] bg-panel p-3 transition-colors hover:border-white/15">
      {meal.photoUrl ? (
        <img src={meal.photoUrl} alt="" className="h-18 w-18 shrink-0 rounded-2xl object-cover" />
      ) : (
        <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl border border-white/[0.06] bg-[linear-gradient(135deg,rgba(196,123,99,0.18),rgba(160,146,189,0.18))]">
          <MealIcon type={meal.mealType} size={34} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-bold text-white">{meal.name}</p>
          <span className="shrink-0 text-[11px] font-medium text-white/40">{mealHourLabel(meal.loggedAt)}</span>
        </div>

        <p className="mt-0.5 bg-[linear-gradient(120deg,#c47b63,#c8a878)] bg-clip-text text-xl font-extrabold leading-tight text-transparent">
          {meal.calories}
          <span className="ml-1 text-xs font-semibold text-white/50">kcal</span>
        </p>

        <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px] font-semibold">
          <span className="rounded-full bg-coral/15 px-2 py-0.5 text-coral">P {Math.round(meal.protein)}g</span>
          <span className="rounded-full bg-amber/15 px-2 py-0.5 text-amber">C {Math.round(meal.carbs)}g</span>
          <span className="rounded-full bg-sky/15 px-2 py-0.5 text-sky">F {Math.round(meal.fat)}g</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(meal.id)}
        className="self-start rounded-full p-2 text-white/25 transition-colors hover:bg-coral/15 hover:text-coral"
        aria-label={`Delete ${meal.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </article>
  )
}
