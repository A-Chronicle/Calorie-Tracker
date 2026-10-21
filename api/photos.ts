import { requireUser } from '../server/auth.js'
import { errorResponse, HttpError } from '../server/http.js'
import { looksLikeImage, MAX_PHOTO_BYTES, newPhotoKey, photoExtension, storePhoto } from '../server/photos.js'

// Stores a meal photo and returns its key. The key is then sent with the meal.
export async function POST(request: Request) {
  try {
    const user = await requireUser(request)
    const contentType = (request.headers.get('content-type') ?? '').split(';')[0]?.trim() ?? ''
    if (!photoExtension(contentType)) {
      throw new HttpError(415, 'Photo must be a JPEG, PNG or WebP image')
    }
    const declaredSize = Number(request.headers.get('content-length') ?? 0)
    if (declaredSize > MAX_PHOTO_BYTES) throw new HttpError(413, 'Photo must be 3 MB or smaller')

    const bytes = new Uint8Array(await request.arrayBuffer())
    if (bytes.byteLength === 0) throw new HttpError(400, 'Photo is empty')
    if (bytes.byteLength > MAX_PHOTO_BYTES) throw new HttpError(413, 'Photo must be 3 MB or smaller')
    if (!looksLikeImage(bytes, contentType)) throw new HttpError(415, 'File is not a valid image')

    const key = newPhotoKey(user.id, contentType)
    await storePhoto(key, bytes, contentType)
    return Response.json({ key }, { status: 201 })
  } catch (error) {
    return errorResponse(error)
  }
}
