import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowRight, MapPin, Phone } from 'lucide-react'
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

  // Helper to validate whether a social link is actually defined (and not a placeholder)
  const isValidSocialLink = (url, placeholder) => {
    if (!url || typeof url !== 'string') return false
    const trimmed = url.trim()
    if (!trimmed) return false
    if (placeholder && (trimmed === placeholder || trimmed === `${placeholder}/` || trimmed === `${placeholder}/#`)) {
      return false
    }
    return true
  }

  const rawPhone = settings?.phone || settings?.whatsapp || ''
  const cleanPhone = String(rawPhone).trim()
  const waDigits = String(settings?.whatsapp || '').replace(/\D/g, '')
  const hasWhatsApp = waDigits.length >= 8
  const waUrl = hasWhatsApp ? `https://wa.me/${waDigits}` : null

  const hasInstagram = isValidSocialLink(settings?.instagram, 'https://instagram.com')
  const hasFacebook = isValidSocialLink(settings?.facebook, 'https://facebook.com')
  const hasTikTok = isValidSocialLink(settings?.tiktok, 'https://tiktok.com')

  const hasAnySocial = hasWhatsApp || hasInstagram || hasFacebook || hasTikTok

  return (
    <footer className="relative mt-32 sm:mt-40 bg-[#F0EEED] pt-40 sm:pt-44 lg:pt-36 pb-12">
      {/* 1. Floating Newsletter Black Card */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl px-4 sm:px-6 lg:px-8 z-20">
        <div className="flex flex-col items-center justify-between gap-6 rounded-[24px] bg-black p-6 sm:p-8 md:p-10 lg:p-12 text-white shadow-2xl md:flex-row">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#FF3333]">
              Offres & Nouveautés
            </span>
            <h2 className="shop-title-display mt-1.5 text-2xl font-black leading-tight sm:text-3xl lg:text-4xl text-white">
              RESTEZ INFORMÉ DE NOS ARRIVAGES
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-white/70">
              Recevez en direct nos arrivages de cartons, nouveaux formats et offres pro dégressives.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-md flex-col gap-3 sm:w-auto sm:min-w-[320px] md:min-w-[340px]"
          >
            <div className="flex items-center rounded-full bg-white px-4 py-3 text-black shadow-inner">
              <Mail className="h-5 w-5 text-black/40 shrink-0" />
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

      {/* 2. Main Navigation Columns with ample top spacing */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand & Direct Contact */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-block font-display text-2xl font-black uppercase tracking-[-0.04em] text-black sm:text-3xl"
            >
              FOOD PACK<span className="text-[#FF3333]">.</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-black/60">
              Grossiste et distributeur d’emballages alimentaires professionnels au Bénin : bouteilles de jus et bissap, boîtes kraft, barquettes et gobelets pour restaurants et traiteurs.
            </p>

            {/* Address & Phone */}
            <div className="space-y-2 pt-2 text-xs text-black/70">
              {settings?.address && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-[#FF3333] shrink-0" />
                  <span>{settings.address}</span>
                </div>
              )}
              {cleanPhone && (
                <a
                  href={`tel:${cleanPhone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2.5 font-semibold text-black/80 transition hover:text-black"
                >
                  <Phone className="h-4 w-4 text-[#01AB31] shrink-0" />
                  <span>{cleanPhone}</span>
                </a>
              )}
            </div>

            {/* Social Media Icons (rendered ONLY if link is actually provided) */}
            {hasAnySocial && (
              <div className="flex items-center gap-3 pt-3">
                {hasWhatsApp && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-white text-black transition hover:bg-[#01AB31] hover:text-white hover:border-[#01AB31]"
                    aria-label="WhatsApp"
                    title="WhatsApp"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.31z"/>
                    </svg>
                  </a>
                )}

                {hasInstagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-white text-black transition hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F]"
                    aria-label="Instagram"
                    title="Instagram"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}

                {hasFacebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-white text-black transition hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]"
                    aria-label="Facebook"
                    title="Facebook"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}

                {hasTikTok && (
                  <a
                    href={settings.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-white text-black transition hover:bg-black hover:text-white hover:border-black"
                    aria-label="TikTok"
                    title="TikTok"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.48 6.3 6.3 0 0 0 1.86-4.48V8.75a8.28 8.28 0 0 0 4.91 1.6v-3.4a4.85 4.85 0 0 1-1-.26z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Col 2: Catalogue */}
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

          {/* Col 3: Informations */}
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
                  Demander un devis
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Légal & Services */}
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

        {/* 3. Bottom Bar (Clean without payment badges) */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row text-xs text-black/60">
          <p>
            FOOD PACK © 2026. Tous droits réservés.
          </p>
          <p className="text-black/40">
            Fournisseur d’emballages alimentaires professionnels au Bénin
          </p>
        </div>
      </div>
    </footer>
  )
}



