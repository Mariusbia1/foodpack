import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Phone,
} from 'lucide-react'
import toast from 'react-hot-toast'
import SEO from '../../components/common/SEO'
import { useCatalog } from '../../contexts/CatalogContext'
import { faq } from '../../data/faq'
import PhoneInput from '../../components/common/PhoneInput'

// 1. PAGE CONTACT & DEVIS PRO
export function ContactPage() {
  const { settings } = useCatalog()
  const [phone, setPhone] = useState('')
  const [subjectType, setSubjectType] = useState('Tarif par carton / Gros volume')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [quantities, setQuantities] = useState('')
  const [message, setMessage] = useState('')

  const subjectOptions = [
    'Tarif par carton / Gros volume',
    'Bouteilles & Bidons de Bissap',
    'Boîtes repas & Sacs Kraft',
    'Impression de logo / Personnalisation',
    'Renseignement général',
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      return toast.error('Veuillez renseigner votre nom et votre numéro de téléphone.')
    }

    const body = `Bonjour ${settings.shop_name},

Je vous contacte pour : *${subjectType}*

*COORDONNÉES CLIENT :*
- Nom : ${name}
- Téléphone : ${phone}
- E-mail : ${email || 'Non renseigné'}
- Quantités estimées : ${quantities || 'À définir'}

*MESSAGE / PRÉCISIONS :*
${message || 'Je souhaite obtenir plus d’informations et vos disponibilités.'}

Merci de votre retour rapide.`

    const waNumber = String(settings.whatsapp || '2290100000000').replace(/\D/g, '')
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(body)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    toast.success('Votre demande a été transmise sur WhatsApp !')
    setName('')
    setPhone('')
    setEmail('')
    setQuantities('')
    setMessage('')
  }

  return (
    <>
      <SEO title="Contact & Devis Gros Volumes | FOOD PACK" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FF3333]">
            À votre écoute 6j/7
          </p>
          <h1 className="shop-title-display mt-3 text-3xl font-black text-black sm:text-5xl">
            CONTACT & DEVIS SUR MESURE
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-black/60">
            Vous avez un restaurant, une marque de jus ou un événement ?
            Contactez notre équipe pour obtenir nos tarifs dégressifs par cartons et palettes.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column : Contact Details & Cards */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-[20px] bg-[#F0EEED] p-8 space-y-6">
              <h2 className="text-xl font-bold text-black">Nos Coordonnées</h2>

              <div className="space-y-4 text-sm">
                <a
                  href={`https://wa.me/${String(settings.whatsapp || '2290100000000').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 transition hover:shadow-sm"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#01AB31]/10 text-[#01AB31]">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-black/50">WhatsApp Direct</p>
                    <b className="text-black">{settings.phone || '+229 01 00 00 00 00'}</b>
                  </div>
                </a>

                <div className="flex items-center gap-4 rounded-2xl bg-white p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black/5 text-black">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-black/50">E-mail professionnel</p>
                    <b className="text-black">{settings.email || 'contact@foodpack.com'}</b>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black/5 text-black">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-black/50">Showroom & Retrait</p>
                    <b className="text-black">{settings.address || 'Cotonou, Bénin'}</b>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black/5 text-black">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-black/50">Horaires d'ouverture</p>
                    <b className="text-black">Lundi - Samedi : 08h00 - 19h00</b>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column : Interactive Quote Form */}
          <div className="rounded-[20px] border border-black/10 p-8 sm:p-10 lg:col-span-7">
            <h2 className="text-xl font-bold text-black">Demande de Devis ou Renseignement</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Subject Chips */}
              <div>
                <label className="text-xs font-bold uppercase text-black/50">Objet de votre demande</label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {subjectOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSubjectType(opt)}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                        subjectType === opt
                          ? 'bg-black text-white'
                          : 'bg-[#F0EEED] text-black/70 hover:bg-black/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase text-black/60">Nom ou Établissement *</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex. Restaurant Le Palmier"
                    className="mt-1 w-full rounded-full border border-black/15 bg-[#F0EEED] px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-black/60">Numéro de Téléphone *</label>
                  <div className="mt-1">
                    <PhoneInput required value={phone} onChange={setPhone} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase text-black/60">Adresse E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@exemple.com"
                    className="mt-1 w-full rounded-full border border-black/15 bg-[#F0EEED] px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-black/60">Quantités souhaitées</label>
                  <input
                    value={quantities}
                    onChange={(e) => setQuantities(e.target.value)}
                    placeholder="Ex. 10 cartons (2 500 pcs)"
                    className="mt-1 w-full rounded-full border border-black/15 bg-[#F0EEED] px-4 py-3 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-black/60">Détails de votre besoin</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Précisez les formats, contenances et délais de livraison souhaités..."
                  className="mt-1 w-full resize-none rounded-2xl border border-black/15 bg-[#F0EEED] p-4 text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                className="shop-btn-black flex w-full items-center justify-center gap-2 py-4 text-sm font-bold"
              >
                <span>Envoyer ma demande sur WhatsApp</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

// 2. PAGE À PROPOS
export function AboutPage() {
  return (
    <>
      <SEO title="À Propos | FOOD PACK" />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FF3333]">Notre Mission</p>
          <h1 className="shop-title-display mt-3 text-3xl font-black text-black sm:text-5xl">
            L’EMBALLAGE AU SERVICE DE VOS CRÉATIONS
          </h1>
        </div>

        <div className="mt-12 space-y-8 text-base leading-relaxed text-black/70">
          <p>
            Basée à Cotonou au Bénin, <b>FOOD PACK</b> est spécialisée dans la distribution
            d’emballages alimentaires et contenants de haute qualité destinés aux professionnels
            de la restauration, aux producteurs de boissons et jus artisanaux (bissap, baobab, sirops),
            aux pâtissiers et traiteurs.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-[20px] bg-[#F0EEED] p-6 text-center">
              <b className="block text-3xl font-black text-black">100%</b>
              <p className="mt-2 text-xs font-bold uppercase text-black/60">Sécurité alimentaire</p>
            </div>
            <div className="rounded-[20px] bg-[#F0EEED] p-6 text-center">
              <b className="block text-3xl font-black text-black">24h</b>
              <p className="mt-2 text-xs font-bold uppercase text-black/60">Livraison Cotonou & Calavi</p>
            </div>
            <div className="rounded-[20px] bg-[#F0EEED] p-6 text-center">
              <b className="block text-3xl font-black text-black">Grossistes</b>
              <p className="mt-2 text-xs font-bold uppercase text-black/60">Tarifs dégressifs</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// 3. PAGE FAQ
export function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <>
      <SEO title="Questions Fréquentes | FOOD PACK" />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FF3333]">FAQ</p>
          <h1 className="shop-title-display mt-3 text-3xl font-black text-black sm:text-5xl">
            QUESTIONS FRÉQUENTES
          </h1>
        </div>

        <div className="mt-12 space-y-4">
          {faq.map((item, i) => (
            <div
              key={i}
              className="rounded-[20px] border border-black/10 p-6 transition hover:border-black/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between text-left text-base font-bold text-black"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-black/40 transition-transform ${
                    openIndex === i ? 'rotate-180 text-black' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <p className="mt-3 text-sm leading-relaxed text-black/60">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// 4. PAGE CONFIRMATION DE COMMANDE
export function ConfirmationPage() {
  return (
    <>
      <SEO title="Commande Confirmée | FOOD PACK" />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#01AB31]/10 text-[#01AB31]">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="shop-title-display mt-6 text-3xl font-black text-black">
          COMMANDE TRANSMISSE AVEC SUCCÈS
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-black/60">
          Votre récapitulatif a été ouvert dans WhatsApp. Notre équipe commerciale vous confirme
          la disponibilité et l’heure exacte de livraison sous quelques minutes.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/" className="shop-btn-black px-8 py-3.5 text-sm font-bold">
            Retour à l'accueil
          </Link>
          <Link to="/collections" className="shop-btn-white px-8 py-3.5 text-sm font-bold">
            Continuer mes achats
          </Link>
        </div>
      </div>
    </>
  )
}

// 5. PAGE GALERIE / SOLUTIONS
export function GalleryPage() {
  const { categories } = useCatalog()

  return (
    <>
      <SEO title="Nos Solutions d'Emballages | FOOD PACK" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="shop-title-display text-3xl font-black text-black sm:text-5xl">
            NOS SOLUTIONS PAR UNIVERS
          </h1>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categories/${cat.slug}`}
              className="group relative h-80 overflow-hidden rounded-[20px] bg-[#F0EEED]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                <h3 className="text-xl font-bold">{cat.name}</h3>
                <p className="mt-1 text-xs text-white/70">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

// 6. PAGE MENTIONS LÉGALES & CONDITIONS
export function LegalPage({ title }) {
  return (
    <>
      <SEO title={`${title} | FOOD PACK`} />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="shop-title-display text-3xl font-black text-black">{title}</h1>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-black/70">
          <p>
            Le site FOOD PACK propose des emballages alimentaires et contenants pour professionnels
            et particuliers à Cotonou et sur l'ensemble du territoire béninois.
          </p>
          <p>
            Toutes nos bouteilles et boîtes sont certifiées conformes aux exigences d'hygiène et de contact alimentaire.
            Pour toute demande particulière ou litige, notre service client est joignable 6j/7 sur WhatsApp.
          </p>
        </div>
      </div>
    </>
  )
}
