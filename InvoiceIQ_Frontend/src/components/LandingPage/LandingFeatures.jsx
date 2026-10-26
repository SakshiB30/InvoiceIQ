import Reveal from './Reveal'
import SpotlightCard from './Spotlightcard'

function LandingFeatures() {
  const features = [
    {
      icon: '✦',
      title: 'AI-Powered Extraction',
      description:
        'Extract invoice details from PDFs and images using OCR and AI-assisted processing, reducing repetitive manual entry.',
      color: 'from-indigo-500/25 to-indigo-500/5',
      iconColor: 'text-indigo-400',
    },
    {
      icon: '✓',
      title: 'Smart Validation',
      description:
        'Review extracted information, identify missing details, and validate invoice records before confirmation.',
      color: 'from-emerald-500/25 to-emerald-500/5',
      iconColor: 'text-emerald-400',
    },
    {
      icon: '⌕',
      title: 'Duplicate Detection',
      description:
        'Identify potentially duplicated invoices and review them before they affect your financial records.',
      color: 'from-amber-500/25 to-amber-500/5',
      iconColor: 'text-amber-400',
    },
    {
      icon: '↗',
      title: 'Spending Analytics',
      description:
        'Explore spending patterns, category-wise expenses, monthly trends, and vendor activity through visual reports.',
      color: 'from-cyan-500/25 to-cyan-500/5',
      iconColor: 'text-cyan-400',
    },
    {
      icon: '◈',
      title: 'AI-Powered Insights',
      description:
        'Understand your spending data with AI-generated summaries, recommendations, and business insights.',
      color: 'from-violet-500/25 to-violet-500/5',
      iconColor: 'text-violet-400',
    },
    {
      icon: '▤',
      title: 'Centralized Management',
      description:
        'Keep invoice documents, extracted information, expense records, and financial data organized in one workspace.',
      color: 'from-rose-500/25 to-rose-500/5',
      iconColor: 'text-rose-400',
    },
  ]

  return (
    <section id="features" className="relative scroll-mt-20 px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div
        aria-hidden="true"
        className="iq-aurora-slow pointer-events-none absolute left-1/2 top-1/3 h-96 w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/[0.07] blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.07] px-3.5 py-1.5 text-xs font-medium text-indigo-300">
            Powerful Features
          </span>

          <h2 className="iq-display mt-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Everything your invoices need.
            <span className="mt-2 block text-slate-500">All in one place.</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
            Simplify invoice processing, improve financial visibility, and turn business records
            into useful insights with InvoiceIQ.
          </p>
        </Reveal>

        {/* Feature cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={(index % 3) * 110} className="h-full">
              <SpotlightCard
                as="article"
                className="group h-full rounded-2xl border border-white/[0.07] bg-[#111827]/80 p-6 backdrop-blur transition duration-500 hover:-translate-y-1.5 hover:bg-[#151B2B] sm:p-7"
              >
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-2xl ${feature.iconColor} transition duration-500 group-hover:-rotate-6 group-hover:scale-110`}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="iq-display mt-6 text-lg font-semibold text-slate-100">{feature.title}</h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>

                {/* Decorative accent */}
                <div className="mt-6 h-px w-10 bg-gradient-to-r from-indigo-400/70 to-transparent transition-all duration-500 group-hover:w-24" />
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingFeatures