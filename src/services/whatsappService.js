import { siteConfig } from '../config/siteConfig'
import { formatCurrency } from '../utils/formatCurrency'

export function createWhatsAppMessage(
  customer,
  items,
  total,
  discount = 0,
  promoCode = '',
  shopName = siteConfig.name,
  deliveryFee = 0,
  subtotal = 0
) {
  const articles = items.map((item, i) => {
    const details = []
    if (item.format) details.push(`Conditionnement : ${item.format}`)
    if (item.capacity) details.push(`Contenance : ${item.capacity}`)
    if (item.note) details.push(`Note : ${item.note}`)
    
    return `${i + 1}. *${item.name}*
Quantité : ${item.quantity}
${details.length ? details.join('\n') + '\n' : ''}Prix unitaire : ${formatCurrency(item.price)}
Sous-total : ${formatCurrency(item.price * item.quantity)}`
  }).join('\n\n')

  let discountText = ''
  if (discount > 0) {
    discountText = `\nRemise (${promoCode || 'Code Promo'}) : -${formatCurrency(discount)}`
  }

  const numericDelivery = Number(deliveryFee) || 0
  const deliveryText = numericDelivery > 0
    ? `Frais de livraison : ${formatCurrency(numericDelivery)}`
    : `Livraison : À régler directement avec le livreur à la réception`

  const calcSubtotal = subtotal > 0 ? subtotal : items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0)

  return `Bonjour *${shopName}*,

Je souhaite passer une commande d’emballages.

*INFORMATIONS CLIENT :*
- Nom : ${customer.name}
- Téléphone : ${customer.phone}
- Ville : ${customer.city}
- Quartier / Adresse : ${customer.address}
- Option livraison : ${customer.delivery}

*ARTICLES COMMANDÉS :*

${articles}

----------------------------------------
Sous-total articles : ${formatCurrency(calcSubtotal)}${discountText}
${deliveryText}
*TOTAL DE LA COMMANDE : ${formatCurrency(total)}* ${numericDelivery === 0 ? '(hors livraison)' : ''}
----------------------------------------

*COMMENTAIRE / PRÉCISIONS :*
${customer.comment || 'Aucun commentaire'}

Merci de me confirmer la disponibilité et l’heure de livraison.`
}

export const whatsappUrl = (message, whatsapp = siteConfig.whatsapp) =>
  `https://wa.me/${String(whatsapp || '2290100000000').replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
