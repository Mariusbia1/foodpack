import { createContext, useContext, useEffect, useState } from 'react'
import { products as fallbackProducts } from '../data/products'
import { categories as fallbackCategories } from '../data/categories'
import { gallery as fallbackGallery } from '../data/gallery'
import { testimonials as fallbackTestimonials } from '../data/testimonials'
import { siteConfig } from '../config/siteConfig'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  getCategories,
  getGallery,
  getProducts,
  getSiteContent,
  getSiteSettings,
  getTestimonials,
} from '../services/catalogService'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(fallbackProducts)
  const [categories, setCategories] = useState(fallbackCategories)
  const [gallery, setGallery] = useState(fallbackGallery)
  const [testimonials, setTestimonials] = useState(fallbackTestimonials)
  const [settings, setSettings] = useState({
    shop_name: siteConfig.name,
    full_name: siteConfig.fullName,
    whatsapp: siteConfig.whatsapp,
    phone: siteConfig.phone,
    email: siteConfig.email,
    address: siteConfig.address,
    instagram: siteConfig.instagram,
    facebook: siteConfig.facebook,
    tiktok: siteConfig.tiktok,
    delivery_fee: siteConfig.deliveryFee,
    banner_text: 'Inscrivez-vous et profitez de tarifs professionnels dégressifs !',
  })
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    try {
      const results = await Promise.allSettled([
        getProducts(),
        getCategories(),
        getGallery(),
        getTestimonials(),
        getSiteSettings(),
        getSiteContent(),
      ])

      const [
        productResult,
        categoryResult,
        galleryResult,
        testimonialResult,
        settingsResult,
        contentResult,
      ] = results

      if (productResult?.status === 'fulfilled' && productResult.value?.length > 0) {
        const isFoodPackaging = productResult.value.some((p) =>
          p.name?.toLowerCase().includes('bouteille') ||
          p.name?.toLowerCase().includes('kraft') ||
          p.name?.toLowerCase().includes('barquette') ||
          p.name?.toLowerCase().includes('bidon') ||
          p.name?.toLowerCase().includes('gobelet') ||
          p.categorySlug === 'jus-boissons' ||
          p.categorySlug === 'emballages-kraft'
        )

        if (isFoodPackaging) {
          const sanitized = productResult.value.map((p, idx) => {
            const fallback =
              fallbackProducts.find((fb) => fb.slug === p.slug) ||
              fallbackProducts[idx % fallbackProducts.length]
            return {
              ...p,
              images: p.images && p.images.length > 0 ? p.images : fallback.images,
            }
          })
          setProducts(sanitized)
        } else {
          setProducts(fallbackProducts)
        }
      }
      if (categoryResult?.status === 'fulfilled' && categoryResult.value?.length > 0) {
        setCategories(
          categoryResult.value.map((category) => ({
            ...category,
            image:
              category.image ||
              fallbackCategories.find((fb) => fb.slug === category.slug)?.image ||
              '/products/bouteille-pet.webp',
          }))
        )
      }
      if (galleryResult?.status === 'fulfilled' && galleryResult.value?.length > 0) {
        setGallery(galleryResult.value)
      }
      if (testimonialResult?.status === 'fulfilled' && testimonialResult.value?.length > 0) {
        setTestimonials(testimonialResult.value)
      }
      if (settingsResult?.status === 'fulfilled' && settingsResult.value?.shop_name) {
        setSettings(settingsResult.value)
      }
      if (contentResult?.status === 'fulfilled' && Object.keys(contentResult.value || {}).length > 0) {
        setContent(contentResult.value)
      }
    } catch (err) {
      console.error('Erreur chargement Supabase :', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    window.addEventListener('tk-catalog-changed', refresh)
    return () => window.removeEventListener('tk-catalog-changed', refresh)
  }, [])

  return (
    <CatalogContext.Provider value={{ products, categories, gallery, testimonials, settings, content, loading, refresh }}>
      {children}
    </CatalogContext.Provider>
  )
}

export const useCatalog = () => useContext(CatalogContext)
