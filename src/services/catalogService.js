import { supabase } from '../lib/supabase'

const notifyCatalogChanged = () => window.dispatchEvent(new Event('tk-catalog-changed'))

const mapProduct = (product) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  shortDescription: product.short_description,
  description: product.description,
  price: product.price,
  oldPrice: product.old_price,
  rating: Number(product.rating || 5.0),
  ratingCount: product.rating_count || 0,
  category: product.categories?.name || '',
  categorySlug: product.categories?.slug || '',
  categoryId: product.category_id,
  images: (product.product_images || [])
    .filter((media) => (media.media_type || 'image') === 'image')
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => image.url),
  media: (product.product_images || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((media) => ({ id: media.id, url: media.url, type: media.media_type || 'image', sortOrder: media.sort_order })),
  imageRecords: (product.product_images || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((media) => ({ id: media.id, url: media.url, type: media.media_type || 'image', sortOrder: media.sort_order })),
  formats: product.formats || [],
  capacities: product.capacities || [],
  materials: product.materials || '',
  colors: product.colors || [],
  sizes: product.sizes || [],
  stockStatus: product.stock_status || 'Disponible',
  featured: product.featured || false,
  newProduct: product.new_product || product.new_arrival || false,
  newArrival: product.new_arrival || product.new_product || false,
  topSelling: product.top_selling || product.popular || false,
  popular: product.popular || product.top_selling || false,
  customizable: product.customizable || false,
  isPublished: product.is_published,
  productionTime: product.production_time || 'Expédition sous 24 à 48 h',
  careInstructions: product.care_instructions || 'Conserver au sec.',
  deliveryInformation: product.delivery_information || 'Livraison à Cotonou et partout au Bénin.',
})

export async function getProducts({ includeDrafts = false } = {}) {
  let query = supabase
    .from('products')
    .select('*, categories(name, slug), product_images(id, url, alt_text, media_type, sort_order)')
    .order('created_at', { ascending: false })

  if (!includeDrafts) query = query.eq('is_published', true)
  const { data, error } = await query
  if (error) throw error
  return (data || []).map(mapProduct)
}

export async function getCategories({ includeInactive = false } = {}) {
  let query = supabase.from('categories').select('*').order('sort_order')
  if (!includeInactive) query = query.eq('is_active', true)
  const { data, error } = await query
  if (error) throw error
  return (data || []).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image_url,
    description: category.description,
    isActive: category.is_active,
  }))
}

export async function getReviews(productId = null) {
  let query = supabase.from('reviews').select('*').order('created_at', { ascending: false })
  if (productId) query = query.eq('product_id', productId)
  const { data, error } = await query
  if (error) throw error
  return (data || []).map((review) => ({
    id: review.id,
    productId: review.product_id,
    name: review.customer_name,
    rating: review.rating,
    comment: review.comment,
    verified: review.is_verified,
    createdAt: review.created_at,
  }))
}

export async function addReview({ productId, customerName, rating, comment }) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ product_id: productId, customer_name: customerName, rating, comment }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function checkPromoCode(code) {
  const normalized = String(code || '').trim().toUpperCase()
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', normalized)
    .eq('is_active', true)
    .single()
  if (error) return null
  return { code: data.code, discountPercent: data.discount_percent }
}

export async function subscribeNewsletter(email) {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert([{ email: String(email).trim().toLowerCase() }])
  if (error && error.code !== '23505') throw error
  return true
}

export async function getSiteSettings() {
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', true).maybeSingle()
  if (error) throw error
  return data || {}
}

export async function getSiteContent() {
  const { data, error } = await supabase.from('site_content').select('*')
  if (error) throw error
  return (data || []).reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {})
}

export async function getTestimonials() {
  const { data, error } = await supabase.from('testimonials').select('*').order('sort_order')
  if (error) throw error
  return (data || []).map((item) => ({
    id: item.id,
    name: item.customer_name,
    city: item.city,
    text: item.content,
    rating: 5,
    verified: true,
  }))
}

export async function getGallery() {
  const { data, error } = await supabase.from('gallery_items').select('*').order('sort_order')
  if (error) throw error
  return (data || []).map((item) => ({
    id: item.id,
    image: item.image_url,
    title: item.title,
    category: item.category,
  }))
}

