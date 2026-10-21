import { readFile } from 'node:fs/promises'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is not set. Add it to .env or the environment.')
  process.exit(1)
}

const sql = await readFile(new URL('../server/schema.sql', import.meta.url), 'utf8')
const client = new pg.Client({ connectionString })
await client.connect()
try {
  await client.query(sql)
  console.log('Schema is up to date.')
} finally {
  await client.end()
}
