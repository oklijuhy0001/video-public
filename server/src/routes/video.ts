import { Hono } from 'hono'
import { query } from '../db'
import { toSlug } from '../utils/slug'
import { buildShell, buildVideoMeta, buildVideoSchema } from '../utils/htmlBuilder'

const videoPage = new Hono()

videoPage.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const id = parseInt(slug.split('-')[0])

  if (isNaN(id)) return c.redirect('/')

  const { rows } = await query('SELECT * FROM videos WHERE id = $1', [id])
  if (!rows.length) return c.redirect('/')

  const video = { ...rows[0], slug: toSlug(rows[0].name) }
  const title = `${video.name} | VideoSite`
  const metaTags = buildVideoMeta(video)
  const schemaJson = buildVideoSchema(video)
  const canonical = `${process.env.SITE_URL || ''}/v/${video.id}-${video.slug}`

  return c.html(buildShell({ title, metaTags, schemaJson, canonical }))
})

export default videoPage
