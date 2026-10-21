import { Trash2 } from 'lucide-react'
import { mealHourLabel } from '../lib/dates'
import type { Meal } from '../types'

interface MealCardProps {
  meal: Meal
  onDelete: (id: string) => void
}

export default function MealCard({ meal, onDelete }: MealCardProps) {
  return (
    <article className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/4">
      {meal.photoUrl ? (
        <img
          src={meal.photoUrl}
          alt=""
          className="h-14 w-14 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-lg">
          {meal.mealType === 'breakfast'
            ? '🌅'
            : meal.mealType === 'lunch'
              ? '☀️'
              : meal.mealType === 'dinner'
                ? '🌙'
                : '🍎'}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-neutral-900">{meal.name}</p>
            <p className="text-xs capitalize text-neutral-500">
              {meal.mealType} · {mealHourLabel(meal.loggedAt)}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-neutral-900">{meal.calories} kcal</p>
        </div>
        <p className="mt-1 text-xs text-neutral-400">
          P {Math.round(meal.protein)}g · C {Math.round(meal.carbs)}g · F {Math.round(meal.fat)}g
        </p>
      </div>
      <button
        type="button"
        onClick={() => onDelete(meal.id)}
        className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-red-500"
        aria-label={`Delete ${meal.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </article>
  )
}
