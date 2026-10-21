import { createContext } from 'react'
import type { DailyTotals, Meal, Profile, WeightLog } from '../types'

// A meal to log. `photo` is a data URL from the browser; it is uploaded before the meal is saved.
export type NewMeal = Omit<Meal, 'id' | 'photoUrl'> & { photo?: string }

export interface TrackerContextType {
  profile: Profile | null
  meals: Meal[]
  weights: WeightLog[]
  selectedDate: string
  setSelectedDate: (key: string) => void
  dayMeals: Meal[]
  totals: DailyTotals
  logOpen: boolean
  setLogOpen: (open: boolean) => void
  saveUserProfile: (profile: Profile) => Promise<void>
  addMeal: (meal: NewMeal) => Promise<void>
  deleteMeal: (id: string) => Promise<void>
  logWeight: (kg: number, date?: string) => Promise<void>
}

export const TrackerContext = createContext<TrackerContextType | null>(null)
