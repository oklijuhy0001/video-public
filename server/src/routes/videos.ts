import { Hono } from 'hono'
import { query } from '../db'
import { toSlug } from '../utils/slug'

const videos = new Hono()

// Feed: seed-based random pagination
videos.get('/', async (c) => {
  let seed = parseFloat(c.req.query('seed') || 'NaN')
  if (isNaN(seed) || seed < -1 || seed > 1) {
    seed = (Date.now() / 1000) % 2 - 1
  }
  const offset = Math.max(0, parseInt(c.req.query('offset') || '0'))
  const limit  = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '10')))

  await query('SELECT SETSEED($1)', [seed])
  const countRes = await query('SELECT COUNT(*) FROM videos')
  const total = parseInt(countRes.rows[0].count)

  const dataRes = await query(
    `SELECT id, cf_url, name, created_at FROM videos ORDER BY RANDOM() LIMIT $1 OFFSET $2`,
    [limit, offset]
  )

  const rows = dataRes.rows.map((r) => ({ ...r, slug: toSlug(r.name) }))
  return c.json({ videos: rows, total, seed, offset })
})

// Single video
videos.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const { rows } = await query('SELECT * FROM videos WHERE id = $1', [id])
  if (!rows.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ ...rows[0], slug: toSlug(rows[0].name) })
})

export default videos
