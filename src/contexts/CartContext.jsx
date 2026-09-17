import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { siteConfig } from '../config/siteConfig'
import { useCatalog } from './CatalogContext'
import { checkPromoCode } from '../services/catalogService'

const CartContext = createContext(null)
const keyFor = (product, options = {}) => [product.id, options.format || '', options.capacity || '', options.note || ''].join('|')

export function CartProvider({ children }) {
  const { settings, products } = useCatalog()
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodpack-cart')) || []
    } catch {
      return []
    }
  })

  const [promo, setPromo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodpack-promo')) || null
    } catch {
      return null
    }
  })

  useEffect(() => {
    localStorage.setItem('foodpack-cart', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (promo) localStorage.setItem('foodpack-promo', JSON.stringify(promo))
    else localStorage.removeItem('foodpack-promo')
  }, [promo])

  useEffect(() => {
    if (!products.length) return
    setItems((current) => current.map((item) => {
      const fresh = products.find((p) => p.id === item.id)
      return fresh ? { ...item, images: fresh.images, media: fresh.media } : item
    }))
  }, [products])

  const addItem = (product, options = {}) => {
    const lineKey = keyFor(product, options)
    setItems((current) => {
      const exists = current.find((item) => item.lineKey === lineKey)
      if (exists) {
        return current.map((item) =>
          item.lineKey === lineKey ? { ...item, quantity: item.quantity + (options.quantity || 1) } : item
        )
      }
      return [...current, { ...product, ...options, lineKey, quantity: options.quantity || 1 }]
    })
    toast.success(`${product.name} ajouté au panier !`)
  }

  const updateQuantity = (lineKey, quantity) => {
    setItems((current) =>
      current.map((item) =>
        item.lineKey === lineKey ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const removeItem = (lineKey) => {
    setItems((current) => current.filter((item) => item.lineKey !== lineKey))
    toast.success('Article retiré du panier.')
  }

  const clearCart = () => {
    setItems([])
    setPromo(null)
  }

  const applyPromo = async (code) => {
    const normalized = String(code || '').trim().toUpperCase()
    if (!normalized) return false

    // Local fallback support for demo codes
    if (normalized === 'BIENVENUE10' || normalized === 'PROMO10') {
      setPromo({ code: normalized, discountPercent: 10 })
      toast.success('Code promo de 10% appliqué !')
      return true
    }
    if (normalized === 'PACKPRO20' || normalized === 'PROMO20') {
      setPromo({ code: normalized, discountPercent: 20 })
      toast.success('Code promo de 20% appliqué !')
      return true
    }

    try {
      const result = await checkPromoCode(normalized)
      if (result) {
        setPromo(result)
        toast.success(`Code promo de ${result.discountPercent}% appliqué !`)
        return true
      }
    } catch {
      // Ignored
    }

    toast.error('Code promo invalide ou expiré.')
    return false
  }

  const removePromo = () => {
    setPromo(null)
    toast.success('Code promo retiré.')
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = promo ? Math.round((subtotal * promo.discountPercent) / 100) : 0
  const deliveryFee = items.length ? Number(settings?.delivery_fee ?? siteConfig.deliveryFee) : 0
  const total = Math.max(0, subtotal - discountAmount + deliveryFee)

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount,
      subtotal,
      promo,
      applyPromo,
      removePromo,
      discountAmount,
      deliveryFee,
      total,
    }),
    [items, itemCount, subtotal, promo, discountAmount, deliveryFee, total]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
