import { hashPassword, hashToken } from '../../server/auth.js'
import { query } from '../../server/db.js'
import { errorResponse, HttpError, readJson } from '../../server/http.js'
import { resetPasswordSchema } from '../../server/schemas.js'

const INVALID = 'This reset link is invalid or has expired. Request a new one.'

export async function POST(request: Request) {
  try {
    const { token, password } = await readJson(request, resetPasswordSchema)
    const passwordHash = await hashPassword(password)

    // Marking the link used and checking it are one statement, so two requests can't both win.
    const { rows } = await query<{ user_id: string }>(
      `UPDATE password_resets SET used_at = now()
        WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()
        RETURNING user_id`,
      [hashToken(token)],
    )
    const userId = rows[0]?.user_id
    if (!userId) throw new HttpError(400, INVALID)

    await query('UPDATE users SET password_hash = $2 WHERE id = $1', [userId, passwordHash])
    // Sign out everywhere: any session opened before the reset stops working.
    await query('DELETE FROM sessions WHERE user_id = $1', [userId])
    await query('DELETE FROM password_resets WHERE user_id = $1', [userId])

    return Response.json({ message: 'Password updated. You can sign in now.' })
  } catch (error) {
    return errorResponse(error)
  }
}
