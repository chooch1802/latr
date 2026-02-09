const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  partially_paid: { label: 'Partial', bg: 'bg-blue-100', text: 'text-blue-700' },
  paid: { label: 'Paid', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  overdue: { label: 'Overdue', bg: 'bg-red-100', text: 'text-red-700' },
}

export default function BillStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
