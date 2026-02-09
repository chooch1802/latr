const statusConfig = {
  draft: { label: 'Draft', bg: 'bg-gray-100', text: 'text-gray-600' },
  submitted: { label: 'Submitted', bg: 'bg-blue-100', text: 'text-blue-700' },
  under_review: { label: 'Under Review', bg: 'bg-amber-100', text: 'text-amber-700' },
  approved: { label: 'Approved', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  declined: { label: 'Declined', bg: 'bg-red-100', text: 'text-red-700' },
  cancelled: { label: 'Cancelled', bg: 'bg-gray-100', text: 'text-gray-500' },
}

export default function ApplicationStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.draft
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
