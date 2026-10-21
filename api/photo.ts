import { requireUser } from '../server/auth.js'
import { errorResponse, HttpError } from '../server/http.js'
import { PHOTO_KEY, readPhoto } from '../server/photos.js'

// Streams one of the signed-in user's meal photos. Photos are private, so this is the only way to read them.
export async function GET(request: Request) {
  try {
    const user = await requireUser(request)
    const key = new URL(request.url).searchParams.get('key') ?? ''
    if (!PHOTO_KEY.test(key) || !key.startsWith(`meals/${user.id}/`)) {
      throw new HttpError(404, 'Photo not found')
    }

    const photo = await readPhoto(key)
    if (!photo) throw new HttpError(404, 'Photo not found')

    return new Response(photo.body, {
      headers: {
        'Content-Type': photo.contentType,
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    return errorResponse(error)
  }
}
