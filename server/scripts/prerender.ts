import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { query } from '../src/db'
import { loadNames } from '../src/utils/naming'
import { toSlug } from '../src/utils/slug'
import { buildNamePageHtml } from '../src/utils/htmlBuilder'

const OUT_DIR = path.join(__dirname, '../../dist-prerender')

const main = async () => {
  loadNames()

  const { rows } = await query(
    `SELECT name, COUNT(*) as count FROM videos GROUP BY name ORDER BY count DESC`
  )

  if (rows.length === 0) {
    console.log('⚠️  No videos in DB — skipping pre-render (will run on next deploy after upload)')
    process.exit(0)
  }

  fs.mkdirSync(path.join(OUT_DIR, 'n'), { recursive: true })

  let generated = 0
  for (const row of rows) {
    const slug = toSlug(row.name)
    const dir  = path.join(OUT_DIR, 'n', slug)
    fs.mkdirSync(dir, { recursive: true })
    const html = buildNamePageHtml({
      name:  row.name,
      slug,
      count: parseInt(row.count),
    })
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8')
    generated++
  }

  console.log(`✅ Pre-rendered ${generated} name pages → ${path.join(OUT_DIR, 'n')}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Pre-render failed:', err)
  process.exit(1)
})
