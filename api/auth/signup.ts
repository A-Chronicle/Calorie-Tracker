import { createSession, hashPassword, sessionCookie } from '../../server/auth.js'
import { query } from '../../server/db.js'
import { errorResponse, HttpError, readJson } from '../../server/http.js'
import { signUpSchema } from '../../server/schemas.js'

export async function POST(request: Request) {
  try {
    const input = await readJson(request, signUpSchema)
    const passwordHash = await hashPassword(input.password)
    const { rows } = await query<{ id: string }>(
      `INSERT INTO users (email, name, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [input.email, input.name, passwordHash],
    )
    if (!rows[0]) throw new HttpError(409, 'An account with this email already exists')

    const token = await createSession(rows[0].id)
    return Response.json(
      { user: { name: input.name, email: input.email } },
      { status: 201, headers: { 'Set-Cookie': sessionCookie(token) } },
    )
  } catch (error) {
    return errorResponse(error)
  }
}
