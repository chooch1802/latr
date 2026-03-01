import { useState } from 'react'
import { Send, Mail, MessageSquare } from 'lucide-react'
import StaticPageLayout from '../components/layout/StaticPageLayout'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // In production this would call an API/edge function
    setSubmitted(true)
  }

  return (
    <StaticPageLayout title="Contact Us">
      <p className="text-lg text-gray-600 mb-8">
        Have a question, suggestion, or need help? We&apos;d love to hear from you.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-coral-500" />
          </div>
          <div>
            <h3 className="!mt-0 !mb-1">Email</h3>
            <p className="text-gray-600 text-sm">support@getlatr.com</p>
            <p className="text-gray-400 text-xs mt-1">We typically respond within 24 hours.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-coral-500" />
          </div>
          <div>
            <h3 className="!mt-0 !mb-1">In-App Support</h3>
            <p className="text-gray-600 text-sm">Log in and visit Settings for help.</p>
            <p className="text-gray-400 text-xs mt-1">Available to registered users.</p>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Send className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="!mt-0 !mb-2 text-emerald-800">Message Sent</h2>
          <p className="text-emerald-700">
            Thank you for reaching out. We&apos;ll get back to you within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="!mt-0">Send us a message</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 outline-none transition"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 outline-none transition"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 outline-none transition"
              placeholder="How can we help?"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 outline-none transition resize-none"
              placeholder="Tell us more..."
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-coral-500 hover:bg-coral-600 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </form>
      )}
    </StaticPageLayout>
  )
}
