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
