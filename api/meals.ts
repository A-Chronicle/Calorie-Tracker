import { requireUser } from '../server/auth.js'
import { query } from '../server/db.js'
import { errorResponse, HttpError, readJson } from '../server/http.js'
import { MEAL_COLUMNS, toMeal, type MealRow } from '../server/records.js'
import { mealSchema } from '../server/schemas.js'
import { removePhoto } from '../server/photos.js'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: Request) {
  try {
    const user = await requireUser(request)
    const input = await readJson(request, mealSchema)
    if (input.photoKey && !input.photoKey.startsWith(`meals/${user.id}/`)) {
      throw new HttpError(400, 'Photo does not belong to this account')
    }
    const { rows } = await query<MealRow>(
      `INSERT INTO meals (user_id, name, meal_type, calories, protein, carbs, fat,
                          photo_key, logged_at, source, items)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING ${MEAL_COLUMNS}`,
      [
        user.id,
        input.name,
        input.mealType,
        input.calories,
        input.protein,
        input.carbs,
        input.fat,
        input.photoKey ?? null,
        input.loggedAt,
        input.source,
        input.items ? JSON.stringify(input.items) : null,
      ],
    )
    return Response.json(toMeal(rows[0]), { status: 201 })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireUser(request)
    const id = new URL(request.url).searchParams.get('id') ?? ''
    if (!UUID.test(id)) throw new HttpError(400, 'Invalid meal id')

    const result = await query<{ photo_key: string | null }>(
      'DELETE FROM meals WHERE id = $1 AND user_id = $2 RETURNING photo_key',
      [id, user.id],
    )
    if (result.rowCount === 0) throw new HttpError(404, 'Meal not found')

    const photoKey = result.rows[0]?.photo_key
    if (photoKey) {
      // The meal is already gone. A failed blob delete leaves an orphan file, not a broken meal.
      await removePhoto(photoKey).catch((error: unknown) => console.error('Photo cleanup failed', error))
    }
    return new Response(null, { status: 204 })
  } catch (error) {
    return errorResponse(error)
  }
}
