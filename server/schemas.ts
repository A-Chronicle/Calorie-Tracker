import { z } from 'zod'
import { PHOTO_KEY } from './photos.js'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const
const MEAL_SOURCES = ['scan', 'search', 'manual', 'ai'] as const

const nutrient = z.number().min(0).max(100_000)

export const signUpSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(254),
  password: z.string().min(8, 'Password must be at least 8 characters').max(200),
})

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().max(254),
  password: z.string().min(1, 'Password is required').max(200),
})

export const profileSchema = z.object({
  sex: z.enum(['female', 'male']),
  age: z.number().int().min(10).max(120),
  heightCm: z.number().min(100).max(250),
  weightKg: z.number().min(20).max(400),
  activity: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  goal: z.enum(['lose', 'maintain', 'gain']),
  calorieGoal: z.number().int().min(0).max(20_000),
  proteinGoal: z.number().min(0).max(1_000),
  carbsGoal: z.number().min(0).max(2_000),
  fatGoal: z.number().min(0).max(1_000),
})

const nutrientItemSchema = z.object({
  name: z.string().max(200),
  quantity: z.string().max(200),
  calories: nutrient,
  protein: nutrient,
  carbs: nutrient,
  fat: nutrient,
})

export const mealSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  mealType: z.enum(MEAL_TYPES),
  calories: nutrient,
  protein: nutrient,
  carbs: nutrient,
  fat: nutrient,
  photoKey: z.string().max(200).regex(PHOTO_KEY, 'Invalid photo key').optional(),
  loggedAt: z.iso.datetime({ offset: true, message: 'loggedAt must be an ISO timestamp' }),
  source: z.enum(MEAL_SOURCES),
  items: z.array(nutrientItemSchema).max(50).optional(),
})

export const weightSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  kg: z.number().min(20).max(400),
})

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().max(254),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset link is invalid').max(200),
  password: z.string().min(8, 'Password must be at least 8 characters').max(200),
})
