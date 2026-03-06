import { useState, useEffect } from 'react'
import { MapPin, Edit2, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminPartnerForm from '../../components/admin/AdminPartnerForm'

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  async function loadPartners() {
    const { data } = await supabase
      .from('neighbourhood_partners')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('name')
    setPartners(data || [])
    setLoading(false)
  }

  useEffect(() => { loadPartners() }, [])

  async function handleCreate(form) {
    const { error } = await supabase.from('neighbourhood_partners').insert(form)
    if (!error) {
      setShowForm(false)
      loadPartners()
    }
  }

  async function handleUpdate(form) {
    const { error } = await supabase
      .from('neighbourhood_partners')
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq('id', editing.id)
    if (!error) {
      setEditing(null)
      loadPartners()
    }
  }

  async function handleDelete(id) {
    await supabase.from('neighbourhood_partners').update({ is_active: false }).eq('id', id)
    loadPartners()
  }

  if (loading) {
    return <div className="animate-pulse"><div className="h-8 bg-gray-200 rounded w-48 mb-4" /><div className="h-60 bg-gray-200 rounded-xl" /></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Neighbourhood Partners</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null) }}
          className="h-9 px-4 bg-coral-500 text-white text-sm font-semibold rounded-lg hover:bg-coral-600 transition-colors cursor-pointer"
        >
          {showForm ? 'Cancel' : '+ Add Partner'}
        </button>
      </div>

      {showForm && !editing && (
        <div className="mb-6">
          <AdminPartnerForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {editing && (
        <div className="mb-6">
          <AdminPartnerForm partner={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Suburb</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">Bonus</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">Card-Linked</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">Featured</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {partners.map((p) => (
              <tr key={p.id} className={`hover:bg-gray-50 ${!p.is_active ? 'opacity-40' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="font-medium text-navy">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 capitalize">{p.category}</td>
                <td className="px-4 py-3 text-gray-500">{p.suburb || '—'}</td>
                <td className="px-4 py-3 text-center text-coral-500 font-medium">{p.bonus_points || 0}</td>
                <td className="px-4 py-3 text-center text-xs font-mono text-gray-400">{p.fidel_brand_id ? p.fidel_brand_id.slice(0, 12) + '...' : '—'}</td>
                <td className="px-4 py-3 text-center">{p.is_featured ? '★' : '—'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setEditing(p); setShowForm(false) }} className="text-gray-400 hover:text-navy p-1 cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-500 p-1 ml-1 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {partners.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No partners yet.</p>
        )}
      </div>
    </div>
  )
}
