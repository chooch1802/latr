import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'

const KNOWLEDGE_BASE = [
  {
    keywords: ['deposit aid', 'deposit', 'bond', 'rental deposit', 'how does deposit'],
    response:
      'LATR Deposit Aid helps renters cover their rental bond upfront. We pay the deposit to your landlord or agent, and you repay us in small, manageable instalments over time — no lump sum stress! Eligible renters can get approved in as little as 24 hours.',
  },
  {
    keywords: ['eligibility', 'eligible', 'qualify', 'who can', 'requirements'],
    response:
      'To be eligible for Deposit Aid you need to be an Australian resident aged 18+, have a valid rental agreement or offer letter, and pass a basic affordability check. No perfect credit score required — we look at the bigger picture.',
  },
  {
    keywords: ['interest', 'rate', 'fees', 'cost', 'how much', 'pricing', 'price'],
    response:
      'LATR Deposit Aid has a simple flat service fee — no hidden charges or compounding interest. The exact fee depends on your deposit amount and repayment term. You can see a full breakdown before you commit, right in the app.',
  },
  {
    keywords: ['repay', 'repayment', 'pay back', 'instalments', 'installments', 'payment plan'],
    response:
      'Repayments are split into equal instalments over your chosen term (typically 6–12 months). Payments are debited automatically, and you can view your schedule and remaining balance anytime on the Deposit Aid page.',
  },
  {
    keywords: ['apply', 'application', 'how to apply', 'start application', 'new application'],
    response:
      'To submit a rental application, head to the Applications tab, tap "New Application", and fill in the property details and your personal info. You can attach documents like payslips and references. Once submitted, you\'ll get real-time status updates.',
  },
  {
    keywords: ['status', 'track', 'application status', 'where is my', 'progress', 'update'],
    response:
      'You can track your application status in the Applications tab. Each application shows its current stage — submitted, under review, approved, or declined. You\'ll also receive notifications when the status changes.',
  },
  {
    keywords: ['documents', 'document', 'upload', 'payslip', 'reference', 'id', 'identification', 'kyc', 'verify', 'verification'],
    response:
      'For applications you may need to upload ID (passport or driver\'s licence), proof of income (recent payslips or bank statements), and rental references. For KYC verification, head to Settings → Verify Identity and follow the prompts.',
  },
  {
    keywords: ['household', 'housemates', 'create household', 'join household', 'share house', 'flatmates'],
    response:
      'The Household feature lets you create or join a shared household. Once set up, you can split bills, track shared expenses, and keep everyone on the same page. Go to the Household tab to get started — you can invite housemates by email.',
  },
  {
    keywords: ['bills', 'split', 'splitting', 'utilities', 'expenses', 'shared expenses'],
    response:
      'In your Household, you can add bills (rent, utilities, internet, etc.) and split them evenly or by custom amounts. Everyone in the household can see what\'s owed, and you\'ll get reminders before due dates.',
  },
  {
    keywords: ['account', 'settings', 'profile', 'edit profile', 'change name', 'email'],
    response:
      'You can update your profile info, notification preferences, and security settings on the Settings page. Tap your avatar or go to Settings from the sidebar to manage your account.',
  },
  {
    keywords: ['notification', 'notifications', 'alerts', 'email alerts'],
    response:
      'You can manage your notification preferences in Settings → Notifications. Choose which alerts you want to receive — application updates, household activity, payment reminders, and more.',
  },
  {
    keywords: ['contact', 'support', 'help', 'email support', 'phone', 'speak to someone'],
    response:
      'You can reach our support team at support@latr.com.au. We aim to respond within 24 hours on business days. You can also check our FAQ page for instant answers to common questions.',
  },
  {
    keywords: ['get started', 'getting started', 'new user', 'how to use', 'first time', 'sign up'],
    response:
      'Welcome to LATR! Start by setting up your profile in Settings, then explore Deposit Aid if you need help with your rental bond, or head to Applications to submit a rental application. You can also set up a Household to manage shared living expenses.',
  },
  {
    keywords: ['security', 'safe', 'data', 'privacy', 'secure'],
    response:
      'Your data is protected with bank-level encryption. We never share your personal information without your consent. You can review our full Privacy Policy in the app footer or at latr.com.au/privacy.',
  },
  {
    keywords: ['magic link', 'login', 'sign in', 'password', 'cant login', "can't log in"],
    response:
      'LATR uses passwordless magic links for sign-in. Enter your email and we\'ll send a secure link — just click it to log in. Check your spam folder if you don\'t see it within a minute.',
  },
]

