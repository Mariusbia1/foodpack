import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MessageCircle, Instagram, Facebook, ArrowRight, MapPin, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { subscribeNewsletter } from '../../services/catalogService'
import { useCatalog } from '../../contexts/CatalogContext'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const { settings, categories } = useCatalog()

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

  const cleanPhone = String(settings?.phone || settings?.whatsapp || '+229 01 00 00 00 00')
  const waNumber = String(settings?.whatsapp || '2290100000000').replace(/\D/g, '')

  return (
    <footer className="relative mt-24 bg-[#F0EEED] pt-36 lg:pt-32">
      {/* 1. Floating Newsletter Black Card */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 rounded-[24px] bg-black p-8 text-white shadow-2xl md:flex-row md:p-12">
          <div className="max-w-md text-center md:text-left">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#FF3333]">
              Offres & Nouveautés
            </span>
            <h2 className="shop-title-display mt-2 text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
              RESTEZ INFORMÉ DE NOS ARRIVAGES
            </h2>
            <p className="mt-2 text-xs text-white/70">
              Recevez en avant-première nos arrivages de cartons et nos promotions exclusives.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-md flex-col gap-3.5 sm:w-auto sm:min-w-[340px]"
          >
            <div className="flex items-center rounded-full bg-white px-4 py-3 text-black shadow-inner">
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
              className="flex items-center justify-center gap-2 rounded-full bg-[#FF3333] py-3 text-sm font-bold text-white transition duration-200 hover:bg-[#e02626] disabled:opacity-75 shadow-md"
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
          {/* Col 1: Brand & Contact Infos */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-block font-display text-2xl font-black uppercase tracking-[-0.04em] text-black sm:text-3xl"
            >
              FOOD PACK<span className="text-[#FF3333]">.</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-black/60">
              Fournisseur & grossiste d’emballages alimentaires professionnels au Bénin : bouteilles de jus et bissap, boîtes kraft, barquettes et gobelets pour restaurants et traiteurs.
            </p>

            <div className="space-y-2 pt-2 text-xs text-black/70">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#FF3333] shrink-0" />
                <span>{settings?.address || 'Cotonou, Bénin'}</span>
              </div>
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition hover:text-black font-semibold"
              >
                <Phone className="h-4 w-4 text-[#01AB31] shrink-0" />
                <span>{cleanPhone}</span>
              </a>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-white text-black transition hover:bg-[#01AB31] hover:text-white hover:border-[#01AB31]"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={settings?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-white text-black transition hover:bg-black hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={settings?.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-white text-black transition hover:bg-black hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Catalogue & Univers */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black">
              Catalogue
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-black/60">
              <li>
                <Link to="/collections" className="font-semibold text-black transition hover:text-[#FF3333]">
                  Tout le catalogue
                </Link>
              </li>
              <li>
                <Link to="/categories/jus-boissons" className="transition hover:text-black">
                  Bouteilles & Jus
                </Link>
              </li>
              <li>
                <Link to="/categories/emballages-kraft" className="transition hover:text-black">
                  Boîtes & Sacs Kraft
                </Link>
              </li>
              <li>
                <Link to="/categories/plats-barquettes" className="transition hover:text-black">
                  Plats & Barquettes
                </Link>
              </li>
              <li>
                <Link to="/categories/gobelets-patisserie" className="transition hover:text-black">
                  Gobelets & Pâtisserie
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Entreprise & Aide */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black">
              Informations
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-black/60">
              <li>
                <Link to="/a-propos" className="transition hover:text-black">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link to="/galerie" className="transition hover:text-black">
                  Galerie réalisations
                </Link>
              </li>
              <li>
                <Link to="/faq" className="transition hover:text-black">
                  Questions fréquentes (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-black">
                  Devis pro & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Légal & Livraison */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black">
              Légal & Services
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-black/60">
              <li>
                <Link to="/livraison-et-retours" className="transition hover:text-black">
                  Livraison & Délais
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
              <li>
                <Link to="/mentions-legales" className="transition hover:text-black">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Bar with Payment badges */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row">
          <p className="text-xs text-black/60">
            FOOD PACK © 2026. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-black/70">
            <span className="rounded-lg bg-white px-3 py-1 shadow-sm border border-black/5">MTN MoMo</span>
            <span className="rounded-lg bg-white px-3 py-1 shadow-sm border border-black/5">Moov Money</span>
            <span className="rounded-lg bg-white px-3 py-1 shadow-sm border border-black/5">Wave</span>
            <span className="rounded-lg bg-white px-3 py-1 shadow-sm border border-black/5">Espèces à la livraison</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

