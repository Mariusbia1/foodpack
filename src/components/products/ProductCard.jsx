import { Link } from 'react-router-dom'
import { Star, ArrowRight } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { resolveProductPricing } from '../../utils/productPricing'

export default function ProductCard({ product }) {
  const {
    hasVariants,
    variantPrices,
    minPrice,
    isMultiPrice,
    hasDiscount,
    discountPercent,
  } = resolveProductPricing(product)

  const displayImage =
    product.images?.[0] || '/products/bouteille-pet.webp'

  const capacityList = (product.capacities && product.capacities.length > 0)
    ? product.capacities
    : hasVariants
    ? product.variants.map((v) => v.capacity || v.name).filter(Boolean)
    : []

  return (
    <article className="group relative flex flex-col rounded-[24px] border border-black/5 bg-white p-3 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-black/15 hover:shadow-xl">
      {/* 1. Image Container */}
      <Link
        to={`/collections/${product.slug}`}
        className="relative block aspect-square w-full overflow-hidden rounded-[20px] bg-[#F7F6F5]"
      >
        <img
          loading="lazy"
          decoding="async"
          src={displayImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 right-3 flex items-center justify-between gap-2">
          {product.category && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-black border border-black/10 shadow-xs">
              {product.category}
            </span>
          )}

          {hasDiscount ? (
            <span className="rounded-full bg-[#FF3333] px-2.5 py-1 text-[10px] font-extrabold text-white shadow-xs">
              -{discountPercent}%
            </span>
          ) : product.stockStatus === 'Rupture' ? (
            <span className="rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-bold uppercase text-white shadow-xs">
              Rupture
            </span>
          ) : hasVariants && variantPrices.length > 1 ? (
            <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
              {product.variants.length} formats
            </span>
          ) : null}
        </div>

        {/* Hover Quick Action Pill */}
        <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-center gap-1.5 rounded-full bg-black py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-neutral-800">
            <span>Commander</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </Link>

      {/* 2. Product Info */}
      <div className="mt-3.5 flex flex-1 flex-col px-1 pb-1">
        {/* Capacities / Formats Preview */}
        {capacityList.length > 0 && (
          <p className="text-[11px] font-medium text-black/50 line-clamp-1">
            {capacityList.slice(0, 3).join(' · ')}
          </p>
        )}

        <Link
          to={`/collections/${product.slug}`}
          className="mt-1 line-clamp-2 text-sm font-bold text-black transition hover:text-[#FF3333] sm:text-[15px]"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating Stars */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex text-[#FFC633]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating || 5)
                    ? 'fill-[#FFC633]'
                    : i < (product.rating || 5)
                    ? 'fill-[#FFC633]/50'
                    : 'text-black/20'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-black/70">
            {Number(product.rating || 5.0).toFixed(1)}/5
          </span>
        </div>

        {/* Price & Discounts */}
        <div className="mt-2.5 flex items-baseline gap-1.5 flex-nowrap whitespace-nowrap">
          {isMultiPrice && (
            <span className="text-xs font-semibold text-black/50 shrink-0">Dès</span>
          )}
          <span className="font-sans text-[15px] font-extrabold text-black tracking-tight sm:text-base shrink-0 whitespace-nowrap">
            {formatCurrency(minPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs font-semibold text-black/40 line-through shrink-0 whitespace-nowrap">
              {formatCurrency(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
