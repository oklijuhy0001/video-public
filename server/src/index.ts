import 'dotenv/config'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { loadNames } from './utils/naming'
import health from './routes/health'
import videos from './routes/videos'
import videoPage from './routes/video'
import names from './routes/names'
import sitemap from './routes/sitemap'

loadNames()

const app = new Hono()
app.use('*', cors())

// 1. Health
app.route('/health', health)

// 2. Sitemaps
app.route('/', sitemap)

// 3. API
app.route('/api/public/videos', videos)
app.route('/api/public/names', names)

// 4. /v/:slug — meta inject for SEO
app.route('/v', videoPage)

// 5. /n/* — serve pre-rendered static HTML
app.use('/n/*', serveStatic({ root: '../dist-prerender' }))

// 6. /* — serve Vue 3 SPA
app.use('/*', serveStatic({ root: '../client/dist' }))

// 7. SPA fallback
app.get('/*', serveStatic({ path: '../client/dist/index.html' }))

const port = parseInt(process.env.PORT || '3001')
console.log(`🚀 video-public-web running on port ${port}`)
serve({ fetch: app.fetch, port })
