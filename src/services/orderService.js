import { isSupabaseConfigured, supabase } from '../lib/supabase'

export async function createOrder(form, items) {
  if (!isSupabaseConfigured || !supabase) return null

  // 1. Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
  const discountAmount = Number(form.discount_amount) || 0
  const deliveryFee = Number(form.delivery_fee) || 2000
  const total = Math.max(0, subtotal - discountAmount + deliveryFee)

  try {
    // Direct insert into orders table
    const orderPayload = {
      customer_name: form.name,
      phone: form.phone,
      city: form.city || 'Cotonou',
      address: form.address,
      delivery_method: form.delivery,
      customer_comment: form.comment || null,
      promo_code: form.promo_code || null,
      discount_amount: discountAmount,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      status: 'new',
      whatsapp_sent: true,
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderPayload])
      .select()
      .single()

    if (orderError) throw orderError

    // Insert order items
    if (order && items.length > 0) {
      const itemsPayload = items.map((item) => ({
        order_id: order.id,
        product_id: typeof item.id === 'number' ? item.id : null,
        product_name: item.name || 'Emballage FOOD PACK',
        product_slug: item.slug || null,
        image_url: item.image || item.images?.[0] || null,
        unit_price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        format: item.format || item.size || null,
        capacity: item.capacity || item.color || null,
        note: item.note || null,
      }))

      await supabase.from('order_items').insert(itemsPayload)
    }

    return order
  } catch (err) {
    console.warn('Order direct insert note:', err.message)
    return {
      total,
      subtotal,
      discount_amount: discountAmount,
      delivery_fee: deliveryFee,
    }
  }
}

