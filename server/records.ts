import type { Meal, MealSource, MealType, NutrientItem } from '../src/types.js'

// Column lists shared by the API routes. Aliases match the camelCase client types.
export const PROFILE_COLUMNS = `
  sex, age,
  height_cm AS "heightCm", weight_kg AS "weightKg", activity, goal,
  calorie_goal AS "calorieGoal", protein_goal AS "proteinGoal",
  carbs_goal AS "carbsGoal", fat_goal AS "fatGoal"`

export const MEAL_COLUMNS = `
  id, name, meal_type AS "mealType", calories, protein, carbs, fat,
  photo_key AS "photoKey", photo_data_url AS "photoDataUrl",
  logged_at AS "loggedAt", source, items`

export const WEIGHT_COLUMNS = `to_char(log_date, 'YYYY-MM-DD') AS date, kg`

export interface MealRow {
  id: string
  name: string
  mealType: MealType
  calories: number
  protein: number
  carbs: number
  fat: number
  photoKey: string | null
  photoDataUrl: string | null // legacy rows written before photos moved to Blob
  loggedAt: Date
  source: MealSource
  items: NutrientItem[] | null
}

export function toMeal(row: MealRow): Meal {
  return {
    id: row.id,
    name: row.name,
    mealType: row.mealType,
    calories: row.calories,
    protein: row.protein,
    carbs: row.carbs,
    fat: row.fat,
    photoUrl: row.photoKey
      ? `/api/photo?key=${encodeURIComponent(row.photoKey)}`
      : (row.photoDataUrl ?? undefined),
    loggedAt: row.loggedAt.toISOString(),
    source: row.source,
    items: row.items ?? undefined,
  }
}
