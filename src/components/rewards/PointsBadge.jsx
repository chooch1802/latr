import { useState, useEffect } from 'react'
import { Gift } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function PointsBadge() {
  const { user } = useAuth()
  const [points, setPoints] = useState(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('reward_balances')
      .select('available_points')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setPoints(data.available_points)
      })
  }, [user])

  if (points === null) return null

  return (
    <Link
      to="/rewards"
      className="flex items-center gap-1.5 h-8 px-2.5 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors text-xs font-semibold"
    >
      <Gift className="w-3.5 h-3.5" />
      {points.toLocaleString('en-AU')}
    </Link>
  )
}
