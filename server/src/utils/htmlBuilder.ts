const SITE_URL = () => process.env.SITE_URL || ''

export interface VideoRow {
  id: number
  cf_url: string
  name: string
  created_at: string
  slug?: string
}

export const buildShell = ({
  title,
  metaTags = [],
  schemaJson = '',
  canonical = '',
}: {
  title: string
  metaTags?: string[]
  schemaJson?: string
  canonical?: string
}): string => `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)}</title>
  ${canonical ? `<link rel="canonical" href="${escHtml(canonical)}" />` : ''}
  ${metaTags.join('\n  ')}
  ${schemaJson ? `<script type="application/ld+json">${schemaJson}<\/script>` : ''}
  <link rel="stylesheet" crossorigin href="/assets/index-QhYmeNX7.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #app { height: 100%; width: 100%; overflow: hidden; background: #000; color: #fff; font-family: system-ui, sans-serif; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/assets/main.js"><\/script>
</body>
</html>`

export const buildVideoMeta = (video: VideoRow): string[] => [
  `<meta name="description" content="Xem video ${escHtml(video.name)} chất lượng cao." />`,
  `<meta property="og:type" content="video.other" />`,
  `<meta property="og:title" content="${escHtml(video.name)}" />`,
  `<meta property="og:url" content="${SITE_URL()}/v/${video.id}-${video.slug}" />`,
  `<meta property="og:video" content="${escHtml(video.cf_url)}" />`,
  `<meta property="og:video:type" content="video/mp4" />`,
  `<meta property="og:video:width" content="1280" />`,
  `<meta property="og:video:height" content="720" />`,
]

export const buildVideoSchema = (video: VideoRow): string =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: `Xem video ${video.name}`,
    contentUrl: video.cf_url,
    uploadDate: video.created_at,
    url: `${SITE_URL()}/v/${video.id}-${video.slug}`,
  })

export const buildNamePageHtml = ({
  name,
  slug,
  count,
}: {
  name: string
  slug: string
  count: number
}): string => {
  const siteUrl = SITE_URL()
  const title = `${name} - Tổng hợp video | VideoSite`
  const description = `Xem tất cả ${count} video về ${name}. Cập nhật mới nhất.`
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: `${siteUrl}/n/${slug}`,
  })

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)}</title>
  <link rel="canonical" href="${siteUrl}/n/${slug}" />
  <meta name="description" content="${escHtml(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escHtml(title)}" />
  <meta property="og:url" content="${siteUrl}/n/${slug}" />
  <script type="application/ld+json">${schema}<\/script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:system-ui,sans-serif;background:#0a0a0a;color:#fff;padding:24px}
    h1{font-size:22px;margin-bottom:8px}
    p{color:#aaa;margin-bottom:24px}
    .back{color:#888;font-size:13px;margin-bottom:20px;display:block}
    .back:hover{color:#fff}
    #app{min-height:100vh}
  </style>
</head>
<body>
  <a class="back" href="/">← Về trang chủ</a>
  <h1>${escHtml(name)}</h1>
  <p>${count} video về chủ đề này</p>
  <div id="app"></div>
  <script type="module" src="/assets/main.js"><\/script>
</body>
</html>`
}

const escHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
