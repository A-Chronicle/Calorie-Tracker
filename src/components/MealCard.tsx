import { Trash2 } from 'lucide-react'
import { mealHourLabel } from '../lib/dates'
import type { Meal, MealType } from '../types'

interface MealCardProps {
  meal: Meal
  onDelete: (id: string) => void
}

const MEAL_STYLE: Record<MealType, { emoji: string; tile: string; pill: string }> = {
  breakfast: { emoji: '🌅', tile: 'bg-amber/20', pill: 'bg-amber/15 text-amber' },
  lunch: { emoji: '🥗', tile: 'bg-mint/20', pill: 'bg-mint/15 text-mint' },
  dinner: { emoji: '🌙', tile: 'bg-plum/15', pill: 'bg-plum/10 text-plum' },
  snack: { emoji: '🍎', tile: 'bg-coral/15', pill: 'bg-coral/10 text-coral' },
}

export default function MealCard({ meal, onDelete }: MealCardProps) {
  const style = MEAL_STYLE[meal.mealType]
  return (
    <article className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-sm shadow-ink/5 ring-1 ring-black/5 transition-shadow hover:shadow-md">
      {meal.photoUrl ? (
        <img src={meal.photoUrl} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
      ) : (
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl ${style.tile}`}>
          {style.emoji}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-ink">{meal.name}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${style.pill}`}>
            {meal.mealType}
          </span>
          <span className="text-xs text-neutral-400">{mealHourLabel(meal.loggedAt)}</span>
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          P {Math.round(meal.protein)}g · C {Math.round(meal.carbs)}g · F {Math.round(meal.fat)}g
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <p className="rounded-xl bg-ink px-2.5 py-1 text-sm font-bold text-white">{meal.calories}</p>
        <button
          type="button"
          onClick={() => onDelete(meal.id)}
          className="rounded-full p-1.5 text-neutral-300 transition-colors hover:bg-coral/10 hover:text-coral"
          aria-label={`Delete ${meal.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}
