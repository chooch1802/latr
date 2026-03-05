import { useState, useEffect } from 'react'
import { Calendar, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminRentDayForm from '../../components/admin/AdminRentDayForm'

export default function AdminRentDayPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [drawing, setDrawing] = useState(null)

  async function loadEvents() {
    const { data } = await supabase
      .from('rent_day_events')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false })
    setEvents(data || [])
    setLoading(false)
  }

  useEffect(() => { loadEvents() }, [])

  async function handleCreate(formData) {
    const { error } = await supabase.from('rent_day_events').insert({
      ...formData,
      free_rent_enabled: true,
      status: 'scheduled',
      starts_at: new Date(formData.year, formData.month - 1, 1).toISOString(),
      ends_at: new Date(formData.year, formData.month - 1, 2).toISOString(),
    })
    if (!error) {
      setShowForm(false)
      loadEvents()
    }
  }

  async function handleDraw(eventId) {
    setDrawing(eventId)
    try {
      await supabase.functions.invoke('rewards-rent-day-draw', {
        body: { eventId },
      })
      loadEvents()
    } finally {
      setDrawing(null)
    }
  }

  async function handleStatusChange(eventId, status) {
    await supabase.from('rent_day_events').update({ status, updated_at: new Date().toISOString() }).eq('id', eventId)
    loadEvents()
  }

  if (loading) {
    return <div className="animate-pulse"><div className="h-8 bg-gray-200 rounded w-48 mb-4" /><div className="h-40 bg-gray-200 rounded-xl" /></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Rent Day Events</h1>
        <button onClick={() => setShowForm(!showForm)} className="h-9 px-4 bg-coral-500 text-white text-sm font-semibold rounded-lg hover:bg-coral-600 transition-colors cursor-pointer">
          {showForm ? 'Cancel' : '+ New Event'}
        </button>
      </div>

      {showForm && <div className="mb-6"><AdminRentDayForm onSubmit={handleCreate} /></div>}

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-coral-500" />
                <h3 className="font-semibold text-navy">{event.title}</h3>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                event.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                event.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                event.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {event.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              {new Date(2024, event.month - 1).toLocaleString('en-AU', { month: 'long' })} {event.year}
              {' · '}{event.bonus_multiplier}x multiplier
              {' · '}Max ${event.free_rent_max_amount}
              {event.free_rent_winner_id && ' · Winner drawn'}
            </p>
            <div className="flex gap-2">
              {event.status === 'scheduled' && (
                <button
                  onClick={() => handleStatusChange(event.id, 'active')}
                  className="h-8 px-3 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
                >
                  Activate
                </button>
              )}
              {event.status === 'active' && !event.free_rent_winner_id && (
                <button
                  onClick={() => handleDraw(event.id)}
                  disabled={drawing === event.id}
                  className="h-8 px-3 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
                >
                  {drawing === event.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  Draw Winner
                </button>
              )}
              {event.status !== 'completed' && event.status !== 'cancelled' && (
                <button
                  onClick={() => handleStatusChange(event.id, 'cancelled')}
                  className="h-8 px-3 border border-gray-200 text-xs font-medium text-gray-500 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No events created yet.</p>
        )}
      </div>
    </div>
  )
}
