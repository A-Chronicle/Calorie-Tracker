import type { ActivityLevel, Goal, Profile, Sex } from '../types'

const ACTIVITY: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export function mifflinStJeor(input: {
  sex: Sex
  age: number
  heightCm: number
  weightKg: number
}): number {
  const base = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age
  return input.sex === 'male' ? base + 5 : base - 161
}

export function buildGoals(input: {
  sex: Sex
  age: number
  heightCm: number
  weightKg: number
  activity: ActivityLevel
  goal: Goal
}): Pick<Profile, 'calorieGoal' | 'proteinGoal' | 'carbsGoal' | 'fatGoal'> {
  const bmr = mifflinStJeor(input)
  const tdee = Math.round(bmr * ACTIVITY[input.activity])
  const calorieGoal =
    input.goal === 'lose' ? tdee - 500 : input.goal === 'gain' ? tdee + 300 : tdee
  const proteinPerKg = input.goal === 'gain' ? 2 : input.goal === 'lose' ? 1.8 : 1.6
  const proteinGoal = Math.round(input.weightKg * proteinPerKg)
  const fatGoal = Math.round((calorieGoal * 0.28) / 9)
  const carbsGoal = Math.max(0, Math.round((calorieGoal - proteinGoal * 4 - fatGoal * 9) / 4))
  return { calorieGoal, proteinGoal, carbsGoal, fatGoal }
}
