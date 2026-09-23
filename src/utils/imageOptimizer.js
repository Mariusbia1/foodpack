/**
 * Client-side Image Optimization Utility
 * Compresses and resizes high-resolution photos before upload to Supabase Storage.
 * Reduces 5MB-10MB mobile uploads to lightweight ~80-150KB WebP/JPEG images.
 */
export async function compressImage(file, { maxWidth = 1200, maxHeight = 1200, quality = 0.82 } = {}) {
  if (!file || typeof window === 'undefined') return file

  // Keep videos and vector SVGs intact
  if (!file.type || !file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
    return file
  }

  return new Promise((resolve) => {
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          let width = img.width
          let height = img.height

          // Keep dimensions within maximum boundaries while preserving aspect ratio
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width)
              width = maxWidth
            } else {
              width = Math.round((width * maxHeight) / height)
              height = maxHeight
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            return resolve(file)
          }

          ctx.drawImage(img, 0, 0, width, height)

          // Try WebP first, fallback to JPEG if browser doesn't support WebP export
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < file.size) {
                const targetExtension = blob.type === 'image/webp' ? '.webp' : '.jpg'
                const newName = file.name.replace(/\.[^.]+$/, '') + targetExtension
                const compressedFile = new File([blob], newName, {
                  type: blob.type || 'image/webp',
                  lastModified: Date.now(),
                })
                resolve(compressedFile)
              } else {
                resolve(file)
              }
            },
            'image/webp',
            quality
          )
        }
        img.onerror = () => resolve(file)
        img.src = e.target.result
      }
      reader.onerror = () => resolve(file)
      reader.readAsDataURL(file)
    } catch {
      resolve(file)
    }
  })
}
