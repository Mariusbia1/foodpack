import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.resolve(rootDir, 'dist')

const BASE_DOMAIN = 'https://www.maurellefoodpack.store'
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://jjzjttcyjirnjzfgjuzm.supabase.co'
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_gugkMvf3Z0-struwty8pGA_vdf9D86s'

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function resolveImageUrl(img) {
  if (!img) return `${BASE_DOMAIN}/foodpack-by-maurelle-banner.png`
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  const cleanPath = img.startsWith('/') ? img : `/${img}`
  return `${BASE_DOMAIN}${cleanPath}`
}

async function getProducts() {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug), product_images(url, sort_order)')
    if (!error && Array.isArray(data) && data.length > 0) {
      console.log(`[prerender] Fetched ${data.length} products from Supabase.`)
      return data
    }
  } catch (err) {
    console.warn('[prerender] Supabase fetch failed, fallback to local data:', err.message)
  }

  // Fallback to local data
  try {
    const localModule = await import('../src/data/products.js')
    if (localModule?.products?.length) {
      console.log(`[prerender] Loaded ${localModule.products.length} products from src/data/products.js`)
      return localModule.products
    }
  } catch (e) {
    console.warn('[prerender] Local products load failed:', e.message)
  }

  return []
}

async function run() {
  const templatePath = path.join(distDir, 'index.html')
  if (!fs.existsSync(templatePath)) {
    console.error('[prerender] Error: dist/index.html not found! Run vite build first.')
    process.exit(1)
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf-8')
  const products = await getProducts()

  let generatedCount = 0

  for (const product of products) {
    const slug = product.slug || String(product.id)
    if (!slug) continue

    const name = escapeHtml(product.name || 'Emballage de qualité')
    const pageTitle = `${name} | FOODPACK by Maurelle Bénin`
    const description = escapeHtml(
      product.short_description ||
      product.shortDescription ||
      product.description ||
      `Commandez ${name} en gros et demi-gros chez FOODPACK by Maurelle (Cotonou & Parakou, Bénin). Qualité supérieure & expédition rapide.`
    ).slice(0, 200)

    const rawImage = Array.isArray(product.product_images) && product.product_images.length > 0
      ? product.product_images.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))[0]?.url
      : (Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : (product.image || '/products/bouteille-pet.webp'))
    const imageUrl = resolveImageUrl(rawImage)
    const canonicalUrl = `${BASE_DOMAIN}/collections/${slug}`

    // Replace meta tags specifically
    let customizedHtml = baseHtml

    // Title tag
    customizedHtml = customizedHtml.replace(
      /<title>.*?<\/title>/i,
      `<title>${escapeHtml(pageTitle)}</title>`
    )

    // Meta description
    customizedHtml = customizedHtml.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${description}" />`
    )

    // Canonical link
    customizedHtml = customizedHtml.replace(
      /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`
    )

    // OpenGraph meta tags
    customizedHtml = customizedHtml.replace(
      /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:url" content="${canonicalUrl}" />`
    )
    customizedHtml = customizedHtml.replace(
      /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`
    )
    customizedHtml = customizedHtml.replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:description" content="${description}" />`
    )
    customizedHtml = customizedHtml.replace(
      /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:image" content="${imageUrl}" />`
    )
    customizedHtml = customizedHtml.replace(
      /<meta\s+property="og:image:secure_url"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:image:secure_url" content="${imageUrl}" />`
    )

    // Twitter meta tags
    customizedHtml = customizedHtml.replace(
      /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`
    )
    customizedHtml = customizedHtml.replace(
      /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:description" content="${description}" />`
    )
    customizedHtml = customizedHtml.replace(
      /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:image" content="${imageUrl}" />`
    )

    const targetDir = path.join(distDir, 'collections', slug)
    fs.mkdirSync(targetDir, { recursive: true })
    fs.writeFileSync(path.join(targetDir, 'index.html'), customizedHtml, 'utf-8')
    generatedCount++
  }

  console.log(`[prerender] Successfully generated ${generatedCount} social-optimized product pages in dist/collections/!`)
}

run().catch((err) => {
  console.error('[prerender] Fatal error:', err)
  process.exit(1)
})
