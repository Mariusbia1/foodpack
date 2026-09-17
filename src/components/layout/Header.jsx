import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { useCatalog } from '../../contexts/CatalogContext'

export default function Header() {
  const [showBanner, setShowBanner] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const { itemCount } = useCart()
  const { isAuthenticated } = useAdminAuth()
  const { categories, settings } = useCatalog()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <>
      {/* 1. Top Announcement Bar */}
      {showBanner && (
        <div className="relative bg-black px-4 py-2 text-center text-xs text-white">
          <p>
            Profitez de tarifs dégressifs par carton pour professionnels.{' '}
            <Link
              to="/contact"
              className="font-bold underline transition hover:text-white/80"
            >
              Demander un devis
            </Link>
          </p>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            aria-label="Fermer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 2. Main Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-lg text-black hover:bg-[#F0EEED] lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link
              to="/"
              className="font-display text-2xl font-black uppercase tracking-[-0.04em] text-black sm:text-3xl"
            >
              FOOD PACK<span className="text-[#FF3333]">.</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-6 lg:flex">
            {/* Dropdown Catégories */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                className="flex items-center gap-1.5 text-sm font-semibold text-black transition hover:text-black/70"
              >
                <span>Catalogue</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-black/10 bg-white p-3 shadow-xl">
                  <Link
                    to="/collections"
                    className="block rounded-xl px-3 py-2 text-sm font-bold text-black transition hover:bg-[#F0EEED]"
                  >
                    Tous les emballages
                  </Link>
                  <div className="my-1 border-t border-black/5" />
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/categories/${cat.slug}`}
                      className="block rounded-xl px-3 py-2 text-sm text-black/80 transition hover:bg-[#F0EEED] hover:text-black"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to="/collections"
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive ? 'text-black' : 'text-black/70 hover:text-black'}`
              }
            >
              Boutique
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive ? 'text-black' : 'text-black/70 hover:text-black'}`
              }
            >
              Devis & Contact
            </NavLink>
          </nav>

          {/* Search Bar Pill */}
          <form
            onSubmit={handleSearch}
            className="hidden max-w-md flex-1 items-center rounded-full bg-[#F0EEED] px-4 py-2.5 sm:flex"
          >
            <Search className="h-4 w-4 text-black/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des bouteilles, boîtes kraft, barquettes..."
              className="w-full bg-transparent pl-3 text-sm text-black outline-none placeholder:text-black/40"
            />
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/panier"
              className="relative grid h-10 w-10 place-items-center rounded-full text-black hover:bg-[#F0EEED]"
              aria-label={`Panier, ${itemCount} articles`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <Link
                to="/admin"
                className="flex items-center gap-2 rounded-full bg-black px-3.5 py-2 text-xs font-bold text-white hover:bg-black/80"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white p-6 lg:hidden">
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-2xl font-black uppercase text-black"
            >
              FOOD PACK<span className="text-[#FF3333]">.</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full p-2 text-black hover:bg-[#F0EEED]"
              aria-label="Fermer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSearch} className="mt-5 flex items-center rounded-full bg-[#F0EEED] px-4 py-3">
            <Search className="h-5 w-5 text-black/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des produits..."
              className="w-full bg-transparent pl-3 text-sm text-black outline-none placeholder:text-black/40"
            />
          </form>

          <nav className="mt-6 flex flex-1 flex-col gap-4 overflow-y-auto">
            <Link
              to="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-black"
            >
              Tout le catalogue
            </Link>
            <div className="flex flex-col gap-2 pl-3">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/categories/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-black/70 hover:text-black"
                >
                  • {cat.name}
                </Link>
              ))}
            </div>

            <div className="my-2 border-t border-black/10" />

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-black"
            >
              Demande de Devis & Contact
            </Link>
            <Link
              to="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-black/70"
            >
              Questions fréquentes
            </Link>
            <Link
              to="/a-propos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-black/70"
            >
              À propos de FOOD PACK
            </Link>

            {isAuthenticated && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-black py-3 text-sm font-bold text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                Tableau de bord Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  )
}
