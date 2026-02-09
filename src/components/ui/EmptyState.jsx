import { Link } from 'react-router-dom'

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
      {Icon && (
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-7 h-7 text-gray-400" />
        </div>
      )}
      <h2 className="text-lg font-semibold text-navy mb-1">{title}</h2>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-2 h-10 px-5 bg-coral-500 text-white text-sm font-semibold rounded-xl transition-colors hover:bg-coral-600"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
