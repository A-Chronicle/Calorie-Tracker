export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
}

// Calls a route under /api. Sends the session cookie automatically and throws ApiError on failure.
export async function api<T = void>(path: string, { method = 'GET', body }: ApiOptions = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'same-origin',
  })
  if (response.status === 204) return undefined as T

  const data = (await response.json().catch(() => ({}))) as { error?: string }
  if (!response.ok) {
    throw new ApiError(response.status, data.error ?? `Request failed (${response.status})`)
  }
  return data as T
}

// Uploads a compressed photo (a data URL from the browser) and returns the storage key to attach to a meal.
export async function uploadPhoto(dataUrl: string): Promise<string> {
  const blob = await (await fetch(dataUrl)).blob()
  const response = await fetch('/api/photos', {
    method: 'POST',
    headers: { 'Content-Type': blob.type },
    body: blob,
    credentials: 'same-origin',
  })
  const data = (await response.json().catch(() => ({}))) as { key?: string; error?: string }
  if (!response.ok || !data.key) {
    throw new ApiError(response.status, data.error ?? 'Photo upload failed')
  }
  return data.key
}
