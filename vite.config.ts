import { existsSync } from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const METHODS = ['GET', 'POST', 'PUT', 'DELETE']

// Serves api/** handlers during `npm run dev`, routed the same way Vercel routes them,
// so the API runs locally without `vercel dev`.
function localApi(): Plugin {
  return {
    name: 'local-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)
        if (!url.pathname.startsWith('/api/')) return next()
        void handleApi(server, req, res, url)
      })
    },
  }
}

async function handleApi(server: ViteDevServer, req: IncomingMessage, res: ServerResponse, url: URL) {
  const route = url.pathname.replace(/\/+$/, '')
  if (!/^\/api\/[a-z0-9/-]+$/.test(route) || !existsSync(path.join(server.config.root, `${route}.ts`))) {
    return sendJson(res, 404, { error: 'Not found' })
  }

  const method = req.method ?? 'GET'
  if (!METHODS.includes(method)) return sendJson(res, 405, { error: 'Method not allowed' })

  try {
    const mod = await server.ssrLoadModule(`${route}.ts`)
    const handler = mod[method] as ((request: Request) => Promise<Response>) | undefined
    if (!handler) return sendJson(res, 405, { error: 'Method not allowed' })

    const chunks: Buffer[] = []
    if (method !== 'GET') for await (const chunk of req) chunks.push(chunk as Buffer)

    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
      if (value === undefined || ['host', 'connection', 'content-length'].includes(key)) continue
      headers.set(key, Array.isArray(value) ? value.join(', ') : value)
    }

    const request = new Request(url, {
      method,
      headers,
      body: chunks.length ? Buffer.concat(chunks) : undefined,
    })
    const response = await handler(request)

    res.statusCode = response.status
    response.headers.forEach((value, key) => {
      if (key !== 'set-cookie') res.setHeader(key, value)
    })
    const cookies = response.headers.getSetCookie()
    if (cookies.length) res.setHeader('Set-Cookie', cookies)
    res.end(Buffer.from(await response.arrayBuffer()))
  } catch (error) {
    server.config.logger.error(`[local-api] ${route}: ${String(error)}`)
    sendJson(res, 500, { error: 'Something went wrong' })
  }
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export default defineConfig(({ mode }) => {
  // Server code reads secrets (DATABASE_URL, AI_GATEWAY_API_KEY) from process.env.
  // Vite only exposes VITE_* to the browser, so copying them here stays server-side.
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  return {
    plugins: [react(), tailwindcss(), localApi()],
  }
})
