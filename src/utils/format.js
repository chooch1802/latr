export function formatCurrency(amount, decimals = 2) {
  const num = Number(amount) || 0
  if (decimals === 0) {
    return `$${num.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }
  return `$${num.toFixed(decimals)}`
}

export function formatDate(dateStr, style = 'short') {
  if (!dateStr) return '—'
  const date = new Date(dateStr)

  if (style === 'short') {
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
  }
  if (style === 'long') {
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  if (style === 'relative') {
    const diff = Date.now() - date.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
  }
  return date.toLocaleDateString('en-AU')
}
