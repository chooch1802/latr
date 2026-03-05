const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  completed: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

export default function RedemptionStatusBadge({ status }) {
  const style = statusStyles[status] || statusStyles.pending
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${style}`}>
      {status}
    </span>
  )
}
