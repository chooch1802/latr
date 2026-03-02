import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'

const KNOWLEDGE_BASE = [
  {
    keywords: ['deposit aid', 'deposit', 'bond', 'rental deposit', 'how does deposit'],
    response:
      'LATR Deposit Aid helps renters cover their rental bond upfront. We pay the deposit to your landlord or agent, and you repay us in small, manageable instalments over time — no lump sum stress! Eligible renters can get approved in as little as 24 hours.',
    followUps: ['What are the interest rates?', 'Am I eligible?', 'How do repayments work?'],
  },
  {
    keywords: ['eligibility', 'eligible', 'qualify', 'who can', 'requirements'],
    response:
      'To be eligible for Deposit Aid you need to be an Australian resident aged 18+, have a valid rental agreement or offer letter, and pass a basic affordability check. No perfect credit score required — we look at the bigger picture.',
    followUps: ['How do I apply?', 'What documents do I need?', 'How long does approval take?'],
  },
  {
    keywords: ['interest', 'rate', 'fees', 'cost', 'how much', 'pricing', 'price'],
    response:
      'LATR Deposit Aid has no setup fees — you only pay interest on your deposit amount (22–30% depending on plan duration). No hidden charges or compounding interest. You can see a full breakdown before you commit, right in the app.',
    followUps: ['Which plan should I choose?', 'Can I pay off early?', 'How do repayments work?'],
  },
  {
    keywords: ['repay', 'repayment', 'pay back', 'instalments', 'installments', 'payment plan'],
    response:
      'Repayments are split into equal instalments over your chosen term (typically 6–12 months). Payments are debited automatically, and you can view your schedule and remaining balance anytime on the Deposit Aid page.',
    followUps: ['When is my next payment?', 'Can I pay off early?', 'What if I miss a payment?'],
  },
  {
    keywords: ['apply', 'application', 'how to apply', 'start application', 'new application'],
    response:
      'To submit a rental application, head to the Applications tab, tap "New Application", and fill in the property details and your personal info. You can attach documents like payslips and references. Once submitted, you\'ll get real-time status updates.',
    followUps: ['Track my application', 'What documents do I need?', 'Can I submit multiple applications?'],
  },
  {
    keywords: ['status', 'track', 'application status', 'where is my', 'progress', 'update'],
    response:
      'You can track your application status in the Applications tab. Each application shows its current stage — submitted, under review, approved, or declined. You\'ll also receive notifications when the status changes.',
    followUps: ['How long does approval take?', 'How do notifications work?', 'Contact support'],
  },
  {
    keywords: ['documents', 'document', 'upload', 'payslip', 'reference', 'identification'],
    response:
      'For applications you may need to upload ID (passport or driver\'s licence), proof of income (recent payslips or bank statements), and rental references. For KYC verification, head to Settings → Verify Identity and follow the prompts.',
    followUps: ['How does identity verification work?', 'Is my data secure?', 'How do I apply?'],
  },
  {
    keywords: ['household', 'housemates', 'create household', 'join household', 'share house', 'flatmates'],
    response:
      'The Household feature lets you create or join a shared household. Once set up, you can split bills, track shared expenses, and keep everyone on the same page. Go to the Household tab to get started — you can invite housemates by email.',
    followUps: ['How do I split bills?', 'Can I manage notifications?', 'Account settings'],
  },
  {
    keywords: ['bills', 'split', 'splitting', 'utilities', 'expenses', 'shared expenses'],
    response:
      'In your Household, you can add bills (rent, utilities, internet, etc.) and split them evenly or by custom amounts. Everyone in the household can see what\'s owed, and you\'ll get reminders before due dates.',
    followUps: ['How do I create a household?', 'How do notifications work?', 'Round Up savings'],
  },
  {
    keywords: ['account', 'settings', 'profile', 'edit profile', 'change name', 'email'],
    response:
      'You can update your profile info, notification preferences, and security settings on the Settings page. Tap your avatar or go to Settings from the sidebar to manage your account.',
    followUps: ['How do notifications work?', 'Is my data secure?', 'How do I sign in?'],
  },
  {
    keywords: ['notification', 'notifications', 'alerts', 'email alerts'],
    response:
      'You can manage your notification preferences in Settings → Notifications. Choose which alerts you want to receive — application updates, household activity, payment reminders, and more.',
    followUps: ['Account settings', 'Track my application', 'Contact support'],
  },
  {
    keywords: ['contact', 'support', 'help', 'email support', 'phone', 'speak to someone'],
    response:
      'You can reach our support team at support@latr.com.au. We aim to respond within 24 hours on business days. You can also check our FAQ page for instant answers to common questions.',
    followUps: ['How does Deposit Aid work?', 'Track my application', 'Account settings'],
  },
  {
    keywords: ['get started', 'getting started', 'new user', 'how to use', 'first time', 'sign up'],
    response:
      'Welcome to LATR! Start by setting up your profile in Settings, then explore Deposit Aid if you need help with your rental bond, or head to Applications to submit a rental application. You can also set up a Household to manage shared living expenses.',
    followUps: ['How does Deposit Aid work?', 'How do I apply?', 'How do I create a household?'],
  },
  {
    keywords: ['security', 'safe', 'data', 'privacy', 'secure'],
    response:
      'Your data is protected with bank-level encryption. We never share your personal information without your consent. You can review our full Privacy Policy in the app footer or at latr.com.au/privacy.',
    followUps: ['Account settings', 'How does identity verification work?', 'Contact support'],
  },
  {
    keywords: ['otp', 'sms', 'code', 'login', 'sign in', 'password', "cant login", "can't log in"],
    response:
      'LATR uses passwordless SMS verification for sign-in. Enter your Australian mobile number and we\'ll send a 6-digit code — just type it in to log in. Codes expire after a few minutes, so request a new one if needed.',
    followUps: ['Is my data secure?', 'Account settings', 'Contact support'],
  },
  {
    keywords: ['round up', 'round-up', 'spare change', 'roundup', 'round ups'],
    response:
      'Round Ups let you pay off your deposit faster by rounding up everyday purchases to the nearest dollar. The spare change goes toward your balance. There\'s a weekly cap so you stay in control, and you can pause anytime.',
    followUps: ['How do repayments work?', 'Can I pay off early?', 'How do I connect my bank?'],
  },
  {
    keywords: ['business', 'commercial', 'abn', 'heads of agreement', 'business application'],
    response:
      'LATR supports commercial lease deposits up to $200,000. Business applicants go through a 4-layer verification process (ABN lookup, ASIC check, Equifax Commercial, and CreditorWatch). Select "Business" when starting your application.',
    followUps: ['How does Deposit Aid work?', 'What documents do I need?', 'How long does approval take?'],
  },
  {
    keywords: ['bank', 'connect bank', 'basiq', 'link bank', 'bank account'],
    response:
      'Connecting your bank is a key step in the application process. We use Basiq to securely link your account in read-only mode — we can never move your money. This lets us run a quick cash flow assessment to confirm affordability.',
    followUps: ['Is my data secure?', 'How long does approval take?', 'What are the interest rates?'],
  },
  {
    keywords: ['payment method', 'direct debit', 'becs', 'bank debit', 'set up payment'],
    response:
      'Repayments are collected automatically via BECS Direct Debit from your nominated bank account. You\'ll set this up during the application process. It\'s the same system used by major Australian billers — safe and reliable.',
    followUps: ['How do repayments work?', 'What if I miss a payment?', 'Can I pay off early?'],
  },
  {
    keywords: ['payout', 'when paid', 'landlord paid', 'agent paid', 'when does landlord get paid'],
    response:
      'Once your Deposit Aid is approved, LATR pays your landlord or real estate agent directly via secure bank transfer. Payouts are typically processed within 1–2 business days after approval.',
    followUps: ['How long does approval take?', 'Track my application', 'How does Deposit Aid work?'],
  },
  {
    keywords: ['how long', 'when approved', 'timeline', 'wait', 'approval time'],
    response:
      'The automated cash flow assessment takes about 60 seconds. Most applications are reviewed and approved within 24 hours. Standalone lease deposit applications may require a brief admin review.',
    followUps: ['Track my application', 'What documents do I need?', 'How do I connect my bank?'],
  },
  {
    keywords: ['early', 'pay off early', 'ahead of schedule', 'extra payment', 'lump sum payment'],
    response:
      'Absolutely! You can make extra payments or pay off your balance early at any time with no penalties. Any extra amount goes straight toward reducing your remaining balance.',
    followUps: ['How do repayments work?', 'Round Up savings', 'What are the interest rates?'],
  },
  {
    keywords: ['late', 'missed', "can't pay", 'overdue', 'hardship', 'missed payment'],
    response:
      'If you\'re struggling with payments, reach out to us at support@latr.com.au — we\'re here to help. LATR has no hidden late fees, and we offer hardship provisions to work with you on a solution.',
    followUps: ['Contact support', 'How do repayments work?', 'Can I pay off early?'],
  },
  {
    keywords: ['search', 'find property', 'property', 'suburb', 'property search'],
    response:
      'Use the Properties tab to search for rentals by suburb or address. You can browse available listings and start an application directly from a property you\'re interested in.',
    followUps: ['How do I apply?', 'How does Deposit Aid work?', 'Track my application'],
  },
  {
    keywords: ['calculator', 'estimate', 'how much will i pay', 'deposit calculator'],
    response:
      'The Deposit Calculator on the Deposit Aid page lets you estimate your weekly repayments based on your deposit amount and chosen plan length. Try it out to see a full cost breakdown before you apply.',
    followUps: ['What are the interest rates?', 'Which plan should I choose?', 'How do I apply?'],
  },
  {
    keywords: ['multiple', 'more than one', 'another application', 'multiple applications'],
    response:
      'Yes, you can submit multiple applications — each one is tracked independently in your Applications tab. This is handy if you\'re applying for several properties at once.',
    followUps: ['Track my application', 'How do I apply?', 'How does Deposit Aid work?'],
  },
  {
    keywords: ['refer', 'referral', 'tell a friend', 'share latr'],
    response:
      'Love LATR? Share it with your friends and help them stress less about rental deposits too. You can share LATR directly from the app or point them to latr.com.au.',
    followUps: ['How does Deposit Aid work?', 'Account settings', 'Contact support'],
  },
  {
    keywords: ['identity', 'id check', 'onfido', 'verify identity', 'kyc'],
    response:
      'LATR uses a quick and secure identity check powered by Onfido. You\'ll be asked to scan your ID (driver\'s licence or passport) and take a selfie. It usually takes under 2 minutes and results are near-instant.',
    followUps: ['Is my data secure?', 'What documents do I need?', 'How do I apply?'],
  },
  {
    keywords: ['plan', '52 weeks', '78 weeks', '104 weeks', 'which plan', 'plan options'],
    response:
      'LATR offers 3 plan tiers: 52 weeks, 78 weeks, and 104 weeks. Shorter plans mean less total interest — we recommend the 52-week plan if it fits your budget. You\'ll see the exact costs for each option before you commit.',
    followUps: ['What are the interest rates?', 'Use the deposit calculator', 'Can I pay off early?'],
  },
  {
    keywords: ['schedule', 'when is my payment', 'next payment', 'repayment schedule', 'payment date'],
    response:
      'You can view your full repayment schedule — including your next payment date and amount — on the Deposit Aid detail page. Payments are debited weekly on the same day each week.',
    followUps: ['Can I pay off early?', 'What if I miss a payment?', 'Round Up savings'],
  },
]

