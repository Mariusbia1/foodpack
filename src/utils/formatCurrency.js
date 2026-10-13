export const formatCurrency = (amount) => {
  const num = Number(amount) || 0
  return new Intl.NumberFormat('fr-FR').format(num).replace(/\s/g, '\u00A0') + '\u00A0FCFA'
}
