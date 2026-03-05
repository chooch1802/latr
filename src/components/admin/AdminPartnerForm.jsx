import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const categories = ['dining', 'fitness', 'retail', 'entertainment', 'services', 'health']

export default function AdminPartnerForm({ partner, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: partner?.name || '',
    category: partner?.category || 'dining',
    subcategory: partner?.subcategory || '',
    description: partner?.description || '',
    address: partner?.address || '',
    suburb: partner?.suburb || '',
    state: partner?.state || 'NSW',
    postcode: partner?.postcode || '',
    phone: partner?.phone || '',
    website: partner?.website || '',
    bonus_points: partner?.bonus_points || 0,
    bonus_description: partner?.bonus_description || '',
    rating: partner?.rating || 4.0,
    price_level: partner?.price_level || 2,
    is_featured: partner?.is_featured || false,
  })
  const [submitting, setSubmitting] = useState(false)

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(form)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="font-semibold text-navy">{partner ? 'Edit Partner' : 'Add Partner'}</h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select value={form.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm capitalize">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
        <input type="text" value={form.subcategory} onChange={(e) => handleChange('subcategory', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input type="text" value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Suburb</label>
          <input type="text" value={form.suburb} onChange={(e) => handleChange('suburb', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
          <input type="text" value={form.postcode} onChange={(e) => handleChange('postcode', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Points</label>
          <input type="number" value={form.bonus_points} onChange={(e) => handleChange('bonus_points', Number(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Description</label>
          <input type="text" value={form.bonus_description} onChange={(e) => handleChange('bonus_description', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="featured" checked={form.is_featured} onChange={(e) => handleChange('is_featured', e.target.checked)} className="rounded" />
        <label htmlFor="featured" className="text-sm text-gray-700">Featured partner</label>
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className="h-10 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer">
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting} className="h-10 px-6 bg-coral-500 text-white font-semibold rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2">
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : partner ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