export async function getAdminOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getAdminProfile(userId = null) {
  let targetId = userId
  if (!targetId && supabase) {
    const { data: { user } } = await supabase.auth.getUser()
    targetId = user?.id
  }
  if (!targetId || !supabase) return null
  const { data, error } = await supabase.from('profiles').select('*').eq('id', targetId).maybeSingle()
  if (error) throw error
  return data
}

export async function saveAdminProfile(payload, userId = null) {
  let targetId = userId
  if (!targetId && supabase) {
    const { data: { user } } = await supabase.auth.getUser()
    targetId = user?.id
  }
  if (!targetId || !supabase) throw new Error('Utilisateur non connecté.')
  const updateData = typeof payload === 'string' ? { full_name: payload } : payload
  const { data, error } = await supabase.from('profiles').update(updateData).eq('id', targetId).select().single()
  if (error) throw error
  return data
}

export async function updateAdminEmail(email) {
  const { error } = await supabase.auth.updateUser({ email })
  if (error) throw error
}

export async function updateAdminPassword(password) {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', orderId).select().single()
  if (error) throw error
  return data
}

export async function deleteProduct(productId) {
  const { error } = await supabase.from('products').delete().eq('id', productId)
  if (error) throw error
  notifyCatalogChanged()
}

export async function deleteProductImage(imageId) {
  const { error } = await supabase.from('product_images').delete().eq('id', imageId)
  if (error) throw error
  notifyCatalogChanged()
}

export async function reorderProductImages(records) {
  const updates = records.map((record, sort_order) =>
    supabase.from('product_images').update({ sort_order }).eq('id', record.id)
  )
  await Promise.all(updates)
  notifyCatalogChanged()
}

export async function deleteCategory(categoryId) {
  const { error } = await supabase.from('categories').delete().eq('id', categoryId)
  if (error) throw error
  notifyCatalogChanged()
}

export async function deleteGalleryItem(itemId) {
  const { error } = await supabase.from('gallery_items').delete().eq('id', itemId)
  if (error) throw error
  notifyCatalogChanged()
}

export async function deleteTestimonial(testimonialId) {
  const { error } = await supabase.from('testimonials').delete().eq('id', testimonialId)
  if (error) throw error
  notifyCatalogChanged()
}

