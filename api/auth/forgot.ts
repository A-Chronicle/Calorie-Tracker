import { randomBytes } from 'node:crypto'
import { hashToken } from '../../server/auth.js'
import { query } from '../../server/db.js'
import { sendEmail } from '../../server/email.js'
import { errorResponse, readJson } from '../../server/http.js'
import { clientIp, enforceLimit } from '../../server/rate-limit.js'
import { forgotPasswordSchema } from '../../server/schemas.js'

const RESET_TTL_MS = 30 * 60 * 1000
const MESSAGE = 'If an account exists for that email, we have sent a reset link.'
// Local development without an email key: the link is returned so it can be tested without email.
const SHOW_LINK_LOCALLY = process.env.NODE_ENV !== 'production' && !process.env.RESEND_API_KEY

// Always answers the same way, so the response never reveals whether an account exists.
export async function POST(request: Request) {
  try {
    const { email } = await readJson(request, forgotPasswordSchema)
    const tooMany = 'Too many reset requests. Try again in a few minutes.'
    await enforceLimit(`reset:email:${email}`, 3, tooMany)
    await enforceLimit(`reset:ip:${clientIp(request)}`, 10, tooMany)

    const { rows } = await query<{ id: string; name: string }>(
      'SELECT id, name FROM users WHERE email = $1',
      [email],
    )
    const user = rows[0]
    let devLink: string | undefined
    if (user) {
      const token = randomBytes(32).toString('base64url')
      // Only the newest link works, so clear any earlier unused ones.
      await query('DELETE FROM password_resets WHERE user_id = $1 AND used_at IS NULL', [user.id])
      await query('INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES ($1, $2, $3)', [
        hashToken(token),
        user.id,
        new Date(Date.now() + RESET_TTL_MS),
      ])

      const origin = process.env.APP_URL ?? new URL(request.url).origin
      const link = `${origin}/reset?token=${token}`
      if (SHOW_LINK_LOCALLY) devLink = link
      try {
        await sendEmail({
          to: email,
          subject: 'Reset your CAL-c password',
          text: `Hi ${user.name},\n\nUse this link to choose a new password. It expires in 30 minutes and works once:\n${link}\n\nIf you didn't ask for this, you can ignore this email.`,
        })
      } catch (error) {
        // Log but don't reveal: the caller gets the same answer either way.
        console.error('Password reset email failed', error)
      }
    }

    return Response.json(devLink ? { message: MESSAGE, devLink } : { message: MESSAGE })
  } catch (error) {
    return errorResponse(error)
  }
}
