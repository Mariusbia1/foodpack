import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import SEO from '../../components/common/SEO'
import { useCart } from '../../contexts/CartContext'
import { formatCurrency } from '../../utils/formatCurrency'
import { createWhatsAppMessage, whatsappUrl } from '../../services/whatsappService'
import { createOrder } from '../../services/orderService'
import { useCatalog } from '../../contexts/CatalogContext'
import PhoneInput from '../../components/common/PhoneInput'
import { formatErrorMessage } from '../../utils/formatError'

const initialForm = {
  name: '',
  phone: '',
  city: 'Cotonou',
  address: '',
  delivery: 'Livraison express à domicile / restaurant',
  comment: '',
  terms: true,
}

export default function CheckoutPage() {
  const { items, subtotal, promo, discountAmount, deliveryFee, total, clearCart } = useCart()
  const { settings } = useCatalog()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  if (!items.length) return <Navigate to="/panier" replace />

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const missing = ['name', 'phone', 'city', 'address', 'delivery'].some((k) => !String(form[k] || '').trim())
    if (missing) return toast.error('Veuillez renseigner tous les champs obligatoires (*).')
    if (!form.terms) return toast.error('Veuillez accepter les conditions de commande.')

    setSubmitting(true)
    try {
      // 1. Save to Supabase (or local fallback)
      let order = null
      try {
        order = await createOrder(
          {
            ...form,
            promo_code: promo?.code,
            discount_amount: discountAmount,
            delivery_fee: deliveryFee,
          },
          items
        )
      } catch (err) {
        console.warn('Order DB sync notice:', err.message)
      }

      const secureTotal = order?.total ?? total

      // 2. Open WhatsApp Message
      const waMsg = createWhatsAppMessage(
        form,
        items,
        secureTotal,
        discountAmount,
        promo?.code,
        settings.shop_name,
        deliveryFee,
        subtotal
      )
      window.open(whatsappUrl(waMsg, settings.whatsapp), '_blank', 'noopener,noreferrer')

      // 3. Store in session and navigate
      sessionStorage.setItem(
        'foodpack-last-order',
        JSON.stringify({ form, items, total: secureTotal, order })
      )
      clearCart()
      navigate('/commande/confirmation')
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Impossible d’enregistrer la commande. Veuillez vérifier vos coordonnées.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <SEO title="Finaliser ma commande | FOOD PACK" />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            to="/panier"
            className="grid h-10 w-10 place-items-center rounded-full bg-[#F0EEED] text-black hover:bg-black hover:text-white transition"
            aria-label="Retour au panier"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="shop-title-display text-2xl font-black text-black sm:text-3xl">
            FINALISER MA COMMANDE
          </h1>
        </div>

        {/* 2-Column Grid */}
        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
          {/* Customer Info Form */}
          <div className="space-y-6">
            <div className="rounded-[20px] border border-black/10 p-6 sm:p-8 space-y-5">
              <h2 className="text-lg font-bold text-black">Informations de livraison</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase text-black/60">Nom complet *</label>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ex. Aïcha Dossou / Restaurant Le Jardin"
                    className="mt-1 w-full rounded-full border border-black/15 bg-[#F0EEED] px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-black/60">Numéro de Téléphone / WhatsApp *</label>
                  <div className="mt-1">
                    <PhoneInput
                      required
                      value={form.phone}
                      onChange={(val) => setForm((c) => ({ ...c, phone: val }))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase text-black/60">Ville *</label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-full border border-black/15 bg-[#F0EEED] px-4 py-3 text-sm outline-none"
                  >
                    <option value="Cotonou">Cotonou</option>
                    <option value="Parakou">Parakou</option>
                    <option value="Abomey-Calavi">Abomey-Calavi</option>
                    <option value="Porto-Novo">Porto-Novo</option>
                    <option value="Bohicon">Bohicon</option>
                    <option value="Ouidah">Ouidah</option>
                    <option value="Natitingou">Natitingou</option>
                    <option value="Autre ville">Autre ville du Bénin</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-black/60">Quartier & Précisions *</label>
                  <input
                    required
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Ex. Haie Vive / Albarika, rue 12, face pharmacie"
                    className="mt-1 w-full rounded-full border border-black/15 bg-[#F0EEED] px-4 py-3 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-black/60">Mode de livraison *</label>
                <select
                  name="delivery"
                  value={form.delivery}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-full border border-black/15 bg-[#F0EEED] px-4 py-3 text-sm outline-none"
                >
                  <option value="Livraison express à domicile / restaurant">
                    Livraison express à domicile / restaurant
                  </option>
                  <option value="Retrait direct au showroom (Cotonou / Parakou)">
                    Retrait direct au showroom (Cotonou / Parakou)
                  </option>
                  <option value="Expédition par gare / transporteur">
                    Expédition par gare / transporteur (Toutes villes du Bénin)
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-black/60">Note ou instructions particulières</label>
                <textarea
                  name="comment"
                  rows={3}
                  value={form.comment}
                  onChange={handleChange}
                  placeholder="Horaires de disponibilité, besoin de facture, personnalisation..."
                  className="mt-1 w-full resize-none rounded-2xl border border-black/15 bg-[#F0EEED] p-4 text-sm outline-none"
                />
              </div>

              <label className="flex items-start gap-3 pt-2 text-xs text-black/70 cursor-pointer">
                <input
                  type="checkbox"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                  className="mt-0.5 accent-black"
                />
                <span>
                  J’accepte les conditions de commande et la transmission instantanée du récapitulatif sur WhatsApp.
                </span>
              </label>
            </div>
          </div>

          {/* Order Summary & WhatsApp Validation */}
          <aside className="h-fit rounded-[20px] border border-black/10 p-6">
            <h2 className="text-xl font-bold text-black">Articles ({items.length})</h2>

            <div className="mt-4 divide-y divide-black/10 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.lineKey} className="flex items-center gap-3 py-3">
                  <div className="h-12 w-12 shrink-0 rounded-lg bg-[#F0EEED] p-1">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800'}
                      alt={item.name}
                      className="h-full w-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 text-xs">
                    <b className="line-clamp-1 text-black">{item.name}</b>
                    <p className="text-black/50">
                      Qté : {item.quantity} {item.capacity ? `· ${item.capacity}` : ''}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-black">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-black/10 pt-4 text-sm">
              <div className="flex justify-between text-black/60">
                <span>Sous-total</span>
                <span className="font-bold text-black">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#FF3333]">
                  <span>Remise ({promo?.code})</span>
                  <span className="font-bold">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-black/60">
                <span>Livraison</span>
                {deliveryFee > 0 ? (
                  <span className="font-bold text-black">{formatCurrency(deliveryFee)}</span>
                ) : (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                    À régler avec le livreur
                  </span>
                )}
              </div>
              <div className="border-t border-black/10 pt-3">
                <div className="flex justify-between text-base font-bold">
                  <span className="text-black">Total net</span>
                  <span className="text-xl font-black text-black">{formatCurrency(total)}</span>
                </div>
                {deliveryFee === 0 && (
                  <p className="mt-1 text-right text-[11px] text-black/50">
                    Frais de livraison à régler séparément au coursier
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="shop-btn-black mt-6 flex w-full items-center justify-center gap-2 py-4 text-sm font-bold"
            >
              <MessageCircle className="h-4 w-4 text-[#01AB31]" />
              <span>{submitting ? 'Validation...' : 'Envoyer la commande sur WhatsApp'}</span>
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-black/50">
              <ShieldCheck className="h-4 w-4 text-[#01AB31]" />
              <span>Paiement sécurisé à la livraison ou par MoMo/Wave</span>
            </div>
          </aside>
        </form>
      </div>
    </>
  )
}
