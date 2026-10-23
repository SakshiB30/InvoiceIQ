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
    <section className="border-y border-white/[0.06] bg-white/[0.015] px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-400">
            Why InvoiceIQ?
          </p>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Spend less time managing invoices.
            <span className="block mt-1 text-slate-500">
              Focus more on your business.
            </span>
          </h2>
        </div>

        {/* Highlights */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-white/[0.07] bg-[#111827]/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-[#151B2B]"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBackground} text-2xl ${item.accent} transition-transform duration-300 group-hover:scale-110`}
              >
                {item.icon}
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-100">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingHighlights