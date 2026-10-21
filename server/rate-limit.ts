import { query } from './db.js'
import { HttpError } from './http.js'

// Fixed windows. Counters live in Postgres so every serverless instance shares them.
const WINDOW_SECONDS = 15 * 60
const EMAIL_LIMIT = 5
const IP_LIMIT = 50

// Vercel sets x-forwarded-for; the first entry is the client.
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || request.headers.get('x-real-ip') || 'unknown'
}

interface Counter {
  attempts: number
  retry_after: number
}

async function countAttempt(key: string): Promise<Counter> {
  // Resets the window when it has expired. Returns the count after this attempt and seconds until reset.
  const { rows } = await query<Counter>(
    `INSERT INTO login_attempts (attempt_key, attempts, window_start)
     VALUES ($1, 1, now())
     ON CONFLICT (attempt_key) DO UPDATE SET
       attempts = CASE WHEN login_attempts.window_start <= now() - make_interval(secs => $2)
                       THEN 1 ELSE login_attempts.attempts + 1 END,
       window_start = CASE WHEN login_attempts.window_start <= now() - make_interval(secs => $2)
                           THEN now() ELSE login_attempts.window_start END
     RETURNING attempts,
       greatest(1, ceil(extract(epoch FROM (window_start + make_interval(secs => $2) - now()))))::int AS retry_after`,
    [key, WINDOW_SECONDS],
  )
  return rows[0]
}

// Call before checking the password. Throws 429 once either limit is exceeded.
export async function registerSignInAttempt(email: string, ip: string): Promise<void> {
  const [byEmail, byIp] = await Promise.all([
    countAttempt(`email:${email}`),
    countAttempt(`ip:${ip}`),
  ])

  // Unknown emails are counted too, so the table needs pruning.
  await query('DELETE FROM login_attempts WHERE window_start < now() - make_interval(secs => $1)', [
    WINDOW_SECONDS * 4,
  ])

  const blockedFor = [
    byEmail.attempts > EMAIL_LIMIT ? byEmail.retry_after : 0,
    byIp.attempts > IP_LIMIT ? byIp.retry_after : 0,
  ].reduce((max, seconds) => Math.max(max, seconds), 0)

  if (blockedFor > 0) {
    const minutes = Math.ceil(blockedFor / 60)
    throw new HttpError(
      429,
      `Too many sign-in attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
      blockedFor,
    )
  }
}

// A successful sign-in resets that email's counter. The IP counter keeps running.
export async function clearSignInAttempts(email: string): Promise<void> {
  await query('DELETE FROM login_attempts WHERE attempt_key = $1', [`email:${email}`])
}
