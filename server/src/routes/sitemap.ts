import { Hono } from 'hono'
import { query } from '../db'
import { toSlug } from '../utils/slug'

const sitemap = new Hono()
const site = () => process.env.SITE_URL || 'https://example.com'

sitemap.get('/sitemap.xml', (c) => {
  c.header('Content-Type', 'application/xml')
  return c.body(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${site()}/sitemap-videos.xml</loc></sitemap>
  <sitemap><loc>${site()}/sitemap-names.xml</loc></sitemap>
</sitemapindex>`)
})

sitemap.get('/sitemap-videos.xml', async (c) => {
  const { rows } = await query('SELECT id, name, created_at FROM videos ORDER BY created_at DESC')
  const urls = rows.map((r) => {
    const slug = toSlug(r.name)
    const date = new Date(r.created_at).toISOString().split('T')[0]
    return `  <url>
    <loc>${site()}/v/${r.id}-${slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.7</priority>
    <video:video>
      <video:title>${escXml(r.name)}</video:title>
      <video:content_loc>${site()}/v/${r.id}-${slug}</video:content_loc>
    </video:video>
  </url>`
  }).join('\n')

  c.header('Content-Type', 'application/xml')
  return c.body(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>`)
})

sitemap.get('/sitemap-names.xml', async (c) => {
  const { rows } = await query('SELECT DISTINCT name FROM videos')
  const urls = rows.map((r) => {
    const slug = toSlug(r.name)
    return `  <url>
    <loc>${site()}/n/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
  }).join('\n')

  c.header('Content-Type', 'application/xml')
  return c.body(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`)
})

const escXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export default sitemap
