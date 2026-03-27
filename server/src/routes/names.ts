import { Hono } from 'hono'
import { query } from '../db'
import { toSlug, slugToName } from '../utils/slug'
import { getNames } from '../utils/naming'

const names = new Hono()

// List all names with video count
names.get('/', async (c) => {
  const { rows } = await query(
    `SELECT name, COUNT(*) as count FROM videos GROUP BY name ORDER BY count DESC`
  )
  return c.json(rows.map((r) => ({ name: r.name, slug: toSlug(r.name), count: parseInt(r.count) })))
})

// Videos by name slug
names.get('/:slug/videos', async (c) => {
  const slug = c.req.param('slug')
  const page  = Math.max(1, parseInt(c.req.query('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')))
  const offset = (page - 1) * limit

  const name = slugToName(getNames(), slug)
  if (!name) return c.json({ error: 'Not found' }, 404)

  const [countRes, dataRes] = await Promise.all([
    query('SELECT COUNT(*) FROM videos WHERE name = $1', [name]),
    query('SELECT * FROM videos WHERE name = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [name, limit, offset]),
  ])

  return c.json({
    name,
    slug,
    videos: dataRes.rows.map((r) => ({ ...r, slug: toSlug(r.name) })),
    total: parseInt(countRes.rows[0].count),
    page,
    limit,
  })
})

export default names
