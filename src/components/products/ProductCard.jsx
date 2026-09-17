import { Link } from 'react-router-dom'
import { Star, ArrowRight } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

export default function ProductCard({ product }) {
  const hasDiscount = product.oldPrice && product.oldPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  const displayImage =
    product.images?.[0] || '/products/bouteille-pet.jpg'

  return (
    <article className="group relative flex flex-col rounded-[24px] border border-black/5 bg-white p-3 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-black/15 hover:shadow-xl">
      {/* 1. Image Container */}
      <Link
        to={`/collections/${product.slug}`}
        className="relative block aspect-square w-full overflow-hidden rounded-[20px] bg-[#F7F6F5]"
      >
        <img
          loading="lazy"
          src={displayImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 right-3 flex items-center justify-between gap-2">
          {product.category && (
            <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-black shadow-xs backdrop-blur-md">
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
          ) : null}
        </div>

        {/* Hover Quick Action Pill */}
        <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-center gap-1.5 rounded-full bg-black/90 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-sm transition hover:bg-black">
            <span>Commander</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </Link>

      {/* 2. Product Info */}
      <div className="mt-3.5 flex flex-1 flex-col px-1 pb-1">
        {/* Capacities / Formats Preview */}
        {product.capacities && product.capacities.length > 0 && (
          <p className="text-[11px] font-medium text-black/50 line-clamp-1">
            {product.capacities.slice(0, 3).join(' · ')}
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
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="font-display text-base font-black text-black sm:text-lg">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs font-bold text-black/40 line-through">
              {formatCurrency(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
