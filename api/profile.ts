import { requireUser } from '../server/auth.js'
import { query } from '../server/db.js'
import { errorResponse, HttpError, readJson } from '../server/http.js'
import { removePhoto } from '../server/photos.js'
import { photoUrl, PROFILE_COLUMNS } from '../server/records.js'
import { avatarSchema, profileSchema } from '../server/schemas.js'
import type { Profile } from '../src/types.js'

export async function PUT(request: Request) {
  try {
    const user = await requireUser(request)

    // PUT /api/profile?avatar=1 updates only the profile picture, so the stats form and the
    // avatar picker can save independently without sending each other's fields.
    if (new URL(request.url).searchParams.get('avatar') === '1') {
      const input = await readJson(request, avatarSchema)
      if (input.avatarKey && !input.avatarKey.startsWith(`avatars/${user.id}/`)) {
        throw new HttpError(400, 'Photo does not belong to this account')
      }

      const previous = await query<{ avatarKey: string | null }>(
        'SELECT avatar_key AS "avatarKey" FROM users WHERE id = $1',
        [user.id],
      )
      await query('UPDATE users SET avatar_key = $2 WHERE id = $1', [user.id, input.avatarKey])

      const oldKey = previous.rows[0]?.avatarKey
      if (oldKey && oldKey !== input.avatarKey) {
        await removePhoto(oldKey).catch((error: unknown) => console.error('Avatar cleanup failed', error))
      }
      return Response.json({ avatarUrl: photoUrl(input.avatarKey) })
    }

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
