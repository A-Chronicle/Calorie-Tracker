import { clearedSessionCookie, deleteSession } from '../../server/auth.js'
import { errorResponse } from '../../server/http.js'

export async function POST(request: Request) {
  try {
    await deleteSession(request)
    return new Response(null, { status: 204, headers: { 'Set-Cookie': clearedSessionCookie() } })
  } catch (error) {
    return errorResponse(error)
  }
}
