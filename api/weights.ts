import { requireUser } from '../server/auth.js'
import { query } from '../server/db.js'
import { errorResponse, readJson } from '../server/http.js'
import { WEIGHT_COLUMNS } from '../server/records.js'
import { weightSchema } from '../server/schemas.js'
import type { WeightLog } from '../src/types.js'

// Logs a weigh-in for a day and keeps the profile's current weight in step.
export async function PUT(request: Request) {
  try {
    const user = await requireUser(request)
    const input = await readJson(request, weightSchema)
    const { rows } = await query<WeightLog>(
      `INSERT INTO weight_logs (user_id, log_date, kg)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, log_date) DO UPDATE SET kg = EXCLUDED.kg
       RETURNING ${WEIGHT_COLUMNS}`,
      [user.id, input.date, input.kg],
    )
    await query('UPDATE profiles SET weight_kg = $2, updated_at = now() WHERE user_id = $1', [
      user.id,
      input.kg,
    ])
    return Response.json(rows[0])
  } catch (error) {
    return errorResponse(error)
  }
}
