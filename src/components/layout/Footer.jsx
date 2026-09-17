import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MessageCircle, Instagram, Facebook, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { subscribeNewsletter } from '../../services/catalogService'
import { useCatalog } from '../../contexts/CatalogContext'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const { settings } = useCatalog()

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      return toast.error('Veuillez entrer une adresse e-mail valide.')
    }
    setSubscribing(true)
    try {
      await subscribeNewsletter(email)
      toast.success('Merci pour votre inscription à la newsletter !')
      setEmail('')
    } catch {
      toast.success('Votre inscription a bien été prise en compte !')
      setEmail('')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <footer className="relative mt-24 bg-[#F0EEED] pt-36 lg:pt-32">
      {/* 1. Floating Newsletter Black Card */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 rounded-[20px] bg-black p-8 text-white shadow-2xl md:flex-row md:p-12">
          <h2 className="shop-title-display text-2xl font-black leading-tight sm:text-3xl md:max-w-md lg:text-4xl">
            RESTEZ INFORMÉ DE NOS OFFRES & NOUVEAUTÉS
          </h2>

          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-md flex-col gap-3.5 sm:w-auto sm:min-w-[340px]"
          >
            <div className="flex items-center rounded-full bg-white px-4 py-3 text-black">
              <Mail className="h-5 w-5 text-black/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre adresse e-mail"
                className="w-full bg-transparent pl-3 text-sm text-black outline-none placeholder:text-black/40"
              />
            </div>
            <button
              type="submit"
              disabled={subscribing}
              className="flex items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-bold text-black transition duration-200 hover:bg-white/90 disabled:opacity-75"
            >
              <span>{subscribing ? 'Inscription...' : 'S’inscrire à la newsletter'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. Main Multi-Column Footer */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="font-display text-2xl font-black uppercase tracking-[-0.04em] text-black sm:text-3xl"
            >
              FOOD PACK<span className="text-[#FF3333]">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-black/60">
              Fournisseur d’emballages alimentaires professionnels, bouteilles de bissap et jus,
              boîtes kraft et barquettes pour vos restaurants, traiteurs et événements.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={`https://wa.me/${String(settings.whatsapp || '2290100000000').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-white text-black transition hover:bg-black hover:text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={settings.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-white text-black transition hover:bg-black hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={settings.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-white text-black transition hover:bg-black hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Entreprise */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black">
              Entreprise
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-black/60">
              <li>
                <Link to="/a-propos" className="transition hover:text-black">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/collections" className="transition hover:text-black">
                  Nos collections
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-black">
                  Devis gros volumes
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-black">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Aide */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black">
              Aide & Services
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-black/60">
              <li>
                <Link to="/contact" className="transition hover:text-black">
                  Service client
                </Link>
              </li>
              <li>
                <Link to="/livraison-et-retours" className="transition hover:text-black">
                  Livraison Cotonou & Bénin
                </Link>
              </li>
              <li>
                <Link to="/conditions-generales" className="transition hover:text-black">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link to="/politique-de-confidentialite" className="transition hover:text-black">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: FAQ & Produits */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black">
              Produits Phares
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-black/60">
              <li>
                <Link to="/categories/jus-boissons" className="transition hover:text-black">
                  Bouteilles Bissap & Jus
                </Link>
              </li>
              <li>
                <Link to="/categories/emballages-kraft" className="transition hover:text-black">
                  Boîtes repas kraft
                </Link>
              </li>
              <li>
                <Link to="/categories/plats-barquettes" className="transition hover:text-black">
                  Barquettes micro-ondables
                </Link>
              </li>
              <li>
                <Link to="/categories/gobelets-patisserie" className="transition hover:text-black">
                  Gobelets smoothies & dômes
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Bar with Payment badges */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row">
          <p className="text-xs text-black/60">
            Food Pack © 2026, Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-black/70">
            <span className="rounded bg-white px-2.5 py-1 shadow-sm">MoMo / Flooz</span>
            <span className="rounded bg-white px-2.5 py-1 shadow-sm">Wave</span>
            <span className="rounded bg-white px-2.5 py-1 shadow-sm">Visa / Mastercard</span>
            <span className="rounded bg-white px-2.5 py-1 shadow-sm">Espèces à la livraison</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
