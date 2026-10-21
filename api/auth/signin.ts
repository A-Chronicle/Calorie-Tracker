import { createSession, hashPassword, sessionCookie, verifyPassword } from '../../server/auth.js'
import { query } from '../../server/db.js'
import { clearSignInAttempts, clientIp, registerSignInAttempt } from '../../server/rate-limit.js'
import { errorResponse, HttpError, readJson } from '../../server/http.js'
import { signInSchema } from '../../server/schemas.js'

export async function POST(request: Request) {
  try {
    const input = await readJson(request, signInSchema)
    await registerSignInAttempt(input.email, clientIp(request))

    const { rows } = await query<{ id: string; name: string; email: string; password_hash: string }>(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [input.email],
    )
    const user = rows[0]
    if (!user) {
      // Hash anyway so unknown emails take as long to reject as wrong passwords.
      await hashPassword(input.password)
      throw new HttpError(401, 'Invalid email or password')
    }
    if (!(await verifyPassword(input.password, user.password_hash))) {
      throw new HttpError(401, 'Invalid email or password')
    }

    await clearSignInAttempts(input.email)
    const token = await createSession(user.id)
    return Response.json(
      { user: { name: user.name, email: user.email } },
      { headers: { 'Set-Cookie': sessionCookie(token) } },
    )
  } catch (error) {
    return errorResponse(error)
  }
}
