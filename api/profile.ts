import { requireUser } from '../server/auth.js'
import { query } from '../server/db.js'
import { errorResponse, readJson } from '../server/http.js'
import { PROFILE_COLUMNS } from '../server/records.js'
import { profileSchema } from '../server/schemas.js'
import type { Profile } from '../src/types.js'

export async function PUT(request: Request) {
  try {
    const user = await requireUser(request)
    const input = await readJson(request, profileSchema)
    const { rows } = await query<Profile>(
      `INSERT INTO profiles (user_id, sex, age, height_cm, weight_kg, activity, goal,
                             calorie_goal, protein_goal, carbs_goal, fat_goal)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (user_id) DO UPDATE SET
         sex = EXCLUDED.sex, age = EXCLUDED.age, height_cm = EXCLUDED.height_cm,
         weight_kg = EXCLUDED.weight_kg, activity = EXCLUDED.activity, goal = EXCLUDED.goal,
         calorie_goal = EXCLUDED.calorie_goal, protein_goal = EXCLUDED.protein_goal,
         carbs_goal = EXCLUDED.carbs_goal, fat_goal = EXCLUDED.fat_goal,
         updated_at = now()
       RETURNING ${PROFILE_COLUMNS}`,
      [
        user.id,
        input.sex,
        input.age,
        input.heightCm,
        input.weightKg,
        input.activity,
        input.goal,
        input.calorieGoal,
        input.proteinGoal,
        input.carbsGoal,
        input.fatGoal,
      ],
    )
    return Response.json(rows[0])
  } catch (error) {
    return errorResponse(error)
  }
}
