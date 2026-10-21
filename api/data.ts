import { requireUser } from '../server/auth.js'
import { query } from '../server/db.js'
import { errorResponse } from '../server/http.js'
import {
  MEAL_COLUMNS,
  PROFILE_COLUMNS,
  toMeal,
  WEIGHT_COLUMNS,
  type MealRow,
} from '../server/records.js'
import type { Profile, WeightLog } from '../src/types.js'

// Everything the signed-in app needs on load, in one round trip.
export async function GET(request: Request) {
  try {
    const user = await requireUser(request)
    const [profile, meals, weights] = await Promise.all([
      query<Profile>(`SELECT ${PROFILE_COLUMNS} FROM profiles WHERE user_id = $1`, [user.id]),
      query<MealRow>(
        `SELECT ${MEAL_COLUMNS} FROM meals WHERE user_id = $1 ORDER BY logged_at DESC`,
        [user.id],
      ),
      query<WeightLog>(
        `SELECT ${WEIGHT_COLUMNS} FROM weight_logs WHERE user_id = $1 ORDER BY log_date`,
        [user.id],
      ),
    ])

    return Response.json({
      profile: profile.rows[0] ?? null,
      meals: meals.rows.map(toMeal),
      weights: weights.rows,
    })
  } catch (error) {
    return errorResponse(error)
  }
}
