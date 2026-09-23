import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Shapes, ShoppingCart, Images, Quote,
  FileText, Settings, User, LogOut, Search, Bell, Menu, X, ChevronRight, ExternalLink, ShieldCheck, Plus, Sparkles,
  Users, UserCheck, Shield
} from 'lucide-react'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import InstallAppButton from '../components/common/InstallAppButton'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../services/notificationService'

const nav = [
  ['/admin', LayoutDashboard, 'Tableau de bord'],
  ['/admin/produits', Package, 'Produits'],
  ['/admin/categories', Shapes, 'Catégories'],
  ['/admin/commandes', ShoppingCart, 'Commandes'],
  ['/admin/galerie', Images, 'Galerie & Réalisations'],
  ['/admin/temoignages', Quote, 'Avis & Témoignages'],
  ['/admin/contenus', FileText, 'Textes & Contenus'],
  ['/admin/parametres', Settings, 'Paramètres de la boutique'],
  ['/admin/equipe', Users, 'Équipe & Administrateurs'],
  ['/admin/activite', ShieldCheck, 'Journal de sécurité'],
  ['/admin/profil', User, 'Mon Compte'],
]

function SidebarContent({ onNavigate }) {
  const { logout, profile, isSuperAdmin } = useAdminAuth()
  const navigate = useNavigate()

  const signOut = () => {
    logout()
    navigate('/admin/connexion')
  }

  return (
    <div className="flex h-full flex-col justify-between bg-[#0F172A] text-slate-200">
      <div>
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800/80 px-6">
          <Link to="/admin" onClick={onNavigate} className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-slate-700 font-display text-sm font-black text-white shadow-sm">
              FP
            </span>
            <div>
              <p className="font-display text-lg font-black uppercase tracking-tight text-white">
                FOOD PACK<span className="text-[#FF3333]">.</span>
              </p>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Administration</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="px-3.5 py-6">
          <div className="mb-2.5 px-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Menu Principal</p>
          </div>
          <nav className="grid gap-1">
            {nav.map(([to, Icon, label]) => (
              <NavLink
                end={to === '/admin'}
                key={to}
                to={to}
                onClick={onNavigate}
                className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition duration-150 ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                {({ isActive }) => (
                  <>
                    <span className={`grid h-7 w-7 place-items-center rounded-lg transition ${
                      isActive ? 'bg-slate-100 text-slate-950' : 'bg-slate-800/70 text-slate-400 group-hover:bg-slate-800 group-hover:text-white'
                    }`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex-1">{label}</span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#FF3333]" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-slate-800/80 p-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="mb-3 flex w-full items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-800/50 px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white"
        >
          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          <span>Voir le site</span>
        </Link>

        <div className="flex items-center justify-between rounded-xl bg-slate-800/60 p-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold text-white shadow-xs ${
              isSuperAdmin ? 'bg-gradient-to-tr from-amber-600 to-amber-500' : 'bg-gradient-to-tr from-slate-700 to-slate-600'
            }`}>
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : (isSuperAdmin ? 'S' : 'A')}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">{profile?.full_name || 'Admin FOOD PACK'}</p>
              <p className="truncate text-[10px]">
                {isSuperAdmin ? (
                  <span className="font-semibold text-amber-300">Super Admin</span>
                ) : (
                  <span className="text-slate-400">Administrateur</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={signOut}
            title="Se déconnecter"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-400"
            aria-label="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState(() => 'Notification' in window ? Notification.permission : 'unsupported')
  const notificationPanel = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const current = nav.find(([to]) => to === pathname)?.[2] || 'Administration'

  useEffect(() => {
    if (!supabase) return undefined
    getNotifications().then(setNotifications).catch(() => {})
    const channel = supabase.channel('admin-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admin_notifications' }, ({ new: notification }) => {
        setNotifications((current) => [notification, ...current].slice(0, 20))
        toast.success(notification.title, { duration: 7000 })
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, { body: notification.message, icon: '/app-icon-192.png' })
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    const close = (event) => {
      if (notificationPanel.current && !notificationPanel.current.contains(event.target)) setNotificationsOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const unreadCount = notifications.filter((item) => !item.read_at).length
  const openNotification = async (notification) => {
    if (!notification.read_at) {
      const readAt = new Date().toISOString()
      setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, read_at: readAt } : item))
      try { await markNotificationRead(notification.id) } catch { toast.error('Impossible de marquer la notification comme lue.') }
    }
    setNotificationsOpen(false)
    if (notification.target_path) navigate(notification.target_path)
  }

  const markAllRead = async () => {
    const readAt = new Date().toISOString()
    setNotifications((current) => current.map((item) => ({ ...item, read_at: item.read_at || readAt })))
    try { await markAllNotificationsRead() } catch { toast.error('Impossible de mettre les notifications à jour.') }
  }

  const enableBrowserNotifications = async () => {
    if (!('Notification' in window)) return
    const permission = await Notification.requestPermission()
    setNotificationPermission(permission)
    if (permission === 'granted') toast.success('Notifications du navigateur activées.')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased">
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-800/60 bg-[#0F172A] shadow-xl lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
          />
          <aside className="relative flex h-full w-72 flex-col bg-[#0F172A] shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="min-h-screen min-w-0 overflow-x-hidden lg:pl-64">
        {/* Sticky Modern Topbar */}
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200/90 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FOOD PACK</span>
                <span className="text-slate-300">/</span>
                <h1 className="font-display text-base font-extrabold text-slate-900 sm:text-lg">{current}</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="hidden h-9 min-w-56 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-black/5 md:flex">
              <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <input
                placeholder="Rechercher..."
                className="w-full bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
              />
              <span className="rounded bg-slate-200/70 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">⌘K</span>
            </div>

            <InstallAppButton compact manifestHref="/admin-manifest.webmanifest" label="Installer App" />

            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationPanel}>
              <button
                onClick={() => setNotificationsOpen((open) => !open)}
                className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs transition hover:bg-slate-50"
                aria-label={`${unreadCount} notifications`}
                aria-expanded={notificationsOpen}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#FF3333] px-1 text-[9px] font-black text-white shadow-sm animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Notifications</p>
                      <p className="text-[10px] text-slate-500">
                        {unreadCount ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est à jour'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[10px] font-bold text-slate-600 hover:text-black">
                        Tout marquer lu
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => openNotification(notification)}
                        className={`block w-full p-3 text-left transition hover:bg-slate-50 ${
                          notification.read_at ? 'opacity-60 bg-white' : 'bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.read_at ? 'bg-slate-300' : 'bg-[#FF3333]'}`} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900">{notification.title}</p>
                            <p className="mt-0.5 text-xs text-slate-600 leading-snug">{notification.message}</p>
                            <span className="mt-1 block text-[9px] text-slate-400">
                              {new Date(notification.created_at).toLocaleString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                    {!notifications.length && (
                      <p className="p-6 text-center text-xs text-slate-400">Aucune notification.</p>
                    )}
                  </div>

                  {notificationPermission === 'default' && (
                    <button
                      onClick={enableBrowserNotifications}
                      className="w-full border-t border-slate-100 bg-slate-50 p-2.5 text-center text-[11px] font-bold text-slate-700 hover:text-black"
                    >
                      Activer les alertes navigateur
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Profile Avatar Chip */}
            <Link
              to="/admin/profil"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 pr-2.5 shadow-2xs transition hover:bg-slate-50"
            >
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-black text-[11px] font-black text-white">
                FP
              </div>
              <span className="hidden text-xs font-bold text-slate-800 sm:inline">Admin</span>
            </Link>
          </div>
        </header>

        {/* Page Main Content Area */}
        <main className="min-w-0 max-w-full p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
