const statusConfig = {
  draft: { label: 'Draft', bg: 'bg-gray-100', text: 'text-gray-600' },
  pending_assessment: { label: 'Pending Assessment', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  approved: { label: 'Approved', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  active: { label: 'Active', bg: 'bg-blue-100', text: 'text-blue-700' },
  completed: { label: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  declined: { label: 'Declined', bg: 'bg-red-100', text: 'text-red-700' },
  cancelled: { label: 'Cancelled', bg: 'bg-gray-100', text: 'text-gray-600' },
}

export default function DepositStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.draft
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
