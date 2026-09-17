import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import SEO from '../../components/common/SEO'
import ProductCard from '../../components/products/ProductCard'
import { useCatalog } from '../../contexts/CatalogContext'
import heroImg from '../../assets/foodpack-hero.jpg'

const partners = [
  'RESTAURANTS',
  'BARS À JUS & BISSAP',
  'TRAITEURS',
  'PÂTISSERIES & BOULANGERIES',
  'FAST-FOOD & LIVRAISON',
  'ÉVÉNEMENTIEL',
]

export default function HomePage() {
  const { products, categories, testimonials } = useCatalog()
  const [reviewIndex, setReviewIndex] = useState(0)

  // Filters for New Arrivals & Top Selling
  const newArrivals = products.filter((p) => p.newArrival || p.featured).slice(0, 4)
  const topSelling = products.filter((p) => p.topSelling || p.popular).slice(0, 4)

  const handlePrevReview = () => {
    setReviewIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNextReview = () => {
    setReviewIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <SEO title="FOOD PACK | Bouteilles de jus, boîtes kraft & emballages alimentaires à Cotonou" />

      {/* 1. HERO + MARQUEE WRAPPER (Docked precisely to initial viewport) */}
      <div className="flex min-h-[calc(100vh-116px)] flex-col justify-between bg-[#F2F0F1]">
        {/* Main Hero Section */}
        <section className="flex flex-1 items-center px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left Hero Content */}
            <div className="flex flex-col items-start lg:col-span-6">
              <h1 className="shop-title-display text-2xl font-black uppercase leading-[1.08] tracking-tight text-black sm:text-4xl lg:text-[40px] xl:text-[45px]">
                DES EMBALLAGES ÉLÉGANTS POUR SUBLIMER VOS PRODUITS
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-black/70 sm:text-[15px]">
                Bouteilles PET cristal pour jus de bissap, boîtes repas kraft 100% étanches, barquettes micro-ondables et
                contenants soignés pour restaurateurs, traiteurs et marques artisanales à Cotonou.
              </p>
              
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/collections"
                  className="shop-btn-black inline-flex items-center gap-2 px-7 py-3 text-sm font-bold shadow-md"
                >
                  <span>Découvrir la boutique</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="shop-btn-white px-6 py-3 text-sm font-bold"
                >
                  Demander un devis pro
                </Link>
              </div>

              {/* Metrics Counters */}
              <div className="mt-8 grid w-full grid-cols-3 gap-2 border-t border-black/10 pt-5 sm:gap-4">
                <div>
                  <b className="font-display text-xl font-black text-black sm:text-2xl">200+</b>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-black/50">Références</p>
                </div>
                <div className="border-l border-black/10 pl-3 sm:pl-5">
                  <b className="font-display text-xl font-black text-black sm:text-2xl">2 000+</b>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-black/50">Clients servis</p>
                </div>
                <div className="border-l border-black/10 pl-3 sm:pl-5">
                  <b className="font-display text-xl font-black text-black sm:text-2xl">24/48h</b>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-black/50">Livraison Bénin</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image (Clean, Luxury & 100% Unbranded) */}
            <div className="relative flex justify-center lg:col-span-6 lg:justify-end">
              <div className="relative w-full max-w-lg overflow-hidden rounded-[24px] border border-black/10 bg-white p-2.5 shadow-xl sm:max-w-none">
                <img
                  src={heroImg}
                  alt="Emballages alimentaires et bouteilles de bissap FOOD PACK"
                  className="h-[300px] w-full rounded-[18px] object-cover sm:h-[380px] lg:h-[420px] xl:h-[450px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. PARTNERS / UNIVERS MARQUEE (Flush at the bottom of initial fold) */}
        <div className="overflow-hidden bg-black py-4 text-white sm:py-5">
          <div className="animate-marquee flex items-center gap-10 whitespace-nowrap text-xs font-extrabold uppercase tracking-widest sm:text-sm">
            {[...partners, ...partners].map((name, i) => (
              <div key={i} className="flex items-center gap-10">
                <span>{name}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SECTION NOS PRODUITS PHARES */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="shop-title-display text-center text-2xl font-black uppercase tracking-tight text-black sm:text-3xl lg:text-4xl">
          NOS PRODUITS PHARES
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(newArrivals.length ? newArrivals : products.slice(0, 4)).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/collections"
            className="shop-btn-white px-10 py-3 text-xs font-bold"
          >
            Voir tout le catalogue
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-black/10" />
      </div>

      {/* 4. SECTION MEILLEURES VENTES (Top Selling) */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="shop-title-display text-center text-2xl font-black text-black sm:text-3xl">
          MEILLEURES VENTES
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(topSelling.length ? topSelling : products.slice(4, 8)).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/collections" className="shop-btn-white px-10 py-3 text-xs font-bold">
            Voir tous les produits
          </Link>
        </div>
      </section>

      {/* 5. BENTO GRID : PARCOURIR PAR UNIVERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] bg-[#F0EEED] p-6 sm:p-10 lg:p-14">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="inline-block rounded-full bg-black/5 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-black/70">
              Gamme complète
            </span>
            <h2 className="shop-title-display mt-3 text-2xl font-black uppercase tracking-tight text-black sm:text-4xl lg:text-[42px]">
              PARCOURIR PAR UNIVERS<span className="text-[#FF3333]">.</span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-black/60 leading-relaxed">
              Sélectionnez votre univers métier pour trouver en quelques secondes les contenants et formats adaptés.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {/* Bento Card 1: Jus & Boissons (Col 5) */}
            <Link
              to="/categories/jus-boissons"
              className="group relative flex min-h-[280px] sm:min-h-[310px] flex-col justify-between overflow-hidden rounded-[26px] bg-white p-7 sm:p-8 transition-all duration-300 hover:shadow-xl md:col-span-5 border border-black/5"
            >
              {/* Image in Background Right with Soft Gradient Blend */}
              <img
                src={categories[0]?.image || '/products/bouteille-pet.jpg'}
                alt="Bouteilles de jus et bissap"
                className="absolute right-0 top-0 h-full w-3/5 sm:w-2/3 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 to-transparent pointer-events-none" />

              {/* Top Content */}
              <div className="relative z-10">
                <span className="inline-block rounded-full bg-black/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black/70">
                  PET 100% Cristal
                </span>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black leading-tight">
                  Jus &<br className="hidden sm:inline" /> Boissons
                </h3>
                <p className="mt-2 text-xs text-black/60 max-w-[180px] sm:max-w-[210px] leading-relaxed">
                  Bouteilles PET inviolables, bidons & carafes pour bissap et jus frais.
                </p>
              </div>

              {/* Bottom Action */}
              <div className="relative z-10 pt-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-bold text-white transition group-hover:bg-[#FF3333]">
                  <span>Explorer</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            {/* Bento Card 2: Emballages Kraft (Col 7) */}
            <Link
              to="/categories/emballages-kraft"
              className="group relative flex min-h-[280px] sm:min-h-[310px] flex-col justify-between overflow-hidden rounded-[26px] bg-white p-7 sm:p-8 transition-all duration-300 hover:shadow-xl md:col-span-7 border border-black/5"
            >
              <img
                src={categories[1]?.image || '/products/boite-kraft.jpg'}
                alt="Emballages kraft étanches"
                className="absolute right-0 top-0 h-full w-3/5 sm:w-2/3 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200/60">
                  Éco-responsable & Étanche
                </span>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black leading-tight">
                  Boîtes &<br className="hidden sm:inline" /> Sacs Kraft
                </h3>
                <p className="mt-2 text-xs text-black/60 max-w-[220px] sm:max-w-[280px] leading-relaxed">
                  Boîtes repas anti-graisse, sachets doypack à fenêtre & sacs cabas traiteur.
                </p>
              </div>

              <div className="relative z-10 pt-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-bold text-white transition group-hover:bg-[#FF3333]">
                  <span>Explorer</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            {/* Bento Card 3: Plats & Barquettes (Col 7) */}
            <Link
              to="/categories/plats-barquettes"
              className="group relative flex min-h-[280px] sm:min-h-[310px] flex-col justify-between overflow-hidden rounded-[26px] bg-white p-7 sm:p-8 transition-all duration-300 hover:shadow-xl md:col-span-7 border border-black/5"
            >
              <img
                src={categories[2]?.image || '/products/barquette-micro.jpg'}
                alt="Barquettes micro-ondables et contenants aluminium"
                className="absolute right-0 top-0 h-full w-3/5 sm:w-2/3 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-800 border border-blue-200/60">
                  Chaud & Micro-ondable
                </span>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black leading-tight">
                  Plats &<br className="hidden sm:inline" /> Barquettes
                </h3>
                <p className="mt-2 text-xs text-black/60 max-w-[220px] sm:max-w-[280px] leading-relaxed">
                  Barquettes hermétiques avec couvercle clippé, barquettes alu & saladiers bowl.
                </p>
              </div>

              <div className="relative z-10 pt-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-bold text-white transition group-hover:bg-[#FF3333]">
                  <span>Explorer</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            {/* Bento Card 4: Gobelets & Pâtisserie (Col 5) */}
            <Link
              to="/categories/gobelets-patisserie"
              className="group relative flex min-h-[280px] sm:min-h-[310px] flex-col justify-between overflow-hidden rounded-[26px] bg-white p-7 sm:p-8 transition-all duration-300 hover:shadow-xl md:col-span-5 border border-black/5"
            >
              <img
                src={categories[3]?.image || '/products/gobelet-smoothie.jpg'}
                alt="Gobelets smoothies et boîtes à pâtisserie"
                className="absolute right-0 top-0 h-full w-3/5 sm:w-2/3 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 border border-amber-200/60">
                  Desserts & Fraîcheur
                </span>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black leading-tight">
                  Gobelets &<br className="hidden sm:inline" /> Pâtisserie
                </h3>
                <p className="mt-2 text-xs text-black/60 max-w-[180px] sm:max-w-[210px] leading-relaxed">
                  Gobelets transparents à dôme pour smoothies, cafés frappés & boîtes gâteaux.
                </p>
              </div>

              <div className="relative z-10 pt-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-bold text-white transition group-hover:bg-[#FF3333]">
                  <span>Explorer</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. AVIS CLIENTS (Our Happy Customers) */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex items-center justify-between">
          <h2 className="shop-title-display text-xl font-black text-black sm:text-3xl">
            AVIS DE NOS CLIENTS
          </h2>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrevReview}
              className="grid h-9 w-9 place-items-center rounded-full border border-black/20 text-black transition hover:bg-black hover:text-white"
              aria-label="Avis précédent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextReview}
              className="grid h-9 w-9 place-items-center rounded-full border border-black/20 text-black transition hover:bg-black hover:text-white"
              aria-label="Avis suivant"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-[20px] border border-black/10 p-6 shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="flex text-[#FFC633]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#FFC633]" />
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <b className="text-sm text-black">{item.name}</b>
                  <CheckCircle2 className="h-4 w-4 text-[#01AB31]" />
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-black/60">
                  « {item.text} »
                </p>
              </div>
              <footer className="mt-4 text-[11px] font-bold text-black/40">
                {item.city || 'Cotonou'}
              </footer>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
