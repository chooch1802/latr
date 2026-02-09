import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import StaticPageLayout from '../components/layout/StaticPageLayout'

const faqs = [
  {
    category: 'Deposit Aid',
    items: [
      {
        q: 'What is LATR Deposit Aid?',
        a: 'Deposit Aid is a service that pays your rental bond upfront so you can move in sooner. You repay LATR in affordable weekly instalments over your chosen repayment period. It is not a loan — it\'s a deposit aid facility.',
      },
      {
        q: 'Am I eligible for Deposit Aid?',
        a: 'To be eligible, you must be 18+, an Australian resident, and pass our identity verification (KYC) and eligibility assessment. Eligibility is based on your income and rental situation.',
      },
      {
        q: 'How much does Deposit Aid cost?',
        a: 'A one-time service fee is applied to your deposit amount. The exact fee is shown before you confirm your application, so there are no surprises. There are no hidden charges.',
      },
      {
        q: 'What happens if I miss a repayment?',
        a: 'We understand life happens. If you\'re struggling with repayments, contact us as soon as possible. Late fees may apply for missed payments, and continued non-payment may affect your account status.',
      },
    ],
  },
  {
    category: 'Rental Applications',
    items: [
      {
        q: 'How do I apply for a rental property?',
        a: 'Browse available properties, select one you\'re interested in, and click "Apply". Fill out the application form with your details, employment info, and references. Your application is sent directly to the property manager.',
      },
      {
        q: 'Does LATR guarantee my application will be accepted?',
        a: 'No. LATR provides the platform to submit applications, but tenancy decisions are made by property managers and landlords. We have no influence over their decisions.',
      },
      {
        q: 'Can I apply for multiple properties?',
        a: 'Yes! You can submit applications to multiple properties simultaneously. Track all your applications from the Applications page in your dashboard.',
      },
    ],
  },
  {
    category: 'Household & Bills',
    items: [
      {
        q: 'How does bill splitting work?',
        a: 'Create a household group and invite your housemates. When you add a bill, it\'s automatically split between members. Everyone can track what they owe and mark their share as paid.',
      },
      {
        q: 'Can I be in multiple households?',
        a: 'Currently, each user can belong to one household at a time. You can leave your current household and join or create a new one at any time.',
      },
    ],
  },
  {
    category: 'Account & Security',
    items: [
      {
        q: 'How do I verify my identity?',
        a: 'Go to Settings and look for the KYC verification section. You\'ll need to provide a valid government-issued ID. Verification is required before applying for Deposit Aid.',
      },
      {
        q: 'Is my data secure?',
        a: 'Yes. We use industry-standard encryption (TLS) for data in transit and at rest, with strict access controls. We comply with the Australian Privacy Principles. Read our Privacy Policy for full details.',
      },
      {
        q: 'How do I delete my account?',
        a: 'You can request account deletion through Settings or by contacting support. Note that all outstanding deposit aid repayments must be completed before your account can be closed.',
      },
    ],
  },
]

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left cursor-pointer group"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-navy group-hover:text-coral-500 transition-colors pr-4">
          {question}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  return (
    <StaticPageLayout title="Frequently Asked Questions">
      <p className="text-lg text-gray-600 mb-8">
        Find answers to common questions about LATR. Can&apos;t find what you&apos;re
        looking for? <a href="/contact">Get in touch</a>.
      </p>

      {faqs.map((section) => (
        <div key={section.category} className="mb-10">
          <h2 className="!mt-0">{section.category}</h2>
          <div>
            {section.items.map((item) => (
              <FAQItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      ))}
    </StaticPageLayout>
  )
}