const FALLBACK_RESPONSE =
  "I'm not sure about that — you can reach our team at support@latr.com.au or visit our FAQ page for more info."

const QUICK_REPLIES = [
  'How does Deposit Aid work?',
  'Track my application',
  'Manage household bills',
  'Account settings',
]

const WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'bot',
  text: "G'day! I'm the LATR assistant. I can help with Deposit Aid, applications, household management, and more. What can I help you with?",
  time: new Date(),
}

function matchResponse(input) {
  const lower = input.toLowerCase()
  let bestMatch = null
  let bestScore = 0

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        score += keyword.split(' ').length
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = entry.response
    }
  }

  return bestMatch || FALLBACK_RESPONSE
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <img
        src="/latr-mascot.png"
        alt=""
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full inline-block"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false)
      // Small delay to let animation finish before focusing
      const t = setTimeout(() => inputRef.current?.focus(), 300)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  const sendMessage = useCallback(
    (text) => {
      if (!text.trim() || isTyping) return

      const userMsg = {
        id: Date.now(),
        sender: 'user',
        text: text.trim(),
        time: new Date(),
      }

      setMessages((prev) => [...prev, userMsg])
      setInput('')
      setIsTyping(true)

      setTimeout(() => {
        const botMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: matchResponse(text),
          time: new Date(),
        }
        setMessages((prev) => [...prev, botMsg])
        setIsTyping(false)
      }, 400)
    },
    [isTyping]
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const lastBotMsg = messages[messages.length - 1]
  const showQuickReplies =
    !isTyping &&
    lastBotMsg?.sender === 'bot' &&
    (lastBotMsg.id === 'welcome' || lastBotMsg.text === FALLBACK_RESPONSE)

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed right-5 bottom-20 md:bottom-6 z-40 w-14 h-14 rounded-full bg-coral-500 text-white shadow-coral flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={
          !isOpen
            ? { boxShadow: ['0 8px 24px rgba(255,90,61,0.15)', '0 8px 24px rgba(255,90,61,0.4)', '0 8px 24px rgba(255,90,61,0.15)'] }
            : {}
        }
        transition={
          !isOpen
            ? { boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }
            : {}
        }
        aria-label={isOpen ? 'Close support chat' : 'Open support chat'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread dot */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
            className="fixed right-0 bottom-0 md:right-5 md:bottom-22 z-40 w-full h-full md:w-[380px] md:h-[520px] md:rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-navy px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src="/latr-mascot.png"
                  alt="LATR mascot"
                  className="w-9 h-9 rounded-full object-cover border-2 border-white/20"
                />
                <div>
                  <h3 className="text-white font-semibold text-sm leading-tight">
                    LATR Support
                  </h3>
                  <p className="text-white/60 text-xs">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1 cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {messages.map((msg) =>
                msg.sender === 'bot' ? (
                  <div key={msg.id} className="flex items-end gap-2 mb-3">
                    <img
                      src="/latr-mascot.png"
                      alt=""
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-gray-800 leading-relaxed max-w-[260px]">
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-gray-400 ml-1 mt-0.5 block">
                        {formatTime(msg.time)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex justify-end mb-3">
                    <div>
                      <div className="bg-coral-500 rounded-2xl rounded-br-sm px-4 py-2.5 text-sm text-white leading-relaxed max-w-[260px]">
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-gray-400 mr-1 mt-0.5 block text-right">
                        {formatTime(msg.time)}
                      </span>
                    </div>
                  </div>
                )
              )}

              {isTyping && <TypingIndicator />}

              {/* Quick Replies */}
              {showQuickReplies && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {QUICK_REPLIES.map((text) => (
                    <button
                      key={text}
                      onClick={() => sendMessage(text)}
                      className="text-xs bg-coral-50 text-coral-600 px-3 py-1.5 rounded-full border border-coral-200 hover:bg-coral-100 transition-colors cursor-pointer"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 flex-shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={isTyping}
                className="flex-1 text-sm bg-gray-100 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-coral-300 placeholder:text-gray-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-full bg-coral-500 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-coral-600 transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
