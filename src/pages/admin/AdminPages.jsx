import { useEffect, useState } from 'react'
import { Navigate, Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Eye, EyeOff, Plus, Search, ArrowUpRight, Package, ShoppingBag, Clock, Banknote,
  Trash2, Pencil, X, ArrowUp, ArrowDown, Users, MousePointerClick, CheckCircle2,
  AlertCircle, ChevronRight, MessageCircle, ExternalLink, Filter, ShieldCheck, RefreshCw,
  ImagePlus, Upload, Sparkles, Tag, Truck, Check, Layers, Copy
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { categories as defaultCategories } from '../../data/categories'
import { gallery as defaultGallery } from '../../data/gallery'
import { testimonials as defaultTestimonials } from '../../data/testimonials'
import { formatCurrency } from '../../utils/formatCurrency'
import Button from '../../components/common/Button'
import SEO from '../../components/common/SEO'
import PhoneInput from '../../components/common/PhoneInput'
import ProductMediaThumb from '../../components/products/ProductMediaThumb'
import { supabase } from '../../lib/supabase'
import { formatErrorMessage } from '../../utils/formatError'
import {
  deleteCategory, deleteGalleryItem, deleteProduct, deleteProductImage, deleteTestimonial,
  getAdminOrders, getAdminProfile, getAdminTeam, getCategories, getDashboardData, getGallery,
  getProducts, getSiteContent, getSiteSettings, getTestimonials, getTrafficStats, getAuditLogs,
  reorderProductImages, saveAdminProfile, saveCategory, saveGalleryItem, saveProduct,
  saveSiteContent, uploadCatalogImage, saveSiteSettings, saveTestimonial,
  updateAdminEmail, updateAdminPassword, updateAdminRole, createAdminAccount, revokeAdminAccess,
  updateOrderStatus,
} from '../../services/catalogService'

export function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth()
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-slate-200 border-t-black" />
          <p className="font-display text-sm font-bold text-slate-700">Vérification de la session…</p>
        </div>
      </div>
    )
  }
  return isAuthenticated ? children : <Navigate to="/admin/connexion" replace />
}

