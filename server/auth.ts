import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { query } from './db.js'
import { HttpError } from './http.js'

const SESSION_COOKIE = 'calorie_session'
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60

export interface SessionUser {
  id: string
  name: string
  email: string
}

function scrypt(password: string, salt: Buffer, keyLength: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keyLength, (error, key) => (error ? reject(error) : resolve(key)))
  })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const key = await scrypt(password, salt, 64)
  return `scrypt$${salt.toString('base64')}$${key.toString('base64')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltB64, keyB64] = stored.split('$')
  if (scheme !== 'scrypt' || !saltB64 || !keyB64) return false
  const expected = Buffer.from(keyB64, 'base64')
  const actual = await scrypt(password, Buffer.from(saltB64, 'base64'), expected.length)
  return timingSafeEqual(actual, expected)
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('base64url')
  // Drop expired sessions as new ones are created, so the table doesn't grow forever.
  await query('DELETE FROM sessions WHERE expires_at <= now()')
  await query('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)', [
    hashToken(token),
    userId,
    new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000),
  ])
  return token
}

function cookieHeader(value: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`
}

export function sessionCookie(token: string): string {
  return cookieHeader(token, SESSION_MAX_AGE_SECONDS)
}

export function clearedSessionCookie(): string {
  return cookieHeader('', 0)
}

function readSessionToken(request: Request): string | null {
  for (const part of (request.headers.get('cookie') ?? '').split(';')) {
    const [name, ...value] = part.trim().split('=')
    if (name === SESSION_COOKIE && value.length) return value.join('=')
  }
  return null
}

export async function getSessionUser(request: Request): Promise<SessionUser | null> {
  const token = readSessionToken(request)
  if (!token) return null
  const { rows } = await query<SessionUser>(
    `SELECT u.id, u.name, u.email
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [hashToken(token)],
  )
  return rows[0] ?? null
}

export async function requireUser(request: Request): Promise<SessionUser> {
  const user = await getSessionUser(request)
  if (!user) throw new HttpError(401, 'Sign in required')
  return user
}

export async function deleteSession(request: Request): Promise<void> {
  const token = readSessionToken(request)
  if (token) await query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(token)])
}
