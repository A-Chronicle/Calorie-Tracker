import { del, get, put } from '@vercel/blob'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

export const MAX_PHOTO_BYTES = 3 * 1024 * 1024

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

// Keys are server-generated: meals/<userId>/<uuid>.<ext>. Anything else is rejected.
export const PHOTO_KEY = /^meals\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp)$/

export function photoExtension(contentType: string): string | undefined {
  return EXTENSIONS[contentType]
}

export function newPhotoKey(userId: string, contentType: string): string {
  return `meals/${userId}/${crypto.randomUUID()}.${photoExtension(contentType)}`
}

// Checks the file's leading bytes so a renamed or mislabeled file can't be stored as an image.
export function looksLikeImage(bytes: Uint8Array<ArrayBuffer>, contentType: string): boolean {
  const startsWith = (sig: number[], offset = 0) => sig.every((b, i) => bytes[offset + i] === b)
  switch (contentType) {
    case 'image/jpeg':
      return startsWith([0xff, 0xd8, 0xff])
    case 'image/png':
      return startsWith([0x89, 0x50, 0x4e, 0x47])
    case 'image/webp':
      return startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8)
    default:
      return false
  }
}

// Vercel Blob when a token is configured. In development without one, photos go to a git-ignored
// folder so the flow works offline. Production without a token is a configuration error.
function storage(): 'blob' | 'local' {
  if (process.env.BLOB_READ_WRITE_TOKEN) return 'blob'
  if (process.env.NODE_ENV === 'production') {
    throw new Error('BLOB_READ_WRITE_TOKEN is not set')
  }
  return 'local'
}

function localPath(key: string): string {
  return path.join(process.cwd(), '.local-photos', key)
}

export async function storePhoto(key: string, bytes: Uint8Array<ArrayBuffer>, contentType: string): Promise<void> {
  if (storage() === 'blob') {
    await put(key, new Blob([bytes], { type: contentType }), { access: 'private', contentType })
    return
  }
  await mkdir(path.dirname(localPath(key)), { recursive: true })
  await writeFile(localPath(key), bytes)
}

export async function readPhoto(key: string): Promise<{ body: BodyInit; contentType: string } | null> {
  const contentType = Object.entries(EXTENSIONS).find(([, ext]) => key.endsWith(`.${ext}`))?.[0]
  if (!contentType) return null

  if (storage() === 'blob') {
    const result = await get(key, { access: 'private' })
    if (!result || result.statusCode !== 200) return null
    return { body: result.stream, contentType: result.blob.contentType }
  }
  try {
    return { body: await readFile(localPath(key)), contentType }
  } catch {
    return null
  }
}

export async function removePhoto(key: string): Promise<void> {
  if (storage() === 'blob') {
    await del(key)
    return
  }
  await rm(localPath(key), { force: true })
}
