import { useState, useEffect } from 'react'
import { CreditCard, X, Loader2, ShieldCheck } from 'lucide-react'
import { getLinkedCards, linkCard, unlinkCard } from '../../lib/fidelApi'

const schemeIcons = {
  visa: 'Visa',
  mastercard: 'MC',
  amex: 'Amex',
}

export default function CardLinkSection() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [unlinking, setUnlinking] = useState(null)

  async function loadCards() {
    try {
      const data = await getLinkedCards()
      setCards(data)
    } catch {
      // Will show empty state
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCards() }, [])

  function handleLinkCard() {
    if (!window.Fidel) {
      console.error('Fidel SDK not loaded')
      return
    }

    window.Fidel.openForm({
      companyName: 'LATR',
      sdkKey: import.meta.env.VITE_FIDEL_SDK_KEY,
      programId: import.meta.env.VITE_FIDEL_PROGRAM_ID,
      callback(err, card) {
        if (err) {
          console.error('Fidel SDK error:', err)
          return
        }
        linkCard({
          cardId: card.id,
          scheme: card.scheme,
          lastFour: card.lastNumbers,
          expMonth: card.expMonth,
          expYear: card.expYear,
        }).then(() => loadCards())
          .catch((e) => console.error('Link card error:', e))
      },
    })
  }

  async function handleUnlink(cardId) {
    if (!confirm('Unlink this card? You will stop earning automatic points with it.')) return
    setUnlinking(cardId)
    try {
      await unlinkCard(cardId)
      await loadCards()
    } catch {
      // Ignore
    } finally {
      setUnlinking(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-32 mb-3" />
        <div className="h-12 bg-gray-200 rounded" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-navy">Linked Cards</h3>
        <button
          onClick={handleLinkCard}
          className="h-8 px-3 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <CreditCard className="w-3.5 h-3.5" />
          Link Card
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-6">
          <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-1">Link a card to earn points automatically</p>
          <p className="text-xs text-gray-400">Earn bonus points every time you pay at a partner</p>
        </div>
      ) : (
        <div className="space-y-2">
          {cards.map((card) => (
            <div key={card.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-navy">
                    <span className="text-xs font-semibold text-gray-400 uppercase mr-1.5">{schemeIcons[card.scheme] || card.scheme}</span>
                    ****{card.last_four}
                  </p>
                  <p className="text-xs text-gray-400">Exp {String(card.exp_month).padStart(2, '0')}/{card.exp_year}</p>
                </div>
              </div>
              <button
                onClick={() => handleUnlink(card.fidel_card_id)}
                disabled={unlinking === card.fidel_card_id}
                className="w-7 h-7 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
              >
                {unlinking === card.fidel_card_id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
        <ShieldCheck className="w-3 h-3 text-gray-400" />
        <p className="text-[11px] text-gray-400">Your card details are securely stored and tokenized by Fidel</p>
      </div>
    </div>
  )
}
