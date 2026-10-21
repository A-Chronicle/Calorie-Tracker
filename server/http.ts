import type { ZodType } from 'zod'

export class HttpError extends Error {
  status: number
  retryAfter?: number

  constructor(status: number, message: string, retryAfter?: number) {
    super(message)
    this.status = status
    this.retryAfter = retryAfter
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof HttpError) {
    const headers: HeadersInit = error.retryAfter ? { 'Retry-After': String(error.retryAfter) } : {}
    return Response.json({ error: error.message }, { status: error.status, headers })
  }
  console.error(error)
  return Response.json({ error: 'Something went wrong' }, { status: 500 })
}

export async function readJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    throw new HttpError(415, 'Expected a JSON body')
  }
  let body: unknown
  try {
    body = await request.json()
  } catch {
    throw new HttpError(400, 'Invalid JSON body')
  }
  const result = schema.safeParse(body)
  if (!result.success) {
    throw new HttpError(400, result.error.issues[0]?.message ?? 'Invalid request')
  }
  return result.data
}
