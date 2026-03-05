import { useState } from 'react'
import { Copy, Check, Share2 } from 'lucide-react'

export default function ReferralShareCard({ code }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join LATR',
          text: `Use my referral code ${code} to sign up for LATR and we both earn bonus points!`,
          url: `https://latr.com.au/signup?ref=${code}`,
        })
      } catch {
        // User cancelled
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl p-5 text-white">
      <h3 className="text-lg font-bold mb-1">Your Referral Code</h3>
      <p className="text-white/70 text-sm mb-4">Share with friends — you both earn bonus points!</p>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-white/20 rounded-xl px-4 py-3 text-center">
          <span className="text-xl font-bold tracking-widest">{code}</span>
        </div>
        <button
          onClick={handleCopy}
          className="w-11 h-11 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>

      <button
        onClick={handleShare}
        className="w-full h-11 bg-white text-coral-600 font-semibold rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <Share2 className="w-4 h-4" />
        Share with Friends
      </button>
    </div>
  )
}
