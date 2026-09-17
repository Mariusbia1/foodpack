import { siteConfig } from '../config/siteConfig'
import { formatCurrency } from '../utils/formatCurrency'

export function createWhatsAppMessage(customer, items, total, discount = 0, promoCode = '', shopName = siteConfig.name) {
  const articles = items.map((item, i) => {
    const details = []
    if (item.format) details.push(`Conditionnement : ${item.format}`)
    if (item.capacity) details.push(`Contenance : ${item.capacity}`)
    if (item.note) details.push(`Note : ${item.note}`)
    
    return `${i + 1}. *${item.name}*
Quantité : ${item.quantity}
${details.join('\n')}
Prix unitaire : ${formatCurrency(item.price)}
Sous-total : ${formatCurrency(item.price * item.quantity)}`
  }).join('\n\n')

  let discountText = ''
  if (discount > 0) {
    discountText = `\nRemise (${promoCode || 'Code Promo'}) : -${formatCurrency(discount)}`
  }

  return `Bonjour *${shopName}*,

Je souhaite passer une commande d’emballages.

👤 *Informations client :*
• Nom : ${customer.name}
• Téléphone : ${customer.phone}
• Ville : ${customer.city}
• Quartier / Adresse : ${customer.address}
• Mode de livraison : ${customer.delivery}

📦 *Articles commandés :*

${articles}
${discountText}
💰 *Total de la commande : ${formatCurrency(total)}*

📝 *Commentaire / Précisions :*
${customer.comment || 'Aucun commentaire'}

Merci de me confirmer la disponibilité et l’heure de livraison.`
}

export const whatsappUrl = (message, whatsapp = siteConfig.whatsapp) =>
  `https://wa.me/${String(whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
