/**
 * Résout de manière uniforme le prix minimum, maximum et promotionnel d'un produit,
 * qu'il possède des variantes ou un prix standard unique.
 */
export function resolveProductPricing(product) {
  if (!product) {
    return {
      hasVariants: false,
      variantPrices: [],
      minPrice: 0,
      maxPrice: 0,
      isMultiPrice: false,
      oldPrice: null,
      hasDiscount: false,
      discountPercent: 0,
    }
  }

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0
  const variantPrices = hasVariants
    ? product.variants.map((v) => Number(v.price) || 0).filter((p) => p > 0)
    : []

  const minPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : Number(product.price || 0)
  const maxPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : Number(product.price || 0)
  const isMultiPrice = hasVariants && minPrice < maxPrice

  const rawOldPrice = product.oldPrice ? Number(product.oldPrice) : null
  const hasDiscount = Boolean(rawOldPrice && rawOldPrice > minPrice)
  const discountPercent = hasDiscount
    ? Math.round(((rawOldPrice - minPrice) / rawOldPrice) * 100)
    : 0

  return {
    hasVariants,
    variantPrices,
    minPrice,
    maxPrice,
    isMultiPrice,
    oldPrice: rawOldPrice,
    hasDiscount,
    discountPercent,
  }
}
