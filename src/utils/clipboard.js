export async function copyTextToClipboard(text) {
  if (!text) return false
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fallback if clipboard API is blocked or restricted
  }

  try {
    if (typeof document !== 'undefined') {
      const el = document.createElement('textarea')
      el.value = text
      el.setAttribute('readonly', '')
      el.style.position = 'fixed'
      el.style.top = '0'
      el.style.left = '-9999px'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.focus()
      el.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(el)
      return successful
    }
  } catch {
    return false
  }

  return false
}

export function getProductPublicUrl(product) {
  const origin = typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'https://www.maurellefoodpack.store'
  const slug = product?.slug || product?.id || ''
  return `${origin}/collections/${slug}`
}

export function formatProductShareMessage(product) {
  const url = getProductPublicUrl(product)
  const price = product?.price ? `${Number(product.price).toLocaleString('fr-FR')} FCFA` : ''
  const cat = product?.category ? ` • ${product.category}` : ''
  return `📦 *${product?.name || 'Emballage alimentaire'}*${cat}\n💰 *Prix :* ${price || 'Sur demande'}\n✅ En stock & livrable 24/48h au Bénin (Cotonou, Parakou)\n👉 *Commander directement :*\n${url}`
}

export async function shareProduct(product) {
  const url = getProductPublicUrl(product)
  const title = `${product?.name || 'Produit'} | FOODPACK by Maurelle`
  const text = formatProductShareMessage(product)

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      })
      return true
    } catch (err) {
      if (err.name === 'AbortError') return false
    }
  }

  // Fallback to clipboard
  return await copyTextToClipboard(url)
}

export function shareProductToWhatsApp(product) {
  const text = formatProductShareMessage(product)
  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  if (typeof window !== 'undefined') {
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }
}

