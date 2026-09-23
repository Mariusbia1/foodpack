import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ChevronRight, X, ArrowLeft, ArrowRight } from 'lucide-react'
import SEO from '../../components/common/SEO'
import ProductCard from '../../components/products/ProductCard'
import { useCatalog } from '../../contexts/CatalogContext'

export default function ShopPage({ categorySlug }) {
  const { products, categories } = useCatalog()
  const [searchParams] = useSearchParams()
  const urlFilter = searchParams.get('filter')
  const urlSearch = searchParams.get('search') || ''

  const [category, setCategory] = useState(categorySlug || 'tous')
  const [selectedCapacity, setSelectedCapacity] = useState('tous')
  const [selectedFormat, setSelectedFormat] = useState('tous')
  const [selectedMaterial, setSelectedMaterial] = useState('tous')
  const [maxPrice, setMaxPrice] = useState(25000)
  const [sort, setSort] = useState(urlFilter === 'nouveautes' ? 'nouveautes' : 'popularite')
  const [searchQuery, setSearchQuery] = useState(urlSearch)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    if (categorySlug) setCategory(categorySlug)
  }, [categorySlug])

  useEffect(() => {
    if (urlSearch) setSearchQuery(urlSearch)
  }, [urlSearch])

  // Extract all distinct capacities, formats, materials
  const allCapacities = useMemo(() => {
    const set = new Set()
    products.forEach((p) => (p.capacities || []).forEach((c) => set.add(c)))
    return Array.from(set)
  }, [products])

  const allFormats = useMemo(() => {
    const set = new Set()
    products.forEach((p) => (p.formats || []).forEach((f) => set.add(f)))
    return Array.from(set)
  }, [products])

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    let list = products.filter((product) => {
      // Category Filter
      if (category !== 'tous' && product.categorySlug !== category) return false

      // Search Query
      if (query) {
        const searchable = `${product.name} ${product.category} ${product.description || ''} ${product.materials || ''}`.toLowerCase()
        if (!searchable.includes(query)) return false
      }

      // Price Filter
      if (product.price > maxPrice) return false

      // Capacity Filter
      if (selectedCapacity !== 'tous' && !(product.capacities || []).includes(selectedCapacity)) {
        return false
      }

      // Format Filter
      if (selectedFormat !== 'tous' && !(product.formats || []).includes(selectedFormat)) {
        return false
      }

      // Material Filter
      if (selectedMaterial !== 'tous' && !product.materials?.toLowerCase().includes(selectedMaterial.toLowerCase())) {
        return false
      }

      return true
    })

    // Sorting
    if (sort === 'prix-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'prix-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'nouveautes') list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0))
    else if (sort === 'popularite') list.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0))

    return list
  }, [products, category, searchQuery, maxPrice, selectedCapacity, selectedFormat, selectedMaterial, sort])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const activeCategoryObj = categories.find((c) => c.slug === category)
  const currentTitle = category === 'tous' ? 'Tous les emballages' : activeCategoryObj?.name || 'Catalogue'

  const breadcrumbs = [
    { name: 'Accueil', url: '/' },
    { name: 'Catalogue', url: '/collections' },
    ...(category !== 'tous' ? [{ name: currentTitle, url: `/categories/${category}` }] : []),
  ]

  const seoDescription =
    category === 'tous'
      ? 'Découvrez tout notre catalogue d’emballages alimentaires et bouteilles PET pour jus à Cotonou et Parakou : boîtes kraft, barquettes, gobelets au meilleur prix.'
      : `Achetez vos ${currentTitle.toLowerCase()} en gros et demi-gros à Cotonou et Parakou. Emballages alimentaires de qualité supérieure livrés partout au Bénin.`

  const resetFilters = () => {
    setCategory('tous')
    setSelectedCapacity('tous')
    setSelectedFormat('tous')
    setSelectedMaterial('tous')
    setMaxPrice(25000)
    setSearchQuery('')
    setCurrentPage(1)
  }

  return (
    <>
      <SEO
        title={`${currentTitle} | Boutique FOOD PACK Bénin`}
        description={seoDescription}
        breadcrumbs={breadcrumbs}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-black/60">
          <Link to="/" className="hover:text-black">
            Accueil
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/collections" className="hover:text-black">
            Catalogue
          </Link>
          {category !== 'tous' && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-semibold text-black">{currentTitle}</span>
            </>
          )}
        </nav>

        {/* Main Grid : Sidebar + Products */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
          {/* 1. Left Sidebar Filters (Desktop) */}
          <aside className="hidden h-fit rounded-[20px] border border-black/10 p-6 lg:block">
            <div className="flex items-center justify-between border-b border-black/10 pb-5">
              <h2 className="text-lg font-black uppercase text-black">Filtres</h2>
              <button onClick={resetFilters} className="text-xs font-semibold text-black/60 hover:text-black">
                Réinitialiser
              </button>
            </div>

            {/* Categories List */}
            <div className="border-b border-black/10 py-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-black/40">Catégories</p>
              <div className="space-y-2">
                <button
                  onClick={() => { setCategory('tous'); setCurrentPage(1); }}
                  className={`flex w-full items-center justify-between text-left text-sm transition ${
                    category === 'tous' ? 'font-black text-black' : 'text-black/60 hover:text-black'
                  }`}
                >
                  <span>Tous les produits</span>
                  <ChevronRight className="h-4 w-4 opacity-40" />
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => { setCategory(cat.slug); setCurrentPage(1); }}
                    className={`flex w-full items-center justify-between text-left text-sm transition ${
                      category === cat.slug ? 'font-black text-black' : 'text-black/60 hover:text-black'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="border-b border-black/10 py-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-black/40">Prix Max</p>
                <span className="text-sm font-extrabold text-black">{maxPrice.toLocaleString()} FCFA</span>
              </div>
              <input
                type="range"
                min="2000"
                max="25000"
                step="500"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
                className="mt-4 w-full accent-black"
              />
            </div>

            {/* Contenances / Volumes */}
            {allCapacities.length > 0 && (
              <div className="border-b border-black/10 py-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-black/40">Contenances</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSelectedCapacity('tous'); setCurrentPage(1); }}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      selectedCapacity === 'tous' ? 'bg-black text-white' : 'bg-[#F0EEED] text-black/70 hover:bg-black/10'
                    }`}
                  >
                    Toutes
                  </button>
                  {allCapacities.map((cap) => (
                    <button
                      key={cap}
                      onClick={() => { setSelectedCapacity(cap); setCurrentPage(1); }}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        selectedCapacity === cap ? 'bg-black text-white' : 'bg-[#F0EEED] text-black/70 hover:bg-black/10'
                      }`}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Formats & Packs */}
            {allFormats.length > 0 && (
              <div className="py-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-black/40">Conditionnements</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSelectedFormat('tous'); setCurrentPage(1); }}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      selectedFormat === 'tous' ? 'bg-black text-white' : 'bg-[#F0EEED] text-black/70 hover:bg-black/10'
                    }`}
                  >
                    Tous
                  </button>
                  {allFormats.map((format) => (
                    <button
                      key={format}
                      onClick={() => { setSelectedFormat(format); setCurrentPage(1); }}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        selectedFormat === format ? 'bg-black text-white' : 'bg-[#F0EEED] text-black/70 hover:bg-black/10'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* 2. Right Products Section */}
          <main>
            {/* Top Toolbar */}
            <div className="flex flex-col justify-between gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center">
              <div>
                <h1 className="shop-title-display text-2xl font-black text-black sm:text-3xl">
                  {currentTitle}
                </h1>
                <p className="mt-1 text-xs text-black/60">
                  Affichage de {filteredProducts.length} référence{filteredProducts.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="flex items-center gap-2 rounded-full bg-[#F0EEED] px-4 py-2 text-xs font-bold text-black lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filtres</span>
                </button>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-black/60">Trier par :</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-full bg-[#F0EEED] px-3.5 py-2 font-bold text-black outline-none"
                  >
                    <option value="popularite">Plus populaires</option>
                    <option value="nouveautes">Nouveautés</option>
                    <option value="prix-asc">Prix croissant</option>
                    <option value="prix-desc">Prix décroissant</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-12 rounded-[20px] bg-[#F0EEED] p-12 text-center">
                <h2 className="text-xl font-bold text-black">Aucun produit ne correspond à vos critères</h2>
                <p className="mt-2 text-sm text-black/60">
                  Essayez d’élargir vos filtres ou de réinitialiser la recherche.
                </p>
                <button
                  onClick={resetFilters}
                  className="shop-btn-black mt-6 px-6 py-2.5 text-xs"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-xs font-bold text-black disabled:opacity-30 hover:bg-[#F0EEED]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Précédent</span>
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`grid h-9 w-9 place-items-center rounded-xl text-xs font-bold ${
                        currentPage === i + 1
                          ? 'bg-black text-white'
                          : 'text-black/70 hover:bg-[#F0EEED]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-xs font-bold text-black disabled:opacity-30 hover:bg-[#F0EEED]"
                >
                  <span>Suivant</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 3. Mobile Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/50 lg:hidden">
          <div className="ml-auto flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <h2 className="text-lg font-black uppercase text-black">Filtres</h2>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {/* Categories */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase text-black/40">Catégories</p>
                <div className="space-y-1.5">
                  <button
                    onClick={() => { setCategory('tous'); setMobileFilterOpen(false); }}
                    className={`block w-full text-left text-sm ${category === 'tous' ? 'font-bold text-black' : 'text-black/60'}`}
                  >
                    Tous les emballages
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => { setCategory(c.slug); setMobileFilterOpen(false); }}
                      className={`block w-full text-left text-sm ${category === c.slug ? 'font-bold text-black' : 'text-black/60'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase text-black/40">Prix Max ({maxPrice} F)</p>
                <input
                  type="range"
                  min="2000"
                  max="25000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-black"
                />
              </div>

              {/* Capacities */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase text-black/40">Contenances</p>
                <div className="flex flex-wrap gap-2">
                  {allCapacities.map((cap) => (
                    <button
                      key={cap}
                      onClick={() => setSelectedCapacity(cap)}
                      className={`rounded-full px-3 py-1 text-xs ${selectedCapacity === cap ? 'bg-black text-white' : 'bg-[#F0EEED]'}`}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="shop-btn-black w-full py-3 text-sm font-bold"
            >
              Appliquer les filtres
            </button>
          </div>
        </div>
      )}
    </>
  )
}