export function LoginPage() {
  const [show, setShow] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { login, isAuthenticated, isSupabaseConfigured } = useAdminAuth()
  const navigate = useNavigate()

  if (isAuthenticated) return <Navigate to="/admin" replace />

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    try {
      await login(formData.get('email'), formData.get('password'))
      toast.success('Connexion réussie !')
      navigate('/admin')
    } catch (error) {
      console.error('Erreur login admin :', error)
      toast.error(formatErrorMessage(error, 'E-mail ou mot de passe incorrect.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <SEO title="Connexion administration | FOOD PACK" />
      <div className="relative grid min-h-screen place-items-center bg-[#F8FAFC] p-4 sm:p-6">
        <form
          onSubmit={submit}
          className="relative w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl sm:p-10"
        >
          <div className="text-center">
            <Link to="/" className="font-display text-3xl font-black uppercase tracking-tight text-slate-900">
              FOOD PACK<span className="text-[#FF3333]">.</span>
            </Link>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Espace Administrateur
            </div>
          </div>

          {!isSupabaseConfigured && (
            <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs leading-5 text-amber-800">
              Ajoutez les variables Supabase dans le fichier <code>.env.local</code> pour activer la connexion.
            </p>
          )}

          <div className="mt-7 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Adresse E-mail
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@foodpack.com"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
              />
            </label>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Mot de passe
              <div className="relative mt-1.5">
                <input
                  name="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                >
                  {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </label>
          </div>

          <div className="my-5 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 font-medium text-slate-600">
              <input type="checkbox" defaultChecked className="rounded accent-black" />
              Se souvenir de moi
            </label>
            <Link
              to="/admin/mot-de-passe-oublie"
              className="font-bold text-slate-600 hover:text-black hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting || !isSupabaseConfigured}
            className="w-full rounded-xl bg-black py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? 'Connexion en cours…' : 'Se connecter au tableau de bord'}
          </button>

          <Link
            to="/"
            className="mt-6 block text-center text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            ← Retourner sur le site client
          </Link>
        </form>
      </div>
    </>
  )
}

export function Title({ children, subtitle, action, badge = "Gestion" }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
            {badge}
          </span>
        </div>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          {children}
        </h1>
        {subtitle && <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p>}
      </div>
      {action && <div className="flex flex-wrap items-center gap-2 sm:gap-3">{action}</div>}
    </div>
  )
}

const statusMap = {
  new: { label: 'Nouvelle', style: 'bg-blue-50 text-blue-700 border-blue-200/80' },
  confirmed: { label: 'Confirmée', style: 'bg-amber-50 text-amber-700 border-amber-200/80' },
  in_progress: { label: 'En préparation', style: 'bg-indigo-50 text-indigo-700 border-indigo-200/80' },
  ready: { label: 'Prête', style: 'bg-purple-50 text-purple-700 border-purple-200/80' },
  delivered: { label: 'Livrée', style: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
  cancelled: { label: 'Annulée', style: 'bg-rose-50 text-rose-700 border-rose-200/80' },
  'Disponible': { label: 'Disponible', style: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
  'Sur commande': { label: 'Sur commande', style: 'bg-slate-100 text-slate-700 border-slate-200' },
  'Indisponible': { label: 'Rupture', style: 'bg-rose-50 text-rose-700 border-rose-200/80' },
  'Publié': { label: 'Publié', style: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
  'Brouillon': { label: 'Brouillon', style: 'bg-slate-100 text-slate-600 border-slate-200' },
}

export function Status({ children }) {
  const config = statusMap[children] || { label: children, style: 'bg-slate-100 text-slate-700 border-slate-200' }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${config.style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {config.label}
    </span>
  )
}

const orderStatus = {
  new: 'Nouvelle',
  confirmed: 'Confirmée',
  in_progress: 'En préparation',
  ready: 'Prête',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

function OrderTable({ rows = [] }) {
  const navigate = useNavigate()
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
      <table className="w-full min-w-[760px] text-left text-xs">
        <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-5 py-3.5">Référence</th>
            <th className="px-5 py-3.5">Client</th>
            <th className="px-5 py-3.5">Ville</th>
            <th className="px-5 py-3.5">Montant</th>
            <th className="px-5 py-3.5">Statut</th>
            <th className="px-5 py-3.5">Date</th>
            <th className="px-5 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((o) => (
            <tr
              key={o.id}
              onClick={() => navigate(`/admin/commandes/${o.id}`)}
              className="cursor-pointer transition hover:bg-slate-50/80"
            >
              <td className="px-5 py-3.5 font-bold font-mono text-slate-900">{o.order_number || o.id.slice(0, 8)}</td>
              <td className="px-5 py-3.5 font-semibold text-slate-800">{o.customer_name || o.customer || 'Client'}</td>
              <td className="px-5 py-3.5 text-slate-600">{o.city || 'Cotonou'}</td>
              <td className="px-5 py-3.5 font-bold text-slate-900">{formatCurrency(o.total ?? o.amount ?? 0)}</td>
              <td className="px-5 py-3.5">
                <Status>{o.status}</Status>
              </td>
              <td className="px-5 py-3.5 text-slate-500">
                {o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR') : o.date || '—'}
              </td>
              <td className="px-5 py-3.5 text-right">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-black hover:text-white">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan="7" className="py-12 text-center text-xs text-slate-400">
                Aucune commande enregistrée pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function CatalogDashboard() {
  const [data, setData] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = () => {
    setRefreshing(true)
    getDashboardData()
      .then(setData)
      .catch((error) => {
        console.error('Erreur getDashboardData:', error)
        toast.error(formatErrorMessage(error, 'Impossible de charger le tableau de bord.'))
        setData({
          products: [],
          orders: [],
          categories: [],
          stats: { products: 0, orders: 0, pending: 0, revenue: 0 },
        })
      })
      .finally(() => setRefreshing(false))
  }

  useEffect(() => {
    load()
  }, [])

  if (!data) {
    return (
      <>
        <Title subtitle="Vue globale de l'activité commerciale">Tableau de bord</Title>
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-black" />
          <p className="mt-3 text-xs font-semibold text-slate-500">Chargement des données en cours…</p>
        </div>
      </>
    )
  }

  const stats = data.stats || { products: 0, orders: 0, pending: 0, revenue: 0 }
  const categoriesList = Array.isArray(data.categories) ? data.categories : []
  const productsList = Array.isArray(data.products) ? data.products : []
  const ordersList = Array.isArray(data.orders) ? data.orders : []

  const cards = [
    {
      icon: Package,
      label: 'Produits au catalogue',
      value: stats.products ?? productsList.length,
      note: 'Voir toutes les références',
      color: 'bg-slate-900 text-white',
      trend: 'Catalogue',
      link: '/admin/produits',
    },
    {
      icon: ShoppingBag,
      label: 'Commandes totales',
      value: stats.orders ?? ordersList.length,
      note: 'Historique des commandes',
      color: 'bg-blue-600 text-white',
      trend: 'Commandes',
      link: '/admin/commandes',
    },
    {
      icon: Clock,
      label: 'Commandes à traiter',
      value: stats.pending ?? 0,
      note: 'En attente ou préparation',
      color: 'bg-amber-500 text-white',
      trend: 'À traiter',
      link: '/admin/commandes?status=pending',
    },
    {
      icon: Banknote,
      label: 'Chiffre d’affaires',
      value: formatCurrency(stats.revenue ?? 0),
      note: 'Ventes produits nettes (hors livraison)',
      color: 'bg-emerald-600 text-white',
      trend: 'Ventes',
      link: '/admin/commandes',
    },
  ]

  const counts = categoriesList.map((category) => ({
    ...category,
    count: productsList.filter((product) => product.categoryId === category.id).length,
  }))
  const maximum = Math.max(...counts.map((item) => item.count), 1)

  return (
    <>
      <Title
        subtitle="Pilotez votre catalogue packaging, suivez vos stocks et traitez vos commandes."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
            <Link
              to="/admin/produits/nouveau"
              className="flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nouveau produit</span>
            </Link>
          </div>
        }
      >
        Tableau de bord
      </Title>

      {/* KPI Cards Grid (Clickable) */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <Link
              key={c.label}
              to={c.link}
              className="group relative block overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-black/40 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${c.color} shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 transition group-hover:bg-slate-900 group-hover:text-white">
                  <span>{c.trend}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500">{c.label}</p>
              <b className="mt-1 block text-2xl font-black tracking-tight text-slate-900">{c.value}</b>
              <p className="mt-1 text-[11px] text-slate-400">{c.note}</p>
            </Link>
          )
        })}
      </div>

      {/* Main Sections Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Category Breakdown */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Catalogue réel</p>
              <h2 className="font-display text-base font-bold text-slate-900">Produits par catégorie</h2>
            </div>
            <Link to="/admin/categories" className="text-xs font-bold text-slate-600 hover:text-black">
              Gérer
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {counts.map((item) => (
              <div key={item.id} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item.name}</span>
                  <b className="text-slate-900">{item.count} réf.</b>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-black transition-all duration-500"
                    style={{ width: `${(item.count / maximum) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {!counts.length && (
              <p className="py-6 text-center text-xs text-slate-400">Aucune catégorie pour le moment.</p>
            )}
          </div>
        </section>

        {/* Recent Orders Preview */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Flux d'achats</p>
              <h2 className="font-display text-base font-bold text-slate-900">Commandes récentes</h2>
            </div>
            <Link to="/admin/commandes" className="text-xs font-bold text-slate-600 hover:text-black">
              Voir tout ({ordersList.length})
            </Link>
          </div>

          <div className="mt-4">
            <OrderTable rows={ordersList.slice(0, 5)} />
          </div>
        </section>
      </div>
    </>
  )
}

function TrafficPanel() {
  const [traffic, setTraffic] = useState({ total: 0, visitors: 0, today: 0, daily: [], topPages: [] })
  const [period, setPeriod] = useState(30)
  const [loading, setLoading] = useState(false)

  const load = (days) => {
    setLoading(true)
    getTrafficStats(days)
      .then((data) => {
        setTraffic({
          total: data?.total || 0,
          visitors: data?.visitors || 0,
          today: data?.today || 0,
          daily: Array.isArray(data?.daily) ? data.daily : [],
          topPages: Array.isArray(data?.topPages) ? data.topPages : [],
        })
      })
      .catch((error) => {
        if (error?.code !== '42P01') toast.error(formatErrorMessage(error, 'Impossible de charger les statistiques.'))
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(period)
  }, [period])

  const dailyList = Array.isArray(traffic?.daily) ? traffic.daily : []
  const topPagesList = Array.isArray(traffic?.topPages) ? traffic.topPages : []
  const maximum = Math.max(...dailyList.map((item) => item.count), 1)

  const pageName = (path) => {
    const clean = decodeURIComponent(path || '').replace(/\/+$/, '') || '/'
    const fixed = {
      '/': 'Accueil (Boutique)',
      '/collections': 'Collection complète',
      '/galerie': 'Galerie visuelle',
      '/a-propos': 'À propos de FOOD PACK',
      '/contact': 'Contact & Devis',
      '/panier': 'Panier client',
      '/commande': 'Finalisation commande',
      '/faq': 'Foire aux questions',
    }
    if (fixed[clean]) return fixed[clean]
    if (clean.startsWith('/categories/')) return `Catégorie : ${clean.split('/').pop().replaceAll('-', ' ')}`
    if (clean.startsWith('/collections/')) return `Produit : ${clean.split('/').pop().replaceAll('-', ' ')}`
    return clean.replaceAll('-', ' ').replaceAll('/', ' ').trim()
  }

  const periodLabel = period ? `${period} derniers jours` : 'toute la période'

  return (
    <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Audience & Visites · {periodLabel}</p>
          <h2 className="font-display text-lg font-bold text-slate-900">Fréquentation du site</h2>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-100 p-1">
          {[
            [3, '3j'],
            [7, '7j'],
            [30, '30j'],
            [null, 'Tout'],
          ].map(([days, label]) => (
            <button
              key={days ?? 'all'}
              onClick={() => setPeriod(days)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                period === days ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Traffic Top Metrics */}
      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4 sm:max-w-md">
        {[
          [Users, 'Visiteurs uniques', traffic?.visitors || 0],
          [MousePointerClick, 'Pages vues', traffic?.total || 0],
          [Clock, 'Aujourd’hui', traffic?.today || 0],
        ].map(([Icon, label, value]) => (
          <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center sm:p-4">
            <Icon className="mx-auto h-4 w-4 text-slate-700" />
            <b className="mt-1 block text-lg font-black text-slate-900 sm:text-xl">{value}</b>
            <small className="block text-[10px] text-slate-500">{label}</small>
          </div>
        ))}
      </div>

      {/* Chart Bars */}
      <div className="mt-6 overflow-x-auto pb-2">
        <div
          className="grid h-36 min-w-[700px] items-end gap-2 rounded-xl bg-slate-50/50 p-4 border border-slate-100"
          style={{ gridTemplateColumns: `repeat(${Math.max(dailyList.length, 1)}, minmax(0, 1fr))` }}
        >
          {dailyList.map((item) => (
            <div
              key={item.date}
              title={`${new Date(item.date).toLocaleDateString('fr-FR')} : ${item.count} vue(s)`}
              className="group relative min-w-0 rounded-t bg-slate-900 transition hover:bg-[#FF3333]"
              style={{ height: `${Math.max(8, (item.count / maximum) * 100)}%` }}
            >
              <span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-black px-1.5 py-0.5 text-[9px] font-bold text-white shadow group-hover:block">
                {item.count}
              </span>
            </div>
          ))}
          {!dailyList.length && (
            <p className="col-span-full m-auto text-center text-xs text-slate-400">
              {loading ? 'Calcul en cours…' : 'Aucune visite enregistrée sur cette période.'}
            </p>
          )}
        </div>
      </div>

      {/* Top Pages Grid */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Pages les plus consultées</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {topPagesList.map((item, idx) => (
            <div
              key={item.path}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-2.5 text-xs"
            >
              <span className="flex items-center gap-2 truncate font-medium text-slate-700">
                <span className="grid h-5 w-5 place-items-center rounded bg-slate-200 text-[10px] font-bold text-slate-700">
                  {idx + 1}
                </span>
                <span className="truncate">{pageName(item.path)}</span>
              </span>
              <b className="ml-2 font-bold text-slate-900">{item.count}</b>
            </div>
          ))}
          {!topPagesList.length && <p className="text-xs text-slate-400">Aucune donnée de consultation.</p>}
        </div>
      </div>
    </section>
  )
}

export function DashboardPage() {
  return (
    <>
      <CatalogDashboard />
      <TrafficPanel />
    </>
  )
}

export function ProductsAdmin() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    getProducts({ includeDrafts: true })
      .then(setItems)
      .catch((error) => toast.error(formatErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [])

  const remove = async (product) => {
    if (!window.confirm(`Supprimer définitivement l'article « ${product.name} » ?`)) return
    try {
      await deleteProduct(product.id)
      setItems((current) => current.filter((item) => item.id !== product.id))
      toast.success('Produit supprimé du catalogue.')
    } catch (error) {
      toast.error(formatErrorMessage(error))
    }
  }

  const filtered = items.filter((p) => {
    const matchesQuery = (p.name || '').toLowerCase().includes(query.toLowerCase()) || (p.category || '').toLowerCase().includes(query.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || p.categorySlug === categoryFilter || p.category === categoryFilter
    return matchesQuery && matchesCategory
  })

  return (
    <>
      <Title
        subtitle="Consultez, modifiez et ajoutez vos emballages alimentaires et bouteilles."
        action={
          <Link
            to="/admin/produits/nouveau"
            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau produit</span>
          </Link>
        }
      >
        Produits & Emballages
      </Title>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        {/* Search & Filter bar */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-black/5">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom, format ou catégorie…"
              className="w-full bg-transparent outline-none placeholder:text-slate-400"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-black" />
            <p className="mt-3 text-xs text-slate-500">Chargement du catalogue FOOD PACK…</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Visuel</th>
                  <th className="px-4 py-3">Produit</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Prix unitaire</th>
                  <th className="px-4 py-3">Disponibilité</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/admin/produits/${p.id}/modifier`)}
                    className="cursor-pointer transition hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3">
                      <ProductMediaThumb product={p} alt={p.name} className="h-12 w-12 rounded-xl object-cover border border-slate-100" />
                    </td>
                    <td className="px-4 py-3">
                      <b className="text-slate-900 text-sm">{p.name}</b>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${p.isPublished ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-[10px] text-slate-500">{p.isPublished ? 'En ligne' : 'Brouillon'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-600">{p.category || 'Emballage'}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3">
                      <Status>{p.stockStatus}</Status>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50">
                          Modifier
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            remove(p)
                          }}
                          className="grid h-7 w-7 place-items-center rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                          aria-label={`Supprimer ${p.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-xs text-slate-400">
                      Aucun produit trouvé correspondant à vos critères.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

const emptyProduct = {
  name: '',
  slug: '',
  categoryId: '',
  price: '',
  oldPrice: '',
  shortDescription: '',
  description: '',
  formats: [],
  capacities: [],
  variants: [],
  materials: '',
  stockStatus: 'Disponible',
  featured: false,
  newArrival: true,
  topSelling: false,
  isPublished: true,
  images: [],
  imageRecords: [],
}

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

function ExistingProductImages({ records = [], onChange }) {
  const move = async (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= records.length) return
    const next = [...records]
    ;[next[index], next[target]] = [next[target], next[index]]
    try {
      await reorderProductImages(next)
      onChange(next)
      toast.success('Ordre des visuels actualisé.')
    } catch (error) {
      toast.error(formatErrorMessage(error))
    }
  }

  const remove = async (record) => {
    if (!window.confirm('Supprimer définitivement ce visuel ?')) return
    try {
      await deleteProductImage(record.id)
      onChange(records.filter((item) => item.id !== record.id))
      toast.success('Visuel supprimé.')
    } catch (error) {
      toast.error(formatErrorMessage(error))
    }
  }

  if (!records.length) return null

  return (
    <div className="mt-5 space-y-2">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Visuels enregistrés</p>
      {records.map((record, index) => (
        <div key={record.id} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2">
          {record.type === 'video' ? (
            <video src={record.url} muted playsInline preload="metadata" className="h-12 w-12 rounded-lg bg-black object-cover" />
          ) : (
            <img src={record.url} alt="" className="h-12 w-12 rounded-lg object-cover border" />
          )}
          <span className="flex-1 text-xs font-medium text-slate-700">
            {record.type === 'video' ? `Vidéo ${index + 1}` : index === 0 ? 'Image principale' : `Image ${index + 1}`}
          </span>
          <button
            type="button"
            disabled={index === 0}
            onClick={() => move(index, -1)}
            className="grid h-7 w-7 place-items-center rounded bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={index === records.length - 1}
            onClick={() => move(index, 1)}
            className="grid h-7 w-7 place-items-center rounded bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => remove(record)}
            className="grid h-7 w-7 place-items-center rounded bg-rose-50 text-rose-600 hover:bg-rose-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

export function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(emptyProduct)
  const [formatsInput, setFormatsInput] = useState('')
  const [categoryOptions, setCategoryOptions] = useState([])
  const [files, setFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const editing = Boolean(id)

  const quickVariantPresets = [
    { label: '250 ml', capacity: '250 ml' },
    { label: '330 ml', capacity: '330 ml' },
    { label: '500 ml', capacity: '500 ml' },
    { label: '750 ml', capacity: '750 ml' },
    { label: '1 Litre', capacity: '1 Litre' },
    { label: '1.5 Litres', capacity: '1.5 Litres' },
    { label: '2 Litres', capacity: '2 Litres' },
    { label: '5 Litres', capacity: '5 Litres' },
    { label: '100 g', capacity: '100 g' },
    { label: '250 g', capacity: '250 g' },
    { label: '500 g', capacity: '500 g' },
    { label: '1 kg', capacity: '1 kg' },
  ]

  const quickFormats = ['À l’unité', 'Lot de 25', 'Lot de 50', 'Lot de 100', 'Carton de 250', 'Carton de 500', 'Carton de 1000']
  const quickMaterials = [
    'PET transparent recyclable',
    'PEHD rigide haute densité',
    'Carton Kraft naturel ingraissable',
    'Polypropylène (PP) micro-ondable',
    'Aluminium alimentaire pur',
  ]

  useEffect(() => {
    Promise.all([getCategories(), editing ? getProducts({ includeDrafts: true }) : Promise.resolve([])])
      .then(([nextCategories, nextProducts]) => {
        setCategoryOptions(nextCategories)
        if (editing) {
          const found = nextProducts.find((item) => item.id === Number(id))
          if (found) {
            setProduct(found)
            setFormatsInput(Array.isArray(found.formats) ? found.formats.join(', ') : found.formats || '')
          }
        } else {
          setProduct(emptyProduct)
          setFormatsInput('')
          setFiles([])
        }
      })
      .catch((error) => toast.error(formatErrorMessage(error)))
  }, [editing, id])

  const update = (key, value) => setProduct((current) => ({ ...current, [key]: value }))

  const variants = Array.isArray(product.variants) ? product.variants : []

  const addVariant = (preset = {}) => {
    const newVar = {
      id: 'var-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      name: preset.capacity || preset.name || '',
      capacity: preset.capacity || preset.name || '',
      format: preset.format || '',
      price: preset.price || (product.price ? Number(product.price) : ''),
      old_price: preset.old_price || '',
      stock_status: preset.stock_status || 'Disponible',
    }
    const next = [...variants, newVar]
    update('variants', next)
    if (newVar.capacity && (!product.capacities || !product.capacities.includes(newVar.capacity))) {
      update('capacities', [...(product.capacities || []), newVar.capacity])
    }
  }

  const updateVariant = (index, key, value) => {
    const next = variants.map((v, i) => (i === index ? { ...v, [key]: value } : v))
    update('variants', next)
  }

  const duplicateVariant = (index) => {
    const target = variants[index]
    if (!target) return
    const cloned = {
      ...target,
      id: 'var-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      name: target.name ? `${target.name} (copie)` : 'Nouvelle variante',
    }
    const next = [...variants.slice(0, index + 1), cloned, ...variants.slice(index + 1)]
    update('variants', next)
  }

  const removeVariant = (index) => {
    const next = variants.filter((_, i) => i !== index)
    update('variants', next)
  }

  const toggleFormat = (fmt) => {
    const currentList = formatsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const exists = currentList.includes(fmt)
    const nextList = exists ? currentList.filter((item) => item !== fmt) : [...currentList, fmt]
    const nextString = nextList.join(', ')
    setFormatsInput(nextString)
    update('formats', nextString)
  }

  const handleFilesAdded = (e) => {
    const selected = Array.from(e.target.files)
    if (selected.length) {
      setFiles((prev) => [...prev, ...selected])
    }
    e.target.value = ''
  }

  const removePendingFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveProduct(
        {
          ...product,
          formats: formatsInput,
          slug: product.slug || slugify(product.name),
        },
        files
      )
      toast.success(editing ? 'Produit modifié avec succès !' : 'Produit ajouté avec succès dans le catalogue !')
      setProduct(emptyProduct)
      setFormatsInput('')
      setFiles([])
      navigate('/admin/produits')
    } catch (error) {
      console.error('Erreur saveProduct:', error)
      toast.error(formatErrorMessage(error, "Impossible d'enregistrer le produit. Vérifiez les informations saisies."))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Title
        subtitle={editing ? `Modification de « ${product.name} »` : 'Ajoutez un nouveau format d’emballage avec ses photos, variantes et tarifs au catalogue.'}
      >
        {editing ? 'Modifier le produit' : 'Nouveau produit'}
      </Title>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Main Details */}
        <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Nom de l'emballage / Référence *
              <input
                required
                value={product.name || ''}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Ex. Bidon Plastique Alimentaire / Bouteille PET Cristal"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-black focus:ring-2 focus:ring-black/5"
              />
            </label>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Identifiant URL (slug)
              <input
                value={product.slug || ''}
                onChange={(e) => update('slug', slugify(e.target.value))}
                placeholder={slugify(product.name) || 'bouteille-pet-cristal-330ml'}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-black focus:bg-white"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Catégorie *
                <select
                  required
                  value={product.categoryId || ''}
                  onChange={(e) => update('categoryId', e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-black"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categoryOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Prix standard (FCFA) *
                <input
                  required={!variants.length}
                  min="0"
                  type="number"
                  value={product.price ?? ''}
                  onChange={(e) => update('price', e.target.value)}
                  placeholder={variants.length ? 'Calculé auto depuis variantes' : 'Ex. 6500'}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-black"
                />
                {variants.length > 0 && (
                  <span className="mt-1 block text-[10px] text-slate-500 font-medium">
                    (Auto-ajusté sur le tarif le plus bas des variantes)
                  </span>
                )}
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Ancien prix barré (FCFA)
                <input
                  min="0"
                  type="number"
                  value={product.oldPrice || ''}
                  onChange={(e) => update('oldPrice', e.target.value)}
                  placeholder="Ex. 7500 (Optionnel)"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-black"
                />
              </label>
            </div>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              État du stock général *
              <select
                required
                value={product.stockStatus || 'Disponible'}
                onChange={(e) => update('stockStatus', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-black"
              >
                <option value="Disponible">Disponible immédiatement</option>
                <option value="Sur commande">Sur commande / Gros volumes</option>
                <option value="Indisponible">Rupture temporaire</option>
              </select>
            </label>

            {/* Section Variantes & Tarifs par contenance / format */}
            <div className="space-y-4 rounded-2xl border-2 border-slate-900/10 bg-slate-50/70 p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-slate-900" />
                    <h3 className="font-display text-sm font-bold text-slate-900">
                      Variantes & Tarifs par contenance / format
                    </h3>
                    {variants.length > 0 && (
                      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">
                        {variants.length} variante(s)
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Définissez les différentes capacités (ex. 250 ml, 500 ml, 1 Litre) avec leurs prix distincts. Une seule photo suffit !
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => addVariant()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-black px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Ajouter une variante</span>
                </button>
              </div>

              {/* Presets rapides */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Ajout rapide de formats / contenances usuels :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickVariantPresets.map((preset) => {
                    const active = variants.some((v) => v.capacity === preset.capacity || v.name === preset.capacity)
                    return (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => addVariant(preset)}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                          active
                            ? 'border border-emerald-300 bg-emerald-50 text-emerald-800'
                            : 'border border-slate-200 bg-white text-slate-700 hover:border-black hover:text-black shadow-2xs'
                        }`}
                      >
                        <Plus className="h-3 w-3 opacity-70" />
                        <span>{preset.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Liste des variantes */}
              {variants.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {variants.map((v, idx) => (
                    <div
                      key={v.id || idx}
                      className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-slate-300"
                    >
                      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-[10px] font-black text-slate-700">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {v.name || v.capacity || `Variante #${idx + 1}`}
                          </span>
                          {v.price ? (
                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
                              {formatCurrency(Number(v.price))}
                            </span>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => duplicateVariant(idx)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-black hover:text-black transition"
                            title="Dupliquer cette variante"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Dupliquer</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeVariant(idx)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50/50 px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-100 transition"
                            title="Supprimer cette variante"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                          Contenance / Nom *
                          <input
                            required
                            value={v.name || v.capacity || ''}
                            onChange={(e) => {
                              updateVariant(idx, 'name', e.target.value)
                              updateVariant(idx, 'capacity', e.target.value)
                            }}
                            placeholder="Ex. 250 ml, 1 Litre..."
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-black"
                          />
                        </label>

                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                          Conditionnement / Format
                          <input
                            value={v.format || ''}
                            onChange={(e) => updateVariant(idx, 'format', e.target.value)}
                            placeholder="Ex. Lot de 50, Carton..."
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-black"
                          />
                        </label>

                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                          Prix (FCFA) *
                          <input
                            required
                            type="number"
                            min="0"
                            value={v.price ?? ''}
                            onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                            placeholder="Ex. 1500"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-black"
                          />
                        </label>

                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                          Ancien prix (FCFA)
                          <input
                            type="number"
                            min="0"
                            value={v.old_price ?? ''}
                            onChange={(e) => updateVariant(idx, 'old_price', e.target.value)}
                            placeholder="Ex. 1800 (Optionnel)"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-black"
                          />
                        </label>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <span>Disponibilité du stock :</span>
                          <select
                            value={v.stock_status || 'Disponible'}
                            onChange={(e) => updateVariant(idx, 'stock_status', e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 outline-none focus:border-black"
                          >
                            <option value="Disponible">Disponible immédiatement</option>
                            <option value="Sur commande">Sur commande</option>
                            <option value="Indisponible">Rupture</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-center">
                  <p className="text-xs text-slate-500">
                    Aucune variante tarifaire configurée. Si ce produit a plusieurs contenances ou prix, cliquez sur un bouton ci-dessus pour les ajouter.
                  </p>
                </div>
              )}
            </div>

            {/* Conditionnements globaux & Formats */}
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Conditionnements / Conditionnement de vente
                </label>
                <span className="text-[11px] text-slate-400">Tapez librement ou cliquez pour ajouter</span>
              </div>
              <input
                value={formatsInput}
                onChange={(e) => {
                  const val = e.target.value
                  setFormatsInput(val)
                  update('formats', val)
                }}
                placeholder="Ex. Lot de 50, Lot de 100, Carton de 500"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickFormats.map((fmt) => {
                  const activeList = formatsInput.split(',').map((s) => s.trim()).filter(Boolean)
                  const active = activeList.includes(fmt)
                  return (
                    <button
                      type="button"
                      key={fmt}
                      onClick={() => toggleFormat(fmt)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                        active
                          ? 'bg-black text-white shadow-xs'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-black/40 hover:text-black'
                      }`}
                    >
                      {active ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3 opacity-60" />}
                      <span>{fmt}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Matériaux */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Matériaux & Type d'emballage
                <input
                  value={product.materials || ''}
                  onChange={(e) => update('materials', e.target.value)}
                  placeholder="Ex. PET transparent recyclable / Kraft naturel étanche / PP micro-ondable"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
                />
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickMaterials.map((mat) => (
                  <button
                    type="button"
                    key={mat}
                    onClick={() => update('materials', mat)}
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-medium transition ${
                      product.materials === mat
                        ? 'bg-slate-800 text-white'
                        : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Description courte
              <textarea
                rows="2"
                value={product.shortDescription || ''}
                onChange={(e) => update('shortDescription', e.target.value)}
                placeholder="Courte phrase d'accroche pour la boutique et les cartes produits…"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
              />
            </label>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Description détaillée et caractéristiques
              <textarea
                rows="5"
                value={product.description || ''}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Normes alimentaires, étanchéité, résistance thermique, conseils pour restaurateurs…"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-xs text-slate-900 outline-none focus:border-black"
              />
            </label>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-black py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? 'Enregistrement en cours…' : editing ? 'Mettre à jour le produit' : 'Enregistrer le produit'}
            </button>
          </div>
        </div>

        {/* Media & Settings Sidebar */}
        <aside className="space-y-6">
          {/* Multi-Photos Upload Section */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-slate-900">Photos & Vidéos</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                {(product.imageRecords?.length || 0) + files.length} média(s)
              </span>
            </div>

            {/* Dropzone to Add Files */}
            <label className="grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-6 text-center transition hover:border-black hover:bg-slate-100/60">
              <div className="flex flex-col items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-black text-white shadow-xs">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Ajouter des photos / vidéos</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Sélection multiple supportée (WebP, JPG, PNG, MP4)</p>
                </div>
              </div>
              <input
                type="file"
                accept="image/*,video/mp4,video/webm,video/quicktime"
                multiple
                onChange={handleFilesAdded}
                className="sr-only"
              />
            </label>

            {/* Pending Newly Selected Files */}
            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Nouvelles photos à enregistrer ({files.length})
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {files.map((file, idx) => {
                    const isVideo = file.type?.startsWith('video/')
                    const previewUrl = URL.createObjectURL(file)
                    return (
                      <div key={idx} className="group relative overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50/30 p-1.5 shadow-2xs">
                        {isVideo ? (
                          <video src={previewUrl} muted className="h-24 w-full rounded-lg bg-black object-cover" />
                        ) : (
                          <img src={previewUrl} alt="" className="h-24 w-full rounded-lg object-cover" />
                        )}
                        <div className="mt-1 flex items-center justify-between px-1">
                          <span className="truncate text-[10px] font-medium text-slate-600 max-w-[90px]">
                            {file.name}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {Math.round(file.size / 1024)} Ko
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePendingFile(idx)}
                          className="absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white shadow-sm hover:bg-rose-600 transition"
                          title="Retirer cette photo"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Existing Database Images */}
            <ExistingProductImages
              records={product.imageRecords}
              onChange={(records) =>
                setProduct((current) => ({
                  ...current,
                  imageRecords: records,
                  media: records,
                  images: records.filter((item) => item.type !== 'video').map((item) => item.url),
                }))
              }
            />
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Options d'affichage</h3>
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(product.featured)}
                onChange={(e) => update('featured', e.target.checked)}
                className="h-4 w-4 rounded accent-black"
              />
              Mise en avant sur l'accueil
            </label>
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(product.newArrival)}
                onChange={(e) => update('newArrival', e.target.checked)}
                className="h-4 w-4 rounded accent-black"
              />
              Marquer comme Nouveauté
            </label>
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(product.topSelling)}
                onChange={(e) => update('topSelling', e.target.checked)}
                className="h-4 w-4 rounded accent-black"
              />
              Marquer comme Meilleure Vente
            </label>
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={product.isPublished !== undefined ? Boolean(product.isPublished) : true}
                onChange={(e) => update('isPublished', e.target.checked)}
                className="h-4 w-4 rounded accent-black"
              />
              Publier sur le site
            </label>
          </div>
        </aside>
      </form>
    </>
  )
}

export function CategoriesAdmin() {
  const empty = { name: '', slug: '', description: '', isActive: true }
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const load = () =>
    getCategories({ includeInactive: true })
      .then(setItems)
      .catch((error) => toast.error(formatErrorMessage(error)))

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveCategory({ ...form, slug: form.slug || slugify(form.name), image: null })
      toast.success(form.id ? 'Catégorie modifiée avec succès.' : 'Catégorie enregistrée avec succès.')
      setForm(empty)
      load()
    } catch (error) {
      toast.error(formatErrorMessage(error, "Impossible d'enregistrer la catégorie."))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (category) => {
    if (!window.confirm(`Supprimer la catégorie « ${category.name} » ?`)) return
    try {
      await deleteCategory(category.id)
      setItems((current) => current.filter((item) => item.id !== category.id))
      toast.success('Catégorie supprimée.')
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Impossible de supprimer cette catégorie.'))
    }
  }

  return (
    <>
      <Title subtitle="Organisez votre catalogue d'emballages par types d'usages.">
        Catégories de produits
      </Title>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900">{form.id ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</h2>
            {form.id && (
              <button type="button" onClick={() => setForm(empty)} title="Annuler la modification">
                <X className="h-4 w-4 text-slate-400 hover:text-black" />
              </button>
            )}
          </div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Nom de la catégorie *
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex. Bouteilles & Pots"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Identifiant URL (slug)
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              placeholder={slugify(form.name) || 'bouteilles-et-pots'}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-700 outline-none focus:border-black focus:bg-white"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              placeholder="Description courte pour le référencement…"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-black py-3 text-xs font-bold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? 'Enregistrement…' : form.id ? 'Enregistrer les modifications' : 'Ajouter la catégorie'}
          </button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 h-fit">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex justify-between items-start">
              <div>
                <b className="font-bold text-sm text-slate-900">{item.name}</b>
                <p className="mt-1 text-xs text-slate-400 font-mono">/{item.slug}</p>
                {item.description && <p className="mt-2 text-xs text-slate-500 line-clamp-2">{item.description}</p>}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setForm({ id: item.id, name: item.name || '', slug: item.slug || '', description: item.description || '', isActive: item.isActive !== false })}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-black"
                  aria-label={`Modifier ${item.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(item)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-rose-500 hover:bg-rose-50"
                  aria-label={`Supprimer ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
          {!items.length && (
            <p className="col-span-full py-12 text-center text-xs text-slate-400">
              Aucune catégorie configurée.
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export function OrdersAdmin() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const statusFilter = searchParams.get('status') || 'all'

  const setStatusFilter = (status) => {
    if (status === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ status })
    }
  }

  useEffect(() => {
    getAdminOrders()
      .then(setRows)
      .catch((error) => toast.error(formatErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [])

  const filtered = rows.filter((r) => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'pending') return ['new', 'confirmed', 'in_progress'].includes(r.status)
    return r.status === statusFilter
  })

  return (
    <>
      <Title subtitle="Suivez et traitez les commandes passées sur FOOD PACK.">
        Gestion des commandes
      </Title>

      <div className="space-y-4">
        {/* Status filter tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-2xs">
          {[
            ['all', 'Toutes'],
            ['pending', 'À traiter'],
            ['new', 'Nouvelles'],
            ['confirmed', 'Confirmées'],
            ['in_progress', 'En préparation'],
            ['ready', 'Prêtes'],
            ['delivered', 'Livrées'],
            ['cancelled', 'Annulées'],
          ].map(([status, label]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                statusFilter === status
                  ? 'bg-black text-white shadow-xs'
                  : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-black" />
            <p className="mt-3 text-xs text-slate-500">Chargement des commandes…</p>
          </div>
        ) : (
          <OrderTable rows={filtered} />
        )}
      </div>
    </>
  )
}

export function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    getAdminOrders()
      .then((rows) => setOrder(rows.find((item) => item.id === id) || null))
      .catch((error) => toast.error(formatErrorMessage(error)))
  }, [id])

  const changeStatus = async (status) => {
    try {
      const updated = await updateOrderStatus(id, status)
      setOrder((current) => ({ ...current, ...updated }))
      toast.success('Statut de la commande mis à jour.')
    } catch (error) {
      toast.error(formatErrorMessage(error))
    }
  }

  return (
    <>
      <Title
        subtitle={`Commande enregistrée le ${order?.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '—'}`}
      >
        Commande {order?.order_number || id}
      </Title>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-2 space-y-6">
          <h2 className="font-display text-base font-bold text-slate-900">Articles commandés</h2>
          <div className="divide-y divide-slate-100 border-y border-slate-100">
            {order?.order_items?.map((item) => (
              <div key={item.id} className="py-4 flex justify-between items-center">
                <div>
                  <b className="text-sm font-bold text-slate-900">{item.product_name || 'Emballage FOOD PACK'}</b>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quantité : <span className="font-bold text-slate-800">{item.quantity}</span>
                    {item.format ? ` · Format ${item.format}` : item.size ? ` · Format ${item.size}` : ''}
                    {item.capacity ? ` · ${item.capacity}` : item.color ? ` · ${item.color}` : ''}
                  </p>
                </div>
                <b className="text-sm font-bold text-slate-900">
                  {formatCurrency((item.unit_price || 0) * (item.quantity || 1))}
                </b>
              </div>
            ))}
            {!order?.order_items?.length && (
              <p className="py-6 text-center text-xs text-slate-400">Aucun détail produit enregistré.</p>
            )}
          </div>

          <div className="rounded-xl bg-slate-50 p-4 space-y-2.5 text-xs border border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Sous-total articles (CA réel)</span>
              <b className="font-bold text-slate-900">{formatCurrency(order?.subtotal || order?.total || 0)}</b>
            </div>
            {(order?.discount_amount || 0) > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Remise promo ({order?.promo_code || 'Code'})</span>
                <b>-{formatCurrency(order.discount_amount)}</b>
              </div>
            )}
            <div className="flex justify-between items-center text-slate-600">
              <span>Frais de livraison</span>
              {(order?.delivery_fee && Number(order.delivery_fee) > 0) ? (
                <b className="font-bold text-slate-900">{formatCurrency(order.delivery_fee)}</b>
              ) : (
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
                  À régler avec le livreur (hors CA)
                </span>
              )}
            </div>
            <div className="border-t border-slate-200 pt-2.5 flex justify-between items-center text-sm font-black text-slate-900">
              <span>Montant total commande</span>
              <span className="text-lg">{formatCurrency(order?.total || 0)}</span>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6 h-fit">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">Client</h2>
            <div className="mt-4 space-y-2 text-xs">
              <p className="text-sm font-bold text-slate-900">{order?.customer_name || 'Client sans nom'}</p>
              <p className="text-slate-600 font-mono">{order?.phone || 'Téléphone non précisé'}</p>
              <p className="text-slate-600">{order?.city || 'Cotonou'}</p>
              {order?.delivery_address && (
                <p className="text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {order.delivery_address}
                </p>
              )}
              {order && (
                <div className="pt-2">
                  <Status>{order.status}</Status>
                </div>
              )}
            </div>
          </div>

          {order && (
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Changer le statut
              <select
                value={order.status}
                onChange={(e) => changeStatus(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-black"
              >
                <option value="new">Nouvelle</option>
                <option value="confirmed">Confirmée</option>
                <option value="in_progress">En préparation</option>
                <option value="ready">Prête</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </label>
          )}

          {order?.phone && (
            <a
              href={`https://wa.me/${order.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Contacter sur WhatsApp</span>
            </a>
          )}
        </aside>
      </div>
    </>
  )
}

function GalleryAdmin() {
  const empty = { title: '', category: '', sortOrder: 0, isPublished: true, mediaType: 'image' }
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () =>
    getGallery({ includeDrafts: true })
      .then(setItems)
      .catch((error) => toast.error(formatErrorMessage(error)))

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveGalleryItem(form, file)
      toast.success(form.id ? 'Réalisation modifiée avec succès.' : 'Réalisation ajoutée avec succès.')
      setForm(empty)
      setFile(null)
      load()
    } catch (error) {
      toast.error(formatErrorMessage(error, "Impossible d'enregistrer cette réalisation."))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (item) => {
    if (!window.confirm(`Supprimer « ${item.title} » ?`)) return
    try {
      await deleteGalleryItem(item.id)
      load()
      toast.success('Réalisation supprimée.')
    } catch (error) {
      toast.error(formatErrorMessage(error))
    }
  }

  return (
    <>
      <Title subtitle="Ajoutez des photos de vos emballages en situation réelle.">
        Galerie & Réalisations
      </Title>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900">{form.id ? 'Modifier' : 'Ajouter un visuel'}</h2>
            {form.id && (
              <button type="button" onClick={() => { setForm(empty); setFile(null) }}>
                <X className="h-4 w-4 text-slate-400 hover:text-black" />
              </button>
            )}
          </div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Titre *
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex. Bouteilles de jus de bissap"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Catégorie d'usage
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Ex. Jus & Boissons"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Photo ou vidéo {!form.id && '*'}
            <input
              required={!form.id && !form.image}
              type="file"
              accept="image/*,video/mp4,video/webm"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-1.5 block w-full text-xs text-slate-600"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-black py-3 text-xs font-bold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? 'Enregistrement…' : form.id ? 'Enregistrer les modifications' : 'Ajouter à la galerie'}
          </button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 h-fit">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
              {item.mediaType === 'video' ? (
                <video src={item.image} controls muted playsInline className="h-44 w-full bg-black object-contain" />
              ) : (
                <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
              )}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <b className="font-bold text-xs text-slate-900">{item.title}</b>
                  <p className="text-[10px] text-slate-400">{item.category || 'Général'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setForm(item); setFile(null) }} className="text-slate-600 hover:text-black">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(item)} className="text-rose-500 hover:text-rose-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
          {!items.length && (
            <p className="col-span-full py-12 text-center text-xs text-slate-400">
              Aucune réalisation dans la galerie pour le moment.
            </p>
          )}
        </div>
      </div>
    </>
  )
}

function TestimonialsAdmin() {
  const empty = { name: '', city: '', text: '', sortOrder: 0, isPublished: true }
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const load = () =>
    getTestimonials({ includeDrafts: true })
      .then(setItems)
      .catch((error) => toast.error(formatErrorMessage(error)))

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveTestimonial(form)
      toast.success(form.id ? 'Avis modifié avec succès.' : 'Témoignage ajouté avec succès.')
      setForm(empty)
      load()
    } catch (error) {
      toast.error(formatErrorMessage(error, "Impossible d'enregistrer le témoignage."))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (item) => {
    if (!window.confirm(`Supprimer l'avis de ${item.name} ?`)) return
    try {
      await deleteTestimonial(item.id)
      load()
      toast.success('Avis supprimé.')
    } catch (error) {
      toast.error(formatErrorMessage(error))
    }
  }

  return (
    <>
      <Title subtitle="Gérez les avis et témoignages des restaurateurs et traiteurs partenaires.">
        Avis & Témoignages
      </Title>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900">{form.id ? 'Modifier l’avis' : 'Nouveau témoignage'}</h2>
            {form.id && (
              <button type="button" onClick={() => setForm(empty)} title="Annuler la modification">
                <X className="h-4 w-4 text-slate-400 hover:text-black" />
              </button>
            )}
          </div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Nom du client / Établissement *
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex. Le Délice de Cotonou"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Ville / Localisation
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Ex. Cotonou, Haie Vive"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Témoignage *
            <textarea
              required
              rows="4"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="Ce que le client apprécie sur nos emballages…"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-black py-3 text-xs font-bold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? 'Enregistrement…' : form.id ? 'Mettre à jour' : 'Ajouter le témoignage'}
          </button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2 h-fit">
          {items.map((item) => (
            <blockquote key={item.id} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
              <p className="text-xs italic text-slate-700 leading-relaxed">« {item.text} »</p>
              <footer className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div>
                  <b className="block text-xs font-bold text-slate-900">{item.name}</b>
                  <span className="text-[10px] text-slate-400">{item.city || 'Cotonou'}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setForm(item)} className="text-slate-600 hover:text-black">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(item)} className="text-rose-500 hover:text-rose-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </footer>
            </blockquote>
          ))}
          {!items.length && (
            <p className="col-span-full py-12 text-center text-xs text-slate-400">
              Aucun avis pour le moment.
            </p>
          )}
        </div>
      </div>
    </>
  )
}

function SettingsAdmin() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSiteSettings()
      .then(setForm)
      .catch((error) => toast.error(formatErrorMessage(error)))
  }, [])

  if (!form) {
    return (
      <>
        <Title subtitle="Paramètres généraux de la boutique">Paramètres</Title>
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
          Chargement des paramètres…
        </div>
      </>
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      setForm(await saveSiteSettings(form))
      toast.success('Paramètres FOOD PACK enregistrés.')
    } catch (error) {
      toast.error(formatErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Title subtitle="Coordonnées, numéros WhatsApp, réseaux sociaux et livraison.">
        Paramètres de la boutique
      </Title>

      <form onSubmit={submit} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs max-w-3xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Nom de la marque
            <input
              required
              value={form.shop_name || 'FOOD PACK'}
              onChange={(e) => setForm({ ...form, shop_name: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Numéro WhatsApp commandes
            <PhoneInput
              value={form.whatsapp || ''}
              onChange={(value) => setForm({ ...form, whatsapp: value })}
              className="mt-1.5"
            />
          </label>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Téléphone appel direct
            <PhoneInput
              value={form.phone || ''}
              onChange={(value) => setForm({ ...form, phone: value })}
              className="mt-1.5"
            />
          </label>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Adresse E-mail
            <input
              type="email"
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 sm:col-span-2">
            Adresse physique / Dépôt
            <input
              value={form.address || ''}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Cotonou, Bénin"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Lien Instagram
            <input
              value={form.instagram || ''}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              placeholder="https://instagram.com/foodpack"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Lien Facebook
            <input
              value={form.facebook || ''}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              placeholder="https://facebook.com/foodpack"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Lien TikTok
            <input
              value={form.tiktok || ''}
              onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
              placeholder="https://tiktok.com/@foodpack"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
              <Truck className="h-4 w-4 text-slate-700" />
              <span>Gestion des frais de livraison</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition ${
                  Number(form.delivery_fee || 0) === 0
                    ? 'border-black bg-white shadow-xs ring-1 ring-black'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="deliveryMode"
                    checked={Number(form.delivery_fee || 0) === 0}
                    onChange={() => setForm({ ...form, delivery_fee: 0 })}
                    className="mt-0.5 accent-black"
                  />
                  <div>
                    <b className="block text-xs font-bold text-slate-900">À régler avec le livreur</b>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                      Aucun frais fixe ajouté au panier. Le client règle le transport directement au livreur selon sa localisation.
                    </p>
                  </div>
                </div>
                <span className="mt-3 inline-flex w-fit rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  Option recommandée
                </span>
              </label>

              <label
                className={`flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition ${
                  Number(form.delivery_fee || 0) > 0
                    ? 'border-black bg-white shadow-xs ring-1 ring-black'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="deliveryMode"
                    checked={Number(form.delivery_fee || 0) > 0}
                    onChange={() => setForm({ ...form, delivery_fee: Number(form.delivery_fee) > 0 ? Number(form.delivery_fee) : 2000 })}
                    className="mt-0.5 accent-black"
                  />
                  <div>
                    <b className="block text-xs font-bold text-slate-900">Frais de livraison fixes</b>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                      Un montant forfaitaire fixe est ajouté au total de chaque commande sur le site.
                    </p>
                  </div>
                </div>

                {Number(form.delivery_fee || 0) > 0 && (
                  <div className="mt-3">
                    <label className="block text-[11px] font-bold uppercase text-slate-700">
                      Montant fixe (FCFA)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={form.delivery_fee}
                      onChange={(e) => setForm({ ...form, delivery_fee: Math.max(0, Number(e.target.value)) })}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-black focus:bg-white"
                    />
                  </div>
                )}
              </label>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Note : Le chiffre d’affaires affiché sur votre tableau de bord comptabilise uniquement les ventes nettes d'emballages et exclut automatiquement les frais de livraison.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-black px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? 'Enregistrement…' : 'Enregistrer les paramètres'}
        </button>
      </form>
    </>
  )
}

function ProfileAdmin() {
  const [profile, setProfile] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getAdminProfile()
      .then(setProfile)
      .catch((error) => toast.error(formatErrorMessage(error)))
  }, [])

  if (!profile) {
    return (
      <>
        <Title subtitle="Gestion du compte administrateur">Mon Compte</Title>
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
          Chargement du profil…
        </div>
      </>
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const nextProfile = await saveAdminProfile(profile.full_name)
      if (password) {
        if (password.length < 6) throw new Error('Le mot de passe doit contenir au moins 6 caractères.')
        if (password !== confirmation) throw new Error('Les mots de passe ne correspondent pas.')
        await updateAdminPassword(password)
        setPassword('')
        setConfirmation('')
        toast.success('Mot de passe mis à jour avec succès.')
      }
      setProfile({ ...nextProfile, email: profile.email })
      toast.success('Profil administrateur mis à jour.')
    } catch (error) {
      toast.error(formatErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Title subtitle="Modifiez votre nom complet ou changez votre mot de passe administrateur.">
        Mon Compte Administrateur
      </Title>

      <form onSubmit={submit} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs max-w-xl space-y-6">
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Nom complet
            <input
              required
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            E-mail de connexion
            <input
              disabled
              value={profile.email || ''}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500 outline-none cursor-not-allowed"
            />
            <span className="mt-1 block text-[10px] text-slate-400">L'identifiant est géré via Supabase Auth.</span>
          </label>

          <div className="border-t border-slate-100 pt-5 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Changer de mot de passe</p>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Nouveau mot de passe
              <input
                type="password"
                minLength="6"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 caractères minimum"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Confirmer le mot de passe
              <input
                type="password"
                minLength="6"
                autoComplete="new-password"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="Répétez le mot de passe"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-black px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? 'Enregistrement…' : 'Mettre à jour mon profil'}
        </button>
      </form>
    </>
  )
}

function TeamAdmin() {
  const { profile: currentProfile, isSuperAdmin } = useAdminAuth()
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [showSqlHelper, setShowSqlHelper] = useState(false)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'admin',
  })

  const loadTeam = async () => {
    setLoading(true)
    try {
      const data = await getAdminTeam()
      setTeam(data)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Impossible de charger l’équipe.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeam()
  }, [])

  const handleRoleChange = async (targetUser, newRole) => {
    if (targetUser.id === currentProfile?.id && newRole !== 'superadmin') {
      const superAdmins = team.filter((m) => m.role === 'superadmin')
      if (superAdmins.length <= 1) {
        return toast.error('Vous êtes le seul Super Administrateur. Désignez un autre Super Admin avant de changer votre rôle.')
      }
    }

    setActionLoadingId(targetUser.id)
    try {
      await updateAdminRole(targetUser.id, newRole)
      toast.success(`Rôle de ${targetUser.full_name || 'l’utilisateur'} mis à jour (${newRole === 'superadmin' ? 'Super Admin' : 'Admin'}).`)
      await loadTeam()
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erreur lors du changement de rôle.'))
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleRevoke = async (targetUser) => {
    if (targetUser.id === currentProfile?.id) {
      return toast.error('Vous ne pouvez pas révoquer votre propre accès administrateur.')
    }

    if (!window.confirm(`Êtes-vous certain de vouloir retirer les accès administrateur de ${targetUser.full_name || 'ce membre'} ?`)) {
      return
    }

    setActionLoadingId(targetUser.id)
    try {
      await revokeAdminAccess(targetUser.id)
      toast.success(`Accès administrateur révoqué pour ${targetUser.full_name || 'le compte'}.`)
      await loadTeam()
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erreur lors de la révocation.'))
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password || !formData.full_name) {
      return toast.error('Veuillez remplir tous les champs obligatoires.')
    }
    if (formData.password.length < 6) {
      return toast.error('Le mot de passe doit contenir au moins 6 caractères.')
    }

    setCreating(true)
    try {
      await createAdminAccount({
        email: formData.email.trim(),
        password: formData.password,
        full_name: formData.full_name.trim(),
        role: formData.role,
      })
      toast.success(`Le compte ${formData.role === 'superadmin' ? 'Super Administrateur' : 'Administrateur'} a été créé avec succès.`)
      setFormData({ full_name: '', email: '', password: '', role: 'admin' })
      setModalOpen(false)
      await loadTeam()
    } catch (error) {
      console.error('Erreur création admin :', error)
      toast.error(formatErrorMessage(error, 'Impossible de créer le compte administrateur.'))
    } finally {
      setCreating(false)
    }
  }

  const filteredTeam = team.filter((member) => {
    const q = searchQuery.toLowerCase()
    return (
      member.full_name?.toLowerCase().includes(q) ||
      member.phone?.toLowerCase().includes(q) ||
      member.id?.toLowerCase().includes(q) ||
      member.role?.toLowerCase().includes(q)
    )
  })

  const superAdminsCount = team.filter((m) => m.role === 'superadmin').length
  const standardAdminsCount = team.filter((m) => m.role === 'admin').length

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Title subtitle="Gérez les comptes autorisés, les rôles de gestion et les accès Super Administrateur.">
          Équipe & Administrateurs
        </Title>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowSqlHelper(!showSqlHelper)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
            <span>Guide SQL & Rôles</span>
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter un administrateur</span>
            </button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Membres de l'équipe</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-700">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-black text-slate-900">{team.length}</p>
          <p className="mt-1 text-[11px] text-slate-500">Comptes avec accès au panneau admin</p>
        </div>

        <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 to-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Super Administrateurs</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-100 text-amber-800 font-bold text-xs">
              SA
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-black text-amber-950">{superAdminsCount}</p>
          <p className="mt-1 text-[11px] text-amber-800/80">Accès total et gestion des accès</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gestionnaires</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
              AD
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-black text-slate-900">{standardAdminsCount}</p>
          <p className="mt-1 text-[11px] text-slate-500">Gestion des commandes et du catalogue</p>
        </div>
      </div>

      {/* SQL & Role Info Box */}
      {showSqlHelper && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 text-xs text-blue-950 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-700" />
              <strong className="text-sm font-bold">Rôles et permissions dans FOOD PACK</strong>
            </div>
            <button
              onClick={() => setShowSqlHelper(false)}
              className="text-blue-600 hover:text-blue-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 pt-1">
            <div className="rounded-xl border border-blue-200/80 bg-white p-3.5 space-y-1">
              <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                Super Administrateur
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Accès illimité. Peut créer et supprimer des administrateurs, modifier les rôles de l'équipe, consulter les logs de sécurité et configurer les paramètres clés du site.
              </p>
            </div>
            <div className="rounded-xl border border-blue-200/80 bg-white p-3.5 space-y-1">
              <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-800">
                Administrateur / Gestionnaire
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Gestion opérationnelle quotidienne : ajout et modification de produits, traitement des commandes, mise à jour des stocks, galerie et avis clients.
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-blue-200/60">
            <p className="text-[11px] text-slate-600 mb-1.5">
              Si vous souhaitez promouvoir directement un compte via l'éditeur SQL de Supabase :
            </p>
            <div className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2 font-mono text-[11px] text-emerald-400">
              <code>update public.profiles set role = 'superadmin' where id = 'VOTRE_USER_ID';</code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("update public.profiles set role = 'superadmin' where id = 'VOTRE_USER_ID';")
                  toast.success('Requête SQL copiée !')
                }}
                className="ml-3 rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-200 hover:bg-slate-700"
              >
                Copier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, rôle ou ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-black"
            />
          </div>
          <button
            onClick={loadTeam}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Chargement des membres de l'équipe…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Membre</th>
                  <th className="px-4 py-3">Rôle & Privilèges</th>
                  <th className="px-4 py-3">Identifiant / Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeam.map((member) => {
                  const isCurrent = member.id === currentProfile?.id
                  const isMemberSuperAdmin = member.role === 'superadmin'

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-bold text-white shadow-xs ${
                            isMemberSuperAdmin
                              ? 'bg-gradient-to-tr from-amber-600 to-amber-500'
                              : 'bg-gradient-to-tr from-slate-700 to-slate-600'
                          }`}>
                            {member.full_name ? member.full_name.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{member.full_name || 'Administrateur'}</span>
                              {isCurrent && (
                                <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-800">
                                  Vous
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500">{member.phone || 'Contact non renseigné'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        {isMemberSuperAdmin ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900 shadow-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Super Administrateur
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            Administrateur
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                        <div title={member.id} className="truncate max-w-[160px]">
                          ID: {member.id?.slice(0, 12)}…
                        </div>
                        <span className="text-[10px] text-slate-400 font-sans">
                          Depuis le {member.created_at ? new Date(member.created_at).toLocaleDateString('fr-FR') : '—'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        {isSuperAdmin ? (
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle role button */}
                            {isMemberSuperAdmin ? (
                              <button
                                onClick={() => handleRoleChange(member, 'admin')}
                                disabled={actionLoadingId === member.id}
                                title="Rétrograder en administrateur"
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition"
                              >
                                {actionLoadingId === member.id ? '…' : 'Passer en Admin'}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRoleChange(member, 'superadmin')}
                                disabled={actionLoadingId === member.id}
                                title="Promouvoir en Super Administrateur"
                                className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-100 disabled:opacity-50 transition"
                              >
                                {actionLoadingId === member.id ? '…' : 'Promouvoir Super Admin'}
                              </button>
                            )}

                            {/* Revoke button */}
                            {!isCurrent && (
                              <button
                                onClick={() => handleRevoke(member)}
                                disabled={actionLoadingId === member.id}
                                title="Révoquer l'accès"
                                className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 transition"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Lecture seule</span>
                        )}
                      </td>
                    </tr>
                  )
                })}

                {!filteredTeam.length && (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-xs text-slate-400">
                      Aucun administrateur trouvé correspondant à la recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Ajouter un administrateur */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">Ajouter un administrateur</h2>
                <p className="text-xs text-slate-500">Créez un nouveau compte avec accès au panneau de gestion.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Nom complet du collaborateur *
                  <input
                    required
                    type="text"
                    placeholder="Ex: Marius - Responsable des Ventes"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Adresse E-mail de connexion *
                  <input
                    required
                    type="email"
                    placeholder="collaborateur@foodpack.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mot de passe provisoire *
                  <input
                    required
                    type="password"
                    minLength="6"
                    placeholder="6 caractères minimum"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
                  />
                </label>
                <span className="mt-1 block text-[10px] text-slate-400">
                  Le collaborateur pourra modifier son mot de passe depuis son profil.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Rôle attribué *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex cursor-pointer flex-col rounded-xl border p-3 transition ${
                    formData.role === 'admin'
                      ? 'border-black bg-slate-50 ring-1 ring-black'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Administrateur</span>
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={formData.role === 'admin'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="h-3.5 w-3.5"
                      />
                    </div>
                    <span className="mt-1 text-[10px] text-slate-500">Produits, commandes, stocks et clients.</span>
                  </label>

                  <label className={`flex cursor-pointer flex-col rounded-xl border p-3 transition ${
                    formData.role === 'superadmin'
                      ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950">Super Admin</span>
                      <input
                        type="radio"
                        name="role"
                        value="superadmin"
                        checked={formData.role === 'superadmin'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="h-3.5 w-3.5"
                      />
                    </div>
                    <span className="mt-1 text-[10px] text-amber-800/80">Accès total, équipe et paramètres.</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-black px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition"
                >
                  {creating ? 'Création en cours…' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export function SimpleAdminPage({ title, type }) {
  if (type === 'gallery') return <GalleryAdmin />
  if (type === 'testimonials') return <TestimonialsAdmin />
  if (type === 'team' || title === 'Équipe' || title === 'Équipe & Administrateurs') return <TeamAdmin />
  if (title === 'Paramètres') return <SettingsAdmin />
  if (title === 'Profil') return <ProfileAdmin />
  return (
    <>
      <Title subtitle="Section opérationnelle">{title}</Title>
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
        Cette section est configurée et synchronisée avec la base de données.
      </div>
    </>
  )
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reinitialiser`,
    })
    setLoading(false)
    if (error) return toast.error(formatErrorMessage(error))
    setSent(true)
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#F8FAFC] p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="text-center">
          <Link to="/" className="font-display text-2xl font-black uppercase text-slate-900">
            FOOD PACK<span className="text-[#FF3333]">.</span>
          </Link>
          <h1 className="mt-4 font-display text-xl font-bold text-slate-900">Récupération de mot de passe</h1>
        </div>
        {sent ? (
          <div className="mt-6 text-center space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Si cette adresse correspond à un compte administrateur, un lien de réinitialisation sécurisé vient d’être envoyé.
            </p>
            <Link to="/admin/connexion" className="inline-block rounded-xl bg-black px-6 py-3 text-xs font-bold text-white">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Adresse e-mail du compte
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@foodpack.com"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-black"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-3.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? 'Envoi en cours…' : 'Envoyer le lien sécurisé'}
            </button>
            <Link to="/admin/connexion" className="block text-center text-xs font-medium text-slate-500 hover:text-black">
              Retour à la page de connexion
            </Link>
          </div>
        )}
      </form>
    </div>
  )
}

export function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (password.length < 6) return toast.error('Le mot de passe doit contenir au moins 6 caractères.')
    if (password !== confirmation) return toast.error('Les mots de passe ne correspondent pas.')
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSaving(false)
    if (error) return toast.error(formatErrorMessage(error))
    toast.success('Mot de passe mis à jour avec succès.')
    window.location.replace('/admin')
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#F8FAFC] p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="text-center">
          <Link to="/" className="font-display text-2xl font-black uppercase text-slate-900">
            FOOD PACK<span className="text-[#FF3333]">.</span>
          </Link>
          <h1 className="mt-4 font-display text-xl font-bold text-slate-900">Définir un nouveau mot de passe</h1>
        </div>
        <div className="mt-6 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Nouveau mot de passe
            <input
              required
              minLength="6"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 caractères minimum"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-black"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Confirmer le mot de passe
            <input
              required
              minLength="6"
              type="password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Saisissez le même mot de passe"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-black"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-black py-3.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? 'Enregistrement…' : 'Enregistrer le nouveau mot de passe'}
          </button>
        </div>
      </form>
    </div>
  )
}

export function AuditLogPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAuditLogs()
      .then(setLogs)
      .catch((error) => toast.error(formatErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [])

  const labels = {
    products: 'Produits & Emballages',
    categories: 'Catégories',
    gallery_items: 'Galerie',
    testimonials: 'Avis',
    site_content: 'Contenus',
    site_settings: 'Paramètres',
  }
  const actions = { INSERT: 'Création', UPDATE: 'Modification', DELETE: 'Suppression' }

  return (
    <>
      <Title subtitle="Historique des actions de gestion et opérations sensibles.">
        Journal de sécurité
      </Title>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Chargement du journal…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Horodatage</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Élément</th>
                  <th className="px-4 py-3">Auteur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono text-slate-500">
                      {new Date(log.occurred_at).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{actions[log.action] || log.action}</td>
                    <td className="px-4 py-3 text-slate-600">{labels[log.table_name] || log.table_name}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{log.record_id || '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{log.admin_id?.slice(0, 8) || 'Système'}</td>
                  </tr>
                ))}
                {!logs.length && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-xs text-slate-400">
                      Aucune action enregistrée pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
