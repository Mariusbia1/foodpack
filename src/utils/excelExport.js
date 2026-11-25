function escapeCsvCell(value) {
  const str = String(value ?? '').replace(/\r?\n/g, ' ')
  if (str.includes(';') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportAnalyticsToExcel({ traffic, orders = [], periodLabel = '30 derniers jours' }) {
  const rows = []
  const pushRow = (...cells) => rows.push(cells.map(escapeCsvCell).join(';'))

  pushRow('FOODPACK by Maurelle - Rapport Statistiques & Evolution')
  pushRow('Periode', periodLabel)
  pushRow('Date export', new Date().toLocaleString('fr-FR'))
  pushRow('')

  // 1. Resume global
  pushRow('=== RESUME GLOBAL ===')
  pushRow('Indicateur', 'Valeur')
  pushRow('Visiteurs uniques', traffic?.visitors || 0)
  pushRow('Pages vues', traffic?.total || 0)
  pushRow('Actions clients', traffic?.actionsTotal || 0)
  pushRow("Activite aujourd'hui", traffic?.today || 0)
  pushRow('Nombre de commandes', orders.length)
  const revenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
  pushRow('Chiffre d affaires total (FCFA)', revenue)
  pushRow('')

  // 2. Evolution par jour
  pushRow('=== EVOLUTION PAR JOUR ===')
  pushRow('Date', 'Visiteurs uniques', 'Pages vues', 'Actions clients', 'Total activite')
  const daily = Array.isArray(traffic?.daily) ? traffic.daily : []
  daily.forEach((d) => {
    pushRow(
      d.date ? new Date(d.date).toLocaleDateString('fr-FR') : 'Inconnu',
      d.visitors || 0,
      d.views || 0,
      d.actions || 0,
      d.count || 0
    )
  })
  pushRow('')

  // 3. Journal des visiteurs et actions
  pushRow('=== DETAIL DES VISITEURS & ACTIONS ===')
  pushRow('Date & Heure', 'Visiteur', 'Action', 'Detail / Page', 'Appareil')
  const actionLabels = {
    page_view: 'Visite page',
    add_to_cart: 'Ajout panier',
    place_order: 'Commande',
    whatsapp_click: 'Clic WhatsApp',
    share_product: 'Partage produit',
    contact_submit: 'Demande devis',
  }
  const events = Array.isArray(traffic?.recentEvents) ? traffic.recentEvents : []
  events.forEach((ev) => {
    pushRow(
      ev.createdAt ? new Date(ev.createdAt).toLocaleString('fr-FR') : '',
      ev.visitorId || '',
      actionLabels[ev.action] || ev.action || '',
      ev.label || ev.path || '',
      ev.device || ''
    )
  })

  // UTF-8 BOM for clean French characters in Microsoft Excel
  const csvContent = '\uFEFF' + rows.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const dateStamp = new Date().toISOString().split('T')[0]
  link.href = url
  link.setAttribute('download', `foodpack-statistiques-${dateStamp}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
