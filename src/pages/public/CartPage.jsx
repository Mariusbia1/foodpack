import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus, Tag, ArrowRight, ChevronRight, ShoppingBag } from 'lucide-react'
import SEO from '../../components/common/SEO'
import { useCart } from '../../contexts/CartContext'
import { formatCurrency } from '../../utils/formatCurrency'

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    promo,
    applyPromo,
    removePromo,
    discountAmount,
    deliveryFee,
    total,
  } = useCart()

  const [promoInput, setPromoInput] = useState('')
  const [loadingPromo, setLoadingPromo] = useState(false)
  const navigate = useNavigate()

  const handleApplyPromo = async (e) => {
    e.preventDefault()
    if (!promoInput.trim()) return
    setLoadingPromo(true)
    const success = await applyPromo(promoInput)
    setLoadingPromo(false)
    if (success) setPromoInput('')
  }

  if (items.length === 0) {
    return (
      <>
        <SEO title="Votre Panier | FOOD PACK" />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#F0EEED] text-black">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h1 className="shop-title-display mt-6 text-3xl font-black text-black">
            VOTRE PANIER EST VIDE
          </h1>
          <p className="mt-3 text-sm text-black/60">
            Découvrez nos bouteilles de jus, boîtes kraft et barquettes pour démarrer votre commande.
          </p>
          <Link
            to="/collections"
            className="shop-btn-black mt-8 inline-flex items-center gap-2 px-8 py-3.5 text-sm"
          >
            <span>Explorer le catalogue</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title="Votre Panier | FOOD PACK" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-black/50">
          <Link to="/" className="hover:text-black">
            Accueil
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-black">Panier</span>
        </nav>

        <h1 className="shop-title-display text-3xl font-black uppercase text-black sm:text-4xl">
          VOTRE PANIER
        </h1>

        {/* Two Columns Grid (Items List + Order Summary) */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px] lg:gap-12">
          {/* Left Column : Items List */}
          <div className="rounded-[20px] border border-black/10 p-4 sm:p-6 divide-y divide-black/10">
            {items.map((item) => (
              <div key={item.lineKey} className="flex gap-4 py-6 first:pt-0 last:pb-0">
                {/* Product Thumbnail */}
                <Link
                  to={`/collections/${item.slug}`}
                  className="h-28 w-28 shrink-0 overflow-hidden rounded-[16px] bg-[#F0EEED] p-2"
                >
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800'}
                    alt={item.name}
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                </Link>

                {/* Info & Quantity */}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/collections/${item.slug}`}
                        className="text-base font-bold text-black hover:underline sm:text-lg"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-1 space-y-0.5 text-xs text-black/60">
                        {item.capacity && (
                          <p>
                            Contenance : <span className="font-semibold text-black">{item.capacity}</span>
                          </p>
                        )}
                        {item.format && (
                          <p>
                            Format : <span className="font-semibold text-black">{item.format}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.lineKey)}
                      className="rounded-full p-2 text-[#FF3333] hover:bg-[#FF3333]/10"
                      aria-label="Supprimer l'article"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Price & Quantity Controls */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-black text-black sm:text-xl">
                      {formatCurrency(item.price * item.quantity)}
                    </span>

                    <div className="flex items-center rounded-full bg-[#F0EEED] px-3.5 py-1.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.lineKey, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 text-black disabled:opacity-30"
                        aria-label="Diminuer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-black">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.lineKey, item.quantity + 1)}
                        className="p-1 text-black"
                        aria-label="Augmenter"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column : Order Summary (SHOP.CO Style) */}
          <aside className="h-fit rounded-[20px] border border-black/10 p-6">
            <h2 className="text-xl font-bold text-black">Récapitulatif</h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between text-black/60">
                <span>Sous-total</span>
                <span className="font-bold text-black">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-[#FF3333]">
                  <span>Remise ({promo?.discountPercent}%)</span>
                  <span className="font-bold">-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-black/60">
                <span>Frais de livraison</span>
                <span className="font-bold text-black">{formatCurrency(deliveryFee)}</span>
              </div>

              <div className="border-t border-black/10 pt-4 flex justify-between text-base font-bold">
                <span className="text-black">Total</span>
                <span className="text-xl font-black text-black">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="mt-6">
              {promo ? (
                <div className="flex items-center justify-between rounded-full bg-[#01AB31]/10 px-4 py-2.5 text-xs text-[#01AB31]">
                  <span className="font-bold">Code « {promo.code} » appliqué (-{promo.discountPercent}%)</span>
                  <button
                    onClick={removePromo}
                    className="font-bold text-black/50 hover:text-black"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="flex flex-1 items-center rounded-full bg-[#F0EEED] px-4 py-2.5 text-sm">
                    <Tag className="h-4 w-4 text-black/40" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Code promo (ex: BIENVENUE10)"
                      className="w-full bg-transparent pl-2 text-xs text-black outline-none uppercase placeholder:normal-case placeholder:text-black/40"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loadingPromo || !promoInput.trim()}
                    className="shop-btn-black px-6 py-2.5 text-xs font-bold disabled:opacity-40"
                  >
                    Appliquer
                  </button>
                </form>
              )}
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/commande')}
              className="shop-btn-black mt-6 flex w-full items-center justify-center gap-2 py-4 text-sm font-bold"
            >
              <span>Valider ma commande</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </aside>
        </div>
      </div>
    </>
  )
}
