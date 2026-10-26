import Reveal from './Reveal'
import SpotlightCard from './Spotlightcard'

function LandingHighlights() {
  const highlights = [
    {
      icon: '⚡',
      title: 'Less Manual Work',
      description:
        'Reduce repetitive invoice data entry with OCR-powered document processing and AI-assisted extraction.',
      accent: 'text-amber-300',
      iconBackground: 'bg-amber-400/10',
    },
    {
      icon: '◈',
      title: 'Better Financial Visibility',
      description:
        'Bring invoice records, expense information, and spending analytics together in one workspace.',
      accent: 'text-cyan-300',
      iconBackground: 'bg-cyan-400/10',
    },
    {
      icon: '✦',
      title: 'Smarter Decisions',
      description:
        'Explore spending patterns and use AI-generated insights to better understand your business finances.',
      accent: 'text-indigo-300',
      iconBackground: 'bg-indigo-400/10',
    },
  ]

  return (
    <section className="border-y border-white/[0.06] bg-white/[0.015] px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.07] px-3.5 py-1.5 text-xs font-medium text-indigo-300">
            Why InvoiceIQ?
          </p>

          <h2 className="iq-display mt-5 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Spend less time managing invoices.
            <span className="mt-1 block text-slate-500">Focus more on your business.</span>
          </h2>
        </Reveal>

        {/* Highlights */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {highlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 120} className="h-full">
              <SpotlightCard
                as="article"
                className="group h-full rounded-2xl border border-white/[0.07] bg-[#111827]/70 p-6 backdrop-blur transition duration-500 hover:-translate-y-1.5 hover:bg-[#151B2B]"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBackground} text-2xl ${item.accent} transition duration-500 group-hover:-rotate-6 group-hover:scale-110`}
                >
                  {item.icon}
                </div>

                <h3 className="iq-display mt-5 text-lg font-semibold text-slate-100">{item.title}</h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingHighlights