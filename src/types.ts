export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type Sex = 'female' | 'male'

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active'

export type Goal = 'lose' | 'maintain' | 'gain'

export type MealSource = 'scan' | 'search' | 'manual' | 'ai'

export interface NutrientItem {
  name: string
  quantity: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Meal {
  id: string
  name: string
  mealType: MealType
  calories: number
  protein: number
  carbs: number
  fat: number
  photoUrl?: string
  loggedAt: string
  source: MealSource
  items?: NutrientItem[]
}

export interface Profile {
  sex: Sex
  age: number
  heightCm: number
  weightKg: number
  activity: ActivityLevel
  goal: Goal
  calorieGoal: number
  proteinGoal: number
  carbsGoal: number
  fatGoal: number
}

export interface WeightLog {
  date: string
  kg: number
}

export interface Food {
  id: string
  name: string
  aliases: string[]
  serving: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface DailyTotals {
  calories: number
  protein: number
  carbs: number
  fat: number
}
