import { useEffect, useState } from 'react'
import { Navigate, Link, useNavigate, useParams } from 'react-router-dom'
import {
  Eye, EyeOff, Plus, Search, ArrowUpRight, Package, ShoppingBag, Clock, Banknote,
  Trash2, Pencil, X, ArrowUp, ArrowDown, Users, MousePointerClick, CheckCircle2,
  AlertCircle, ChevronRight, MessageCircle, ExternalLink, Filter, ShieldCheck, RefreshCw
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
import {
  deleteCategory, deleteGalleryItem, deleteProduct, deleteProductImage, deleteTestimonial,
  getAdminOrders, getAdminProfile, getCategories, getDashboardData, getGallery,
  getProducts, getSiteContent, getSiteSettings, getTestimonials, getTrafficStats, getAuditLogs,
  reorderProductImages, saveAdminProfile, saveCategory, saveGalleryItem, saveProduct,
  saveSiteContent, uploadCatalogImage, saveSiteSettings, saveTestimonial,
  updateAdminEmail, updateAdminPassword, updateOrderStatus,
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
      toast.error(
        error.message === 'Invalid login credentials'
          ? 'E-mail ou mot de passe incorrect.'
          : error.message === 'Email not confirmed'
          ? 'E-mail non confirmé dans Supabase (cochez Auto Confirm).'
          : error.message
      )
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
        toast.error(error.message)
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
      note: 'Références actives',
      color: 'bg-slate-900 text-white',
      trend: '+3 formats',
    },
    {
      icon: ShoppingBag,
      label: 'Commandes totales',
      value: stats.orders ?? ordersList.length,
      note: 'Depuis le lancement',
      color: 'bg-blue-600 text-white',
      trend: 'En direct',
    },
    {
      icon: Clock,
      label: 'Commandes à traiter',
      value: stats.pending ?? 0,
      note: 'En attente ou préparation',
      color: 'bg-amber-500 text-white',
      trend: 'Prioritaire',
    },
    {
      icon: Banknote,
      label: 'Chiffre d’affaires',
      value: formatCurrency(stats.revenue ?? 0),
      note: 'Hors commandes annulées',
      color: 'bg-emerald-600 text-white',
      trend: 'Total cumulé',
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

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <div
              key={c.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${c.color} shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  {c.trend}
                </span>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500">{c.label}</p>
              <b className="mt-1 block text-2xl font-black tracking-tight text-slate-900">{c.value}</b>
              <p className="mt-1 text-[11px] text-slate-400">{c.note}</p>
            </div>
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
        if (error?.code !== '42P01') toast.error(error.message)
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
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    getProducts({ includeDrafts: true })
      .then(setItems)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false))
  }, [])

  const remove = async (product) => {
    if (!window.confirm(`Supprimer définitivement l'article « ${product.name} » ?`)) return
    try {
      await deleteProduct(product.id)
      setItems((current) => current.filter((item) => item.id !== product.id))
      toast.success('Produit supprimé du catalogue.')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const filtered = items.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())
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
  colors: [],
  sizes: [],
  stockStatus: 'Disponible',
  featured: false,
  newProduct: true,
  popular: false,
  customizable: true,
  productionTime: '',
  materials: '',
  careInstructions: '',
  deliveryInformation: '',
  isPublished: true,
  images: [],
}

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const normalizeColorEntry = (value) => {
  const clean = value.trim()
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : ''
}
const normalizeSizeEntry = (value) => value.trim()

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
      toast.error(error.message)
    }
  }

  const remove = async (record) => {
    if (!window.confirm('Supprimer définitivement ce visuel ?')) return
    try {
      await deleteProductImage(record.id)
      onChange(records.filter((item) => item.id !== record.id))
      toast.success('Visuel supprimé.')
    } catch (error) {
      toast.error(error.message)
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
  const [categoryOptions, setCategoryOptions] = useState([])
  const [files, setFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const editing = Boolean(id)

  useEffect(() => {
    Promise.all([getCategories(), editing ? getProducts({ includeDrafts: true }) : Promise.resolve([])])
      .then(([nextCategories, nextProducts]) => {
        setCategoryOptions(nextCategories)
        if (editing) {
          const found = nextProducts.find((item) => item.id === Number(id))
          if (found) setProduct(found)
        }
      })
      .catch((error) => toast.error(error.message))
  }, [editing, id])

  const update = (key, value) => setProduct((current) => ({ ...current, [key]: value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveProduct({ ...product, slug: product.slug || slugify(product.name) }, files)
      toast.success('Produit enregistré avec succès dans FOOD PACK.')
      navigate('/admin/produits')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const previewFile = files[0]
  const preview = previewFile ? URL.createObjectURL(previewFile) : product.media?.[0]?.url || product.images?.[0]
  const previewIsVideo = previewFile ? previewFile.type.startsWith('video/') : product.media?.[0]?.type === 'video'

  return (
    <>
      <Title
        subtitle={editing ? `Modification de « ${product.name} »` : 'Ajoutez un nouveau format d’emballage au catalogue.'}
      >
        {editing ? 'Modifier le produit' : 'Nouveau produit'}
      </Title>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main Details */}
        <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Nom de l'emballage / Référence
              <input
                required
                value={product.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Ex. Bouteille PET Cristal 330ml avec bouchon noir"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-black focus:ring-2 focus:ring-black/5"
              />
            </label>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Identifiant URL (slug)
              <input
                value={product.slug}
                onChange={(e) => update('slug', slugify(e.target.value))}
                placeholder={slugify(product.name) || 'bouteille-pet-cristal-330ml'}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-black focus:bg-white"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Catégorie
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
                Prix unitaire (FCFA)
                <input
                  required
                  min="0"
                  type="number"
                  value={product.price}
                  onChange={(e) => update('price', e.target.value)}
                  placeholder="Ex. 180"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-black"
                />
              </label>
            </div>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              État du stock
              <select
                required
                value={product.stockStatus}
                onChange={(e) => update('stockStatus', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-black"
              >
                <option value="Disponible">Disponible immédiatement</option>
                <option value="Sur commande">Sur commande / Gros volumes</option>
                <option value="Indisponible">Rupture temporaire</option>
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Contenances / Capacités
                <input
                  value={product.colors?.join(', ') || ''}
                  onChange={(e) => update('colors', e.target.value.split(',').map(normalizeColorEntry))}
                  placeholder="250ml, 330ml, 500ml, 1L"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
                />
                <span className="mt-1 block text-[10px] text-slate-400">Séparées par des virgules</span>
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Formats / Conditionnements
                <input
                  value={product.sizes?.join(', ') || ''}
                  onChange={(e) => update('sizes', e.target.value.split(',').map(normalizeSizeEntry))}
                  placeholder="Lot de 50, Carton de 500"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
                />
                <span className="mt-1 block text-[10px] text-slate-400">Séparés par des virgules</span>
              </label>
            </div>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Description courte
              <textarea
                rows="2"
                value={product.shortDescription || ''}
                onChange={(e) => update('shortDescription', e.target.value)}
                placeholder="Description rapide affichée sur la boutique…"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
              />
            </label>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Description détaillée et caractéristiques
              <textarea
                rows="5"
                value={product.description || ''}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Normes alimentaires, étanchéité, conseils d'utilisation…"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-xs text-slate-900 outline-none focus:border-black"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Délai d'expédition
                <input
                  value={product.productionTime || ''}
                  onChange={(e) => update('productionTime', e.target.value)}
                  placeholder="Ex. Expédition sous 24h à 48h"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Matériaux
                <input
                  value={product.materials || ''}
                  onChange={(e) => update('materials', e.target.value)}
                  placeholder="Ex. Plastique PET alimentaire cristal"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
                />
              </label>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-black py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? 'Enregistrement en cours…' : 'Enregistrer le produit'}
            </button>
          </div>
        </div>

        {/* Media & Settings Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h2 className="font-display text-base font-bold text-slate-900">Photos & Médias</h2>
            <label className="mt-3 grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center transition hover:border-black hover:bg-slate-100/60">
              {preview ? (
                previewIsVideo ? (
                  <video src={preview} muted controls playsInline className="h-full w-full bg-black object-contain" />
                ) : (
                  <img src={preview} alt="" className="h-full w-full object-cover" />
                )
              ) : (
                <div className="p-4">
                  <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-slate-200 text-slate-700">
                    <Plus className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-700">Ajouter des photos</p>
                  <p className="mt-1 text-[10px] text-slate-400">JPG, PNG, WebP</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*,video/mp4,video/webm,video/quicktime"
                multiple
                onChange={(e) => setFiles([...e.target.files])}
                className="sr-only"
              />
            </label>
            <p className="mt-2 text-[10px] text-slate-400">
              {files.length ? `${files.length} nouveau(x) fichier(s) sélectionné(s)` : 'Visuel HD recommandé'}
            </p>

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
                checked={product.customizable}
                onChange={(e) => update('customizable', e.target.checked)}
                className="h-4 w-4 rounded accent-black"
              />
              Option logo / personnalisation
            </label>
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={product.featured}
                onChange={(e) => update('featured', e.target.checked)}
                className="h-4 w-4 rounded accent-black"
              />
              Mise en avant sur l'accueil
            </label>
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={product.newProduct}
                onChange={(e) => update('newProduct', e.target.checked)}
                className="h-4 w-4 rounded accent-black"
              />
              Marquer comme Nouveauté
            </label>
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={product.isPublished}
                onChange={(e) => update('isPublished', e.target.checked)}
                className="h-4 w-4 rounded accent-black"
              />
              Publier sur la boutique en ligne
            </label>
          </div>
        </aside>
      </form>
    </>
  )
}

export function CategoriesAdmin() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', slug: '', description: '', isActive: true })
  const [saving, setSaving] = useState(false)

  const load = () =>
    getCategories({ includeInactive: true })
      .then(setItems)
      .catch((error) => toast.error(error.message))

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveCategory({ ...form, slug: form.slug || slugify(form.name), image: null })
      toast.success('Catégorie enregistrée.')
      setForm({ name: '', slug: '', description: '', isActive: true })
      load()
    } catch (error) {
      toast.error(error.message)
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
      toast.error(error.message)
    }
  }

  return (
    <>
      <Title subtitle="Organisez votre catalogue d'emballages par types d'usages.">
        Catégories de produits
      </Title>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 h-fit">
          <h2 className="font-display text-base font-bold text-slate-900">Ajouter une catégorie</h2>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Nom de la catégorie
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
            {saving ? 'Enregistrement…' : 'Ajouter la catégorie'}
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
              <button
                onClick={() => remove(item)}
                className="grid h-8 w-8 place-items-center rounded-lg text-rose-500 hover:bg-rose-50"
                aria-label={`Supprimer ${item.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
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
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    getAdminOrders()
      .then(setRows)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = rows.filter((r) => statusFilter === 'all' || r.status === statusFilter)

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
      .catch((error) => toast.error(error.message))
  }, [id])

  const changeStatus = async (status) => {
    try {
      const updated = await updateOrderStatus(id, status)
      setOrder((current) => ({ ...current, ...updated }))
      toast.success('Statut de la commande mis à jour.')
    } catch (error) {
      toast.error(error.message)
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
                    {item.size ? ` · Format ${item.size}` : ''}
                    {item.color ? ` · ${item.color}` : ''}
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

          <div className="flex justify-between items-center text-base font-black text-slate-900 pt-2">
            <span>Montant total</span>
            <span className="text-xl">{formatCurrency(order?.total || 0)}</span>
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
      .catch((error) => toast.error(error.message))

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveGalleryItem(form, file)
      toast.success(form.id ? 'Réalisation modifiée.' : 'Réalisation ajoutée.')
      setForm(empty)
      setFile(null)
      load()
    } catch (error) {
      toast.error(error.message)
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
      toast.error(error.message)
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
            Titre
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
            Photo ou vidéo
            <input
              required={!form.image}
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
      .catch((error) => toast.error(error.message))

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveTestimonial(form)
      toast.success(form.id ? 'Avis modifié.' : 'Avis ajouté.')
      setForm(empty)
      load()
    } catch (error) {
      toast.error(error.message)
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
      toast.error(error.message)
    }
  }

  return (
    <>
      <Title subtitle="Gérez les avis et témoignages des restaurateurs et traiteurs partenaires.">
        Avis & Témoignages
      </Title>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 h-fit">
          <h2 className="font-display text-base font-bold text-slate-900">{form.id ? 'Modifier l’avis' : 'Nouveau témoignage'}</h2>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Nom du client / Établissement
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
            Témoignage
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
      .catch((error) => toast.error(error.message))
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
      toast.error(error.message)
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

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 sm:col-span-2">
            Frais de livraison standard (FCFA)
            <input
              type="number"
              min="0"
              value={form.delivery_fee || 0}
              onChange={(e) => setForm({ ...form, delivery_fee: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
            />
          </label>
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
      .catch((error) => toast.error(error.message))
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
        if (password.length < 8) throw new Error('Le mot de passe doit contenir au moins 8 caractères.')
        if (password !== confirmation) throw new Error('Les mots de passe ne correspondent pas.')
        await updateAdminPassword(password)
        setPassword('')
        setConfirmation('')
        toast.success('Mot de passe mis à jour.')
      }
      setProfile({ ...nextProfile, email: profile.email })
      toast.success('Profil administrateur mis à jour.')
    } catch (error) {
      toast.error(error.message)
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
                minLength="8"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 caractères minimum"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-black"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Confirmer le mot de passe
              <input
                type="password"
                minLength="8"
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

export function SimpleAdminPage({ title, type }) {
  if (type === 'gallery') return <GalleryAdmin />
  if (type === 'testimonials') return <TestimonialsAdmin />
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
    if (error) return toast.error(error.message)
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
    if (password.length < 8) return toast.error('Le mot de passe doit contenir au moins 8 caractères.')
    if (password !== confirmation) return toast.error('Les mots de passe ne correspondent pas.')
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSaving(false)
    if (error) return toast.error(error.message)
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
              minLength="8"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-black"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Confirmer le mot de passe
            <input
              required
              minLength="8"
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
      .catch((error) => toast.error(error.message))
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
