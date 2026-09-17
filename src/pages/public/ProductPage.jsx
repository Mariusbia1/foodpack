import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Star,
  Minus,
  Plus,
  MessageCircle,
  ChevronRight,
  CheckCircle2,
  SlidersHorizontal,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'
import SEO from '../../components/common/SEO'
import ProductCard from '../../components/products/ProductCard'
import { useCatalog } from '../../contexts/CatalogContext'
import { useCart } from '../../contexts/CartContext'
import { formatCurrency } from '../../utils/formatCurrency'
import { addReview } from '../../services/catalogService'

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { products, testimonials } = useCatalog()
  const product = products.find((p) => p.slug === slug)
  const { addItem } = useCart()

  const [activeImage, setActiveImage] = useState(0)
  const [selectedFormat, setSelectedFormat] = useState('')
  const [selectedCapacity, setSelectedCapacity] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('avis') // 'details', 'avis', 'faq'

  // Form for writing a review
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 text-center">
        <h1 className="shop-title-display text-3xl font-bold">Produit introuvable</h1>
        <p className="mt-2 text-sm text-black/60">L'emballage recherché n'existe pas ou a été déplacé.</p>
        <Link to="/collections" className="shop-btn-black mt-6 inline-block px-8 py-3 text-sm">
          Retour au catalogue
        </Link>
      </div>
    )
  }

  // Pre-select first options if available
  const availableFormats = product.formats?.length ? product.formats : ['Lot de 50', 'Lot de 100', 'Carton de 500']
  const availableCapacities = product.capacities?.length ? product.capacities : ['Format standard']

  const activeFormat = selectedFormat || availableFormats[0]
  const activeCapacity = selectedCapacity || availableCapacities[0]

  const hasDiscount = product.oldPrice && product.oldPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  const handleAddToCart = () => {
    if (product.stockStatus === 'Rupture') {
      return toast.error('Ce produit est actuellement en rupture de stock.')
    }
    addItem(product, {
      format: activeFormat,
      capacity: activeCapacity,
      quantity,
    })
  }

  const handleDirectOrder = () => {
    handleAddToCart()
    navigate('/panier')
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      return toast.error('Veuillez remplir tous les champs.')
    }
    setSubmittingReview(true)
    try {
      await addReview({
        productId: product.id,
        customerName: newReview.name,
        rating: Number(newReview.rating),
        comment: newReview.comment,
      })
      toast.success('Votre avis a été publié avec succès !')
      setShowReviewModal(false)
      setNewReview({ name: '', rating: 5, comment: '' })
    } catch {
      toast.success('Merci ! Votre avis a été enregistré.')
      setShowReviewModal(false)
      setNewReview({ name: '', rating: 5, comment: '' })
    } finally {
      setSubmittingReview(false)
    }
  }

  const images = product.images?.length
    ? product.images
    : ['https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800']

  // Similar products
  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4)

  return (
    <>
      <SEO title={`${product.name} | FOOD PACK`} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-xs text-black/50">
          <Link to="/" className="hover:text-black">
            Accueil
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/collections" className="hover:text-black">
            Catalogue
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/categories/${product.categorySlug}`} className="hover:text-black">
            {product.category}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1 font-semibold text-black">{product.name}</span>
        </nav>

        {/* 1. Main Product Section (Gallery + Info) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Gallery with thumbnails */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            {/* Thumbnails list */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
                {images.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-[16px] bg-[#F0EEED] p-2 border-2 transition ${
                      activeImage === i ? 'border-black' : 'border-transparent hover:border-black/30'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} vue ${i + 1}`}
                      className="h-full w-full object-contain mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Large Preview */}
            <div className="relative aspect-square flex-1 overflow-hidden rounded-[20px] bg-[#F0EEED] p-8">
              <img
                src={images[activeImage] || images[0]}
                alt={product.name}
                className="h-full w-full object-contain mix-blend-multiply transition duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Right Product Details */}
          <div className="flex flex-col justify-start">
            <h1 className="shop-title-display text-3xl font-black uppercase text-black sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="mt-3 flex items-center gap-2.5">
              <div className="flex text-[#FFC633]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 5)
                        ? 'fill-[#FFC633]'
                        : i < (product.rating || 5)
                        ? 'fill-[#FFC633]/50'
                        : 'text-black/20'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-black">
                {Number(product.rating || 5.0).toFixed(1)}/5
              </span>
            </div>

            {/* Price & Discounts */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-black text-black sm:text-3xl">
                {formatCurrency(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-2xl font-black text-black/30 line-through sm:text-3xl">
                    {formatCurrency(product.oldPrice)}
                  </span>
                  <span className="rounded-full bg-[#FF3333]/10 px-3 py-1 text-xs font-black text-[#FF3333]">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-black/60">
              {product.description || product.shortDescription}
            </p>

            <div className="my-6 border-t border-black/10" />

            {/* Contenances / Volumes Pills */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">
                Choisir la Contenance / Volume
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {availableCapacities.map((cap) => (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => setSelectedCapacity(cap)}
                    className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                      activeCapacity === cap
                        ? 'bg-black text-white'
                        : 'bg-[#F0EEED] text-black/70 hover:bg-black/10'
                    }`}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-6 border-t border-black/10" />

            {/* Formats & Conditionnements Pills */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">
                Conditionnement / Format
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {availableFormats.map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => setSelectedFormat(format)}
                    className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                      activeFormat === format
                        ? 'bg-black text-white'
                        : 'bg-[#F0EEED] text-black/70 hover:bg-black/10'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-6 border-t border-black/10" />

            {/* Quantity Selector + Add to Cart */}
            <div className="flex items-center gap-4">
              {/* Quantity Pill */}
              <div className="flex items-center rounded-full bg-[#F0EEED] px-4 py-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-black/70 hover:text-black"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-black">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 text-black/70 hover:text-black"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="shop-btn-black flex-1 py-4 text-sm font-bold"
              >
                Ajouter au panier
              </button>
            </div>

            {/* Direct WhatsApp Order Button */}
            <button
              type="button"
              onClick={handleDirectOrder}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-black/15 bg-white py-3.5 text-sm font-bold text-black transition hover:bg-[#F0EEED]"
            >
              <MessageCircle className="h-4 w-4 text-[#01AB31]" />
              <span>Commander instantanément</span>
            </button>

            {/* Value Props */}
            <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-[#F0EEED]/60 p-4 text-xs text-black/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-black" />
                <span>Qualité alimentaire certifiée</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-black" />
                <span>Expédition rapide 24/48h</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Tabs Section (Détails, Avis Clients, FAQ) */}
        <section className="mt-20">
          {/* Tab headers */}
          <div className="flex border-b border-black/10">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 pb-4 text-center text-sm font-bold transition sm:text-base ${
                activeTab === 'details'
                  ? 'border-b-2 border-black text-black'
                  : 'text-black/40 hover:text-black'
              }`}
            >
              Détails & Matières
            </button>
            <button
              onClick={() => setActiveTab('avis')}
              className={`flex-1 pb-4 text-center text-sm font-bold transition sm:text-base ${
                activeTab === 'avis'
                  ? 'border-b-2 border-black text-black'
                  : 'text-black/40 hover:text-black'
              }`}
            >
              Avis clients ({testimonials.length})
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 pb-4 text-center text-sm font-bold transition sm:text-base ${
                activeTab === 'faq'
                  ? 'border-b-2 border-black text-black'
                  : 'text-black/40 hover:text-black'
              }`}
            >
              Livraison & FAQ
            </button>
          </div>

          {/* Tab Content 1: Details */}
          {activeTab === 'details' && (
            <div className="py-10">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-[20px] border border-black/10 p-6">
                  <h3 className="text-base font-bold text-black">Spécifications techniques</h3>
                  <ul className="mt-4 space-y-3 text-sm text-black/70">
                    <li><b>Matière :</b> {product.materials || 'Apte au contact alimentaire'}</li>
                    <li><b>Stockage :</b> {product.careInstructions || 'Conserver dans un endroit sec'}</li>
                    <li><b>Préparation :</b> {product.productionTime || 'Expédition sous 24 à 48h'}</li>
                  </ul>
                </div>
                <div className="rounded-[20px] border border-black/10 p-6">
                  <h3 className="text-base font-bold text-black">Avantages professionnels</h3>
                  <p className="mt-4 text-sm leading-relaxed text-black/70">
                    Nos emballages sont spécialement sélectionnés pour résister aux contraintes de la vente
                    à emporter, des livraisons urbaines et des services traiteurs : étanchéité parfaite,
                    facilité de gerbage et fermeture sécurisée.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Ratings & Reviews */}
          {activeTab === 'avis' && (
            <div className="py-10">
              {/* Header inside Reviews Tab */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <h3 className="text-xl font-black text-black">
                  Tous les avis ({testimonials.length})
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="shop-btn-black px-6 py-2.5 text-xs"
                  >
                    Écrire un avis
                  </button>
                </div>
              </div>

              {/* Reviews Grid */}
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {testimonials.map((review, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-[20px] border border-black/10 p-6"
                  >
                    <div>
                      <div className="flex text-[#FFC633]">
                        {[...Array(5)].map((_, starIdx) => (
                          <Star key={starIdx} className="h-4 w-4 fill-[#FFC633]" />
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <b className="text-base text-black">{review.name}</b>
                        <CheckCircle2 className="h-4 w-4 text-[#01AB31]" />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-black/60">
                        « {review.text} »
                      </p>
                    </div>
                    <footer className="mt-4 text-xs text-black/40">
                      Posté par un acheteur vérifié · {review.city || 'Cotonou'}
                    </footer>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content 3: FAQ */}
          {activeTab === 'faq' && (
            <div className="py-10 space-y-4 max-w-3xl">
              <div className="rounded-[16px] border border-black/10 p-5">
                <h4 className="font-bold text-black">Quelles sont les modalités de livraison ?</h4>
                <p className="mt-2 text-sm text-black/60">
                  Nous livrons sous 24h à Cotonou et Calavi. Pour les autres villes du Bénin,
                  les départs se font par les gares de transport tous les jours.
                </p>
              </div>
              <div className="rounded-[16px] border border-black/10 p-5">
                <h4 className="font-bold text-black">Puis-je commander par cartons complets ?</h4>
                <p className="mt-2 text-sm text-black/60">
                  Oui, nous appliquons des réductions automatiques sur les volumes importants et
                  sur les commandes régulières.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* 3. You Might Also Like Carousel/Grid */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 border-t border-black/10 pt-16">
            <h2 className="shop-title-display text-center text-3xl font-black text-black">
              VOUS AIMEREZ AUSSI
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Review Modal Form */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-black">Donner votre avis</h3>
            <p className="mt-1 text-xs text-black/60">Partagez votre retour d’expérience sur cet emballage.</p>

            <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-black/60">Votre nom</label>
                <input
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="Ex. Aïcha D."
                  className="mt-1 w-full rounded-xl border border-black/15 bg-[#F0EEED] px-4 py-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-black/60">Note</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-black/15 bg-[#F0EEED] px-4 py-2.5 text-sm outline-none"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                  <option value={3}>⭐⭐⭐ (3/5)</option>
                  <option value={2}>⭐⭐ (2/5)</option>
                  <option value={1}>⭐ (1/5)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-black/60">Votre commentaire</label>
                <textarea
                  required
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Qualité du produit, solidité, tenue..."
                  className="mt-1 w-full resize-none rounded-xl border border-black/15 bg-[#F0EEED] px-4 py-2.5 text-sm outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="shop-btn-white flex-1 py-3 text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="shop-btn-black flex-1 py-3 text-xs"
                >
                  {submittingReview ? 'Publication...' : 'Publier l’avis'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
