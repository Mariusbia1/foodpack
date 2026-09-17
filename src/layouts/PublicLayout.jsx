import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export default function PublicLayout() {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const hideFooterOnCheckout = pathname === '/commande'

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooterOnCheckout && <Footer />}
    </div>
  )
}
