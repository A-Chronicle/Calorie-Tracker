import { clearedSessionCookie, deleteSession, getSessionUser } from '../../server/auth.js'
import { errorResponse } from '../../server/http.js'

// One route for the current session: GET returns the signed-in user, DELETE signs out.
// Merged into one file to stay within the Hobby plan's function limit.
export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request)
    return Response.json({ user: user ? { name: user.name, email: user.email } : null })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(request: Request) {
  try {
    await deleteSession(request)
    return new Response(null, { status: 204, headers: { 'Set-Cookie': clearedSessionCookie() } })
  } catch (error) {
    return errorResponse(error)
  }
}
