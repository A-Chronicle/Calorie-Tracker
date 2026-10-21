import { getSessionUser } from '../../server/auth.js'
import { errorResponse } from '../../server/http.js'

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request)
    return Response.json({ user: user ? { name: user.name, email: user.email } : null })
  } catch (error) {
    return errorResponse(error)
  }
}
