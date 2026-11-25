/**
 * Formats Benin phone numbers cleanly with spaces:
 * +2290165299158 -> +229 01 65 29 91 58
 * +22965299158   -> +229 65 29 91 58
 * 0165299158     -> 01 65 29 91 58
 */
export function formatPhone(phone) {
  if (!phone) return ''
  const str = String(phone).trim()
  const digits = str.replace(/\D/g, '')

  // +229 with 10 local digits (current Benin standard with 01 prefix)
  if (digits.startsWith('229') && digits.length === 13) {
    return `+229 ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)} ${digits.slice(11, 13)}`
  }

  // +229 with 8 local digits (former standard)
  if (digits.startsWith('229') && digits.length === 11) {
    return `+229 ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`
  }

  // Local 10 digits starting with 01
  if (digits.length === 10 && digits.startsWith('01')) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`
  }

  // Local 8 digits
  if (digits.length === 8) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)}`
  }

  return str
}
