import { Link } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function StaticPageLayout({ title, lastUpdated, children }) {
  return (
    <>
      <Header />
      <main className="pt-28 pb-20 px-6 md:px-20 max-w-3xl mx-auto">
        <Link
          to="/"
          className="text-sm text-coral-500 hover:text-coral-600 font-medium mb-6 inline-block"
        >
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-navy mb-2">{title}</h1>
        {lastUpdated && (
          <p className="text-sm text-gray-400 mb-10">Last updated: {lastUpdated}</p>
        )}
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-navy [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_a]:text-coral-500 [&_a]:underline">
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}
