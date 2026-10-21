import { Droplet, Flame, Trash2, Wheat, Zap } from 'lucide-react'
import { mealHourLabel } from '../lib/dates'
import type { Meal, MealType } from '../types'

interface MealCardProps {
  meal: Meal
  onDelete: (id: string) => void
}

const EMOJI: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '🥗',
  dinner: '🌙',
  snack: '🍎',
}

export default function MealCard({ meal, onDelete }: MealCardProps) {
  return (
    <article className="flex gap-3 rounded-3xl bg-white p-3 shadow-sm shadow-ink/5">
      {meal.photoUrl ? (
        <img src={meal.photoUrl} alt="" className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
      ) : (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-3xl">
          {EMOJI[meal.mealType]}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-bold text-ink">{meal.name}</p>
          <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
            {mealHourLabel(meal.loggedAt)}
          </span>
        </div>

        <p className="mt-1.5 flex items-center gap-1 text-sm font-semibold text-ink">
          <Flame className="h-4 w-4" />
          {meal.calories} kcal
        </p>

        <div className="mt-1.5 flex flex-wrap gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1 text-[#F0736B]">
            <Zap className="h-3.5 w-3.5" />
            {Math.round(meal.protein)}g
          </span>
          <span className="flex items-center gap-1 text-[#F2A65A]">
            <Wheat className="h-3.5 w-3.5" />
            {Math.round(meal.carbs)}g
          </span>
          <span className="flex items-center gap-1 text-[#5C8DF6]">
            <Droplet className="h-3.5 w-3.5" />
            {Math.round(meal.fat)}g
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(meal.id)}
        className="self-start rounded-full p-1.5 text-neutral-300 transition-colors hover:bg-coral/10 hover:text-coral"
        aria-label={`Delete ${meal.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </article>
  )
}