export async function uploadCatalogImage(file) {
  const extension = file.name.split('.').pop()
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`
  const { error } = await supabase.storage.from('catalog').upload(filename, file)
  if (error) throw error
  const { data } = supabase.storage.from('catalog').getPublicUrl(filename)
  return data.publicUrl
}

export async function saveProduct(product, newFiles = []) {
  const payload = {
    category_id: product.categoryId ? Number(product.categoryId) : null,
    name: product.name,
    slug: product.slug,
    short_description: product.shortDescription,
    description: product.description,
    price: Number(product.price),
    old_price: product.oldPrice ? Number(product.oldPrice) : null,
    stock_status: product.stockStatus,
    featured: product.featured,
    new_product: product.newProduct ?? product.newArrival ?? false,
    new_arrival: product.newArrival ?? product.newProduct ?? false,
    popular: product.popular ?? product.topSelling ?? false,
    top_selling: product.topSelling ?? product.popular ?? false,
    customizable: product.customizable,
    production_time: product.productionTime,
    materials: product.materials,
    care_instructions: product.careInstructions,
    delivery_information: product.deliveryInformation,
    is_published: product.isPublished,
    formats: product.formats || [],
    capacities: product.capacities || [],
    colors: product.colors || [],
    sizes: product.sizes || [],
  }

  let productId = product.id
  if (productId) {
    const { error } = await supabase.from('products').update(payload).eq('id', productId)
    if (error) throw error
  } else {
    const { data, error } = await supabase.from('products').insert([payload]).select().single()
    if (error) throw error
    productId = data.id
  }

  if (newFiles.length > 0) {
    const currentMaxSort = (product.imageRecords || []).length
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i]
      const url = await uploadCatalogImage(file)
      await supabase.from('product_images').insert([
        {
          product_id: productId,
          url,
          media_type: file.type.startsWith('video/') ? 'video' : 'image',
          sort_order: currentMaxSort + i,
        },
      ])
    }
  }

  notifyCatalogChanged()
  return productId
}

export async function saveCategory(category) {
  const payload = {
    name: category.name,
    slug: category.slug,
    description: category.description,
    is_active: category.isActive,
    image_url: category.image || category.image_url,
  }

  if (category.id) {
    const { error } = await supabase.from('categories').update(payload).eq('id', category.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('categories').insert([payload])
    if (error) throw error
  }
  notifyCatalogChanged()
}

export async function saveGalleryItem(item, file = null) {
  let image_url = item.image || item.image_url
  if (file) image_url = await uploadCatalogImage(file)

  const payload = {
    title: item.title,
    category: item.category,
    image_url,
    sort_order: item.sortOrder || 0,
    is_published: item.isPublished ?? true,
  }

  if (item.id) {
    const { error } = await supabase.from('gallery_items').update(payload).eq('id', item.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('gallery_items').insert([payload])
    if (error) throw error
  }
  notifyCatalogChanged()
}

export async function saveTestimonial(testimonial) {
  const payload = {
    customer_name: testimonial.name || testimonial.customer_name,
    city: testimonial.city,
    content: testimonial.text || testimonial.content,
    sort_order: testimonial.sortOrder || 0,
    is_published: testimonial.isPublished ?? true,
  }

  if (testimonial.id) {
    const { error } = await supabase.from('testimonials').update(payload).eq('id', testimonial.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('testimonials').insert([payload])
    if (error) throw error
  }
  notifyCatalogChanged()
}

export async function saveSiteSettings(settings) {
  const { error } = await supabase.from('site_settings').upsert({ id: true, ...settings })
  if (error) throw error
  notifyCatalogChanged()
}

export async function saveSiteContent(key, value) {
  const { error } = await supabase.from('site_content').upsert({ key, value })
  if (error) throw error
  notifyCatalogChanged()
}

export async function getDashboardData() {
  const [products, orders, categories] = await Promise.all([
    getProducts({ includeDrafts: true }),
    getAdminOrders(),
    getCategories({ includeInactive: true }),
  ])

  const pendingOrders = orders.filter((o) => ['new', 'confirmed', 'in_progress'].includes(o.status))
  const completedOrders = orders.filter((o) => o.status !== 'cancelled')
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0)

  return {
    products,
    orders,
    categories,
    stats: {
      products: products.length,
      orders: orders.length,
      pending: pendingOrders.length,
      revenue: totalRevenue,
    },
  }
}

export async function getTrafficStats(days = 30) {
  try {
    if (!supabase) {
      return { total: 0, visitors: 0, today: 0, daily: [], topPages: [] }
    }
    const since = new Date()
    if (days) since.setDate(since.getDate() - days)

    const { data, error } = await supabase
      .from('traffic_logs')
      .select('id, path, created_at')
      .gte('created_at', days ? since.toISOString() : '2000-01-01')
      .order('created_at', { ascending: true })

    if (error || !data) {
      return { total: 0, visitors: 0, today: 0, daily: [], topPages: [] }
    }

    const todayStr = new Date().toISOString().split('T')[0]
    const todayCount = data.filter((d) => d.created_at?.startsWith(todayStr)).length

    const dailyMap = {}
    data.forEach((item) => {
      const d = item.created_at ? item.created_at.split('T')[0] : 'Inconnu'
      dailyMap[d] = (dailyMap[d] || 0) + 1
    })
    const daily = Object.entries(dailyMap).map(([date, count]) => ({ date, count }))

    const pageMap = {}
    data.forEach((item) => {
      const p = item.path || '/'
      pageMap[p] = (pageMap[p] || 0) + 1
    })
    const topPages = Object.entries(pageMap)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      total: data.length,
      visitors: Math.round(data.length * 0.7) || data.length,
      today: todayCount,
      daily,
      topPages,
    }
  } catch {
    return { total: 0, visitors: 0, today: 0, daily: [], topPages: [] }
  }
}

export async function getAuditLogs() {
  return []
}

export async function recordPageVisit(path) {
  try {
    if (supabase) {
      await supabase.from('traffic_logs').insert([{ path, user_agent: navigator?.userAgent }])
    }
  } catch {
    // Ignorer si la table n'existe pas
  }
}