const CONVERSATIONAL = [
  {
    patterns: ['hello', 'hi', 'hey', "g'day", 'good morning', 'good afternoon', 'good evening'],
    response: "Hey there! How can I help you today? Feel free to ask about Deposit Aid, applications, household management, or anything else.",
  },
  {
    patterns: ['thanks', 'thank you', 'cheers', 'ta', 'appreciate it', 'much appreciated'],
    response: "Happy to help! Let me know if there's anything else I can assist with.",
  },
  {
    patterns: ['bye', 'goodbye', 'see you', "that's all", 'nothing else', 'all good'],
    response: "No worries! If you need anything else, I'm always here. Have a great day!",
  },
  {
    patterns: ['yes', 'yep', 'yeah', 'sure', 'ok', 'okay'],
    response: "Great! What else can I help you with?",
  },
  {
    patterns: ['no', 'nope', 'nah', "no thanks"],
    response: "No problem. Let me know if you change your mind or have other questions!",
  },
]

const FALLBACK_RESPONSE =
  "I'm not sure I follow — here are some things I can help with:\n\n• Deposit Aid & repayments\n• Rental applications\n• Household bills\n• Round Up savings\n• Account & security\n\nOr reach our team at support@latr.com.au"

const QUICK_REPLIES = [
  'How does Deposit Aid work?',
  'What are the interest rates?',
  'Track my application',
  'Round Up savings',
  'Manage household bills',
  'Account settings',
]

const WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'bot',
  text: "G'day! I'm the LATR assistant. I can help with Deposit Aid, applications, household management, and more. What can I help you with?",
  time: new Date(),
}

function normaliseInput(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function matchResponse(input) {
  const normalised = normaliseInput(input)

  // Check conversational patterns first
  for (const entry of CONVERSATIONAL) {
    for (const pattern of entry.patterns) {
      const regex = new RegExp(`\\b${pattern.replace(/'/g, "'")}\\b`, 'i')
      if (regex.test(normalised) || normalised === pattern) {
        return { response: entry.response, followUps: null }
      }
    }
  }

  // Score knowledge base entries
  let bestMatch = null
  let bestScore = 0

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0
    for (const keyword of entry.keywords) {
      const words = keyword.split(' ')
      if (words.length > 1) {
        // Multi-word: boost for exact phrase match
        const phraseRegex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
        if (phraseRegex.test(normalised)) {
          score += words.length * 2
        }
      } else {
        // Single word: word boundary match
        const wordRegex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
        if (wordRegex.test(normalised)) {
          score += 1
        }
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = entry
    }
  }

  if (bestMatch && bestScore >= 1) {
    return { response: bestMatch.response, followUps: bestMatch.followUps }
  }

  return { response: FALLBACK_RESPONSE, followUps: null }
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
  const [lastFollowUps, setLastFollowUps] = useState(null)
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
        const { response, followUps } = matchResponse(text)
        const botMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: response,
          time: new Date(),
        }
        setMessages((prev) => [...prev, botMsg])
        setLastFollowUps(followUps)
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
  const isWelcomeOrFallback =
    lastBotMsg?.sender === 'bot' &&
    (lastBotMsg.id === 'welcome' || lastBotMsg.text === FALLBACK_RESPONSE)
  const showQuickReplies = !isTyping && isWelcomeOrFallback
  const showFollowUps = !isTyping && !isWelcomeOrFallback && lastBotMsg?.sender === 'bot' && lastFollowUps

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed right-5 bottom-24 md:bottom-6 z-40 w-14 h-14 rounded-full bg-coral-500 text-white shadow-coral flex items-center justify-center cursor-pointer"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
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
            className="fixed inset-0 md:inset-auto md:right-5 md:bottom-22 z-40 w-full h-full md:w-[380px] md:h-[520px] md:rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden"
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
                      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-gray-800 leading-relaxed max-w-[260px] whitespace-pre-line">
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

              {/* Quick Replies (welcome / fallback) */}
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

              {/* Contextual Follow-Ups */}
              {showFollowUps && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {lastFollowUps.map((text) => (
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
              className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 flex-shrink-0 safe-area-bottom"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={isTyping}
                className="flex-1 text-base bg-gray-100 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-coral-300 placeholder:text-gray-400 disabled:opacity-50"
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
