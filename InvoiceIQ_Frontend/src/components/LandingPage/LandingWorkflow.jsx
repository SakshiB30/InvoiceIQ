function LandingWorkflow() {
  const steps = [
    {
      number: '01',
      icon: '↑',
      title: 'Upload Invoice',
      description:
        'Upload your invoice as a PDF or image. Keep your documents organized in one place.',
      accent: 'text-indigo-400',
      border: 'border-indigo-400/20',
      glow: 'bg-indigo-500/10',
    },
    {
      number: '02',
      icon: '✦',
      title: 'Extract Details',
      description:
        'OCR and AI-assisted processing help extract vendor information, invoice numbers, dates, and amounts.',
      accent: 'text-cyan-400',
      border: 'border-cyan-400/20',
      glow: 'bg-cyan-500/10',
    },
    {
      number: '03',
      icon: '✓',
      title: 'Validate Records',
      description:
        'Review extracted information, check for inconsistencies, and identify potential duplicate invoices.',
      accent: 'text-emerald-400',
      border: 'border-emerald-400/20',
      glow: 'bg-emerald-500/10',
    },
    {
      number: '04',
      icon: '↗',
      title: 'Analyze & Improve',
      description:
        'Explore spending patterns, visualize financial activity, and discover actionable business insights.',
      accent: 'text-violet-400',
      border: 'border-violet-400/20',
      glow: 'bg-violet-500/10',
    },
  ]

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-white/[0.05] bg-[#0E1422] px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            How It Works
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            From documents to
            <span className="block mt-2 bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
              business intelligence.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
            A streamlined process helps turn everyday invoices into organized
            financial information you can actually use.
          </p>
        </div>

        {/* Workflow steps */}
        <div className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line for desktop */}
          <div
            aria-hidden="true"
            className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-indigo-400/40 via-cyan-400/40 to-violet-400/40 lg:block"
          />

          {steps.map((step) => (
            <article key={step.number} className="relative">
              {/* Step number and icon */}
              <div className="relative z-10 flex items-center justify-between">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${step.border} ${step.glow} text-2xl ${step.accent} shadow-lg`}
                >
                  {step.icon}
                </div>

                <span className="text-sm font-semibold tracking-widest text-slate-600">
                  STEP {step.number}
                </span>
              </div>

              {/* Step details */}
              <div className="mt-7 rounded-2xl border border-white/[0.06] bg-[#151B2B]/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-[#151B2B]">
                <h3 className="text-lg font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {step.description}
                </p>

                <div
                  className={`mt-6 h-1 w-12 rounded-full ${step.glow} transition-all duration-300 hover:w-20`}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingWorkflow

