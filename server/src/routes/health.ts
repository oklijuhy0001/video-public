import { Hono } from 'hono'
import { query } from '../db'

const health = new Hono()

health.get('/', async (c) => {
  try {
    const [v, r] = await Promise.all([
      query('SELECT COUNT(*) FROM videos'),
      query('SELECT COUNT(*) FROM repos'),
    ])
    return c.json({
      status: 'ok',
      service: 'public-web',
      total_videos: parseInt(v.rows[0].count),
      total_repos: parseInt(r.rows[0].count),
      db: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    return c.json({
      status: 'error',
      service: 'public-web',
      db: 'disconnected',
      error: err instanceof Error ? err.message : 'unknown',
      timestamp: new Date().toISOString(),
    }, 500)
  }
})

export default health
