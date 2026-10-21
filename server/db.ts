import pg from 'pg'

// Cached on globalThis so warm serverless instances and Vite dev reloads reuse one pool.
const globalForDb = globalThis as unknown as { calorieTrackerPool?: pg.Pool }

function pool(): pg.Pool {
  if (!globalForDb.calorieTrackerPool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) throw new Error('DATABASE_URL is not set')
    globalForDb.calorieTrackerPool = new pg.Pool({ connectionString, max: 5 })
  }
  return globalForDb.calorieTrackerPool
}

export function query<T extends pg.QueryResultRow>(text: string, params: unknown[] = []) {
  return pool().query<T>(text, params)
}
