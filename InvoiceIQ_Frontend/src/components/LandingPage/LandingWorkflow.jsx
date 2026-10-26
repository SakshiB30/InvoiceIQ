import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import SpotlightCard from './Spotlightcard'

const steps = [
  {
    number: '01',
    icon: '↑',
    title: 'Upload Invoice',
    description:
      'Upload your invoice as a PDF or image. Keep your documents organized in one place.',
    accent: 'text-indigo-400',
    border: 'border-indigo-400/25',
    glow: 'bg-indigo-500/10',
    bar: 'bg-indigo-400/60',
    halo: 'bg-indigo-500/20',
  },
  {
    number: '02',
    icon: '✦',
    title: 'Extract Details',
    description:
      'OCR and AI-assisted processing help extract vendor information, invoice numbers, dates, and amounts.',
    accent: 'text-cyan-400',
    border: 'border-cyan-400/25',
    glow: 'bg-cyan-500/10',
    bar: 'bg-cyan-400/60',
    halo: 'bg-cyan-500/20',
  },
  {
    number: '03',
    icon: '✓',
    title: 'Validate Records',
    description:
      'Review extracted information, check for inconsistencies, and identify potential duplicate invoices.',
    accent: 'text-emerald-400',
    border: 'border-emerald-400/25',
    glow: 'bg-emerald-500/10',
    bar: 'bg-emerald-400/60',
    halo: 'bg-emerald-500/20',
  },
  {
    number: '04',
    icon: '↗',
    title: 'Analyze & Improve',
    description:
      'Explore spending patterns, visualize financial activity, and discover actionable business insights.',
    accent: 'text-violet-400',
    border: 'border-violet-400/25',
    glow: 'bg-violet-500/10',
    bar: 'bg-violet-400/60',
    halo: 'bg-violet-500/20',
  },
]

// Small illustrative visual for each step (remounted on change so its animation replays)
function StepVisual({ index }) {
  if (index === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-6">
        <div className="iq-float flex w-52 items-center gap-3 rounded-xl border border-indigo-400/30 bg-indigo-500/10 p-3">
          <span className="text-2xl text-indigo-300">▤</span>
          <div>
            <p className="text-xs font-semibold text-white">invoice-2041.pdf</p>
            <p className="text-[10px] text-slate-400">248 KB</p>
          </div>
        </div>

        <div className="w-full max-w-xs rounded-2xl border-2 border-dashed border-indigo-400/30 py-9 text-center text-xs text-slate-400">
          Drop a PDF or image here
        </div>

        <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" />
        </div>
      </div>
    )
  }

  if (index === 1) {
    const fields = [
      ['Vendor', 'Northwind Traders', '0.6s'],
      ['Invoice no.', 'INV-2041', '1.3s'],
      ['Date', '12 Oct 2026', '2.0s'],
      ['Amount', '₹18,450', '2.7s'],
    ]

    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="relative w-64 rounded-xl border border-white/10 bg-[#0F1524] p-4">
          <div className="space-y-2.5">
            {fields.map(([label, value, delay]) => (
              <div
                key={label}
                className="iq-field flex items-center justify-between px-2 py-2 text-xs"
                style={{ '--d': delay }}
              >
                <span>{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
          <div className="iq-scanline" />
        </div>
      </div>
    )
  }

  if (index === 2) {
    const checks = [
      ['Vendor matched', true],
      ['Amounts add up', true],
      ['Date in range', true],
      ['Possible duplicate: review', false],
    ]

    return (
      <div className="flex h-full flex-col justify-center gap-3 p-6">
        {checks.map(([label, ok], i) => (
          <div
            key={label}
            className={`iq-hero-in flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
              ok
                ? 'border-emerald-400/20 bg-emerald-400/[0.06] text-slate-200'
                : 'border-amber-400/25 bg-amber-400/[0.07] text-amber-200'
            }`}
            style={{ '--d': `${i * 220}ms` }}
          >
            <span className={ok ? 'text-emerald-300' : 'text-amber-300'}>{ok ? '✓' : '!'}</span>
            {label}
          </div>
        ))}
      </div>
    )
  }

  const bars = [30, 48, 40, 66, 52, 82, 60, 92]

  return (
    <div className="flex h-full flex-col justify-center gap-5 p-6">
      <div className="iq-bars is-visible flex h-40 items-end gap-3">
        {bars.map((height, i) => (
          <div key={i} className="flex h-full flex-1 items-end">
            <div
              className="iq-bar w-full rounded-t-md bg-gradient-to-t from-violet-600 to-cyan-400"
              style={{ height: `${height}%`, '--d': `${i * 80 + 100}ms` }}
            />
          </div>
        ))}
      </div>

      <div
        className="iq-hero-in flex items-center gap-3 rounded-xl border border-violet-400/20 bg-violet-400/[0.07] p-3 text-xs text-slate-300"
        style={{ '--d': '900ms' }}
      >
        <span className="text-violet-300">✦</span>
        Spending is trending up. Review your top vendors.
      </div>
    </div>
  )
}

function LandingWorkflow() {
  const [desktop, setDesktop] = useState(false)
  const [active, setActive] = useState(0)
  const trackRef = useRef(null)
  const railRef = useRef(null)

  // Sticky scroll storytelling only on large screens
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const update = () => setDesktop(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  // Map scroll position inside the tall track to a step
  useEffect(() => {
    if (!desktop) return undefined

    let frame
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0

      setActive(Math.min(steps.length - 1, Math.floor(progress * steps.length)))
      if (railRef.current) railRef.current.style.transform = `scaleY(${progress})`
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [desktop])

  const goTo = (index) => {
    const track = trackRef.current
    if (!track) return
    const top = track.getBoundingClientRect().top + window.scrollY
    const total = track.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + (total * (index + 0.5)) / steps.length, behavior: 'smooth' })
  }

  const current = steps[active]

  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-20 overflow-clip border-y border-white/[0.05] bg-[#0A0F1C] px-5 pt-24 sm:px-8 lg:px-10 lg:pt-32"
    >
      <div
        aria-hidden="true"
        className="iq-aurora pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-cyan-500/[0.09] blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3.5 py-1.5 text-xs font-medium text-cyan-300">
            How It Works
          </span>

          <h2 className="iq-display mt-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            From documents to
            <span className="iq-gradient-text mt-2 block">business intelligence.</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
            A streamlined process helps turn everyday invoices into organized financial
            information you can actually use.
          </p>
        </Reveal>

        {desktop ? (
          /* Desktop: pinned stage that changes step as you scroll */
          <div ref={trackRef} className="relative mt-10" style={{ height: `${steps.length * 85}vh` }}>
            <div className="sticky top-0 flex h-screen items-center pt-16">
              <div className="grid w-full grid-cols-[1fr_1.05fr] items-center gap-16">
                {/* Step list with progress rail */}
                <div className="relative pl-10">
                  <div className="absolute bottom-2 left-3 top-2 w-px bg-white/10" aria-hidden="true">
                    <div
                      ref={railRef}
                      className="h-full origin-top bg-gradient-to-b from-indigo-400 via-cyan-400 to-violet-400"
                      style={{ transform: 'scaleY(0)' }}
                    />
                  </div>

                  <div className="space-y-3">
                    {steps.map((step, index) => {
                      const on = index === active
                      return (
                        <button
                          key={step.number}
                          type="button"
                          onClick={() => goTo(index)}
                          aria-current={on ? 'step' : undefined}
                          className={`relative block w-full rounded-2xl border p-5 text-left transition-all duration-500 ${
                            on
                              ? 'border-white/10 bg-[#151B2B]/80'
                              : 'border-transparent opacity-45 hover:opacity-80'
                          }`}
                        >
                          <span
                            className={`absolute -left-[1.85rem] top-7 h-2.5 w-2.5 rounded-full border-2 border-[#0A0F1C] transition-all duration-500 ${
                              on ? `${step.bar} scale-150` : 'bg-slate-600'
                            }`}
                            aria-hidden="true"
                          />

                          <div className="flex items-center gap-4">
                            <span
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xl ${step.border} ${step.glow} ${step.accent}`}
                            >
                              {step.icon}
                            </span>

                            <div>
                              <p className="text-xs font-semibold tracking-widest text-slate-500">
                                STEP {step.number}
                              </p>
                              <h3 className="iq-display text-lg font-semibold text-white">{step.title}</h3>
                            </div>
                          </div>

                          <div
                            className={`grid transition-all duration-500 ${
                              on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                            }`}
                          >
                            <p className="min-h-0 overflow-hidden pt-0 text-sm leading-7 text-slate-400">
                              <span className="block pt-3">{step.description}</span>
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Visual stage */}
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className={`absolute -inset-6 rounded-full blur-3xl transition-colors duration-700 ${current.halo}`}
                  />

                  <div className="relative h-[27rem] overflow-hidden rounded-3xl border border-white/10 bg-[#0B0F19]/90 shadow-2xl shadow-black/50 backdrop-blur">
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
                      <div className="flex gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className={`text-xs font-medium ${current.accent}`}>{current.title}</span>
                    </div>

                    <div key={active} className="iq-hero-in h-[calc(100%-3.1rem)]" style={{ '--d': '0ms' }}>
                      <StepVisual index={active} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile and tablet: simple stacked cards */
          <div className="relative mt-14 grid gap-6 pb-24 sm:grid-cols-2">
            {steps.map((step, index) => (
              <Reveal key={step.number} as="article" delay={(index % 2) * 120} className="relative">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl ${step.border} ${step.glow} ${step.accent}`}
                  >
                    {step.icon}
                  </div>

                  <span className="text-sm font-semibold tracking-widest text-slate-600">
                    STEP {step.number}
                  </span>
                </div>

                <SpotlightCard className="group mt-6 rounded-2xl border border-white/[0.06] bg-[#151B2B]/70 p-6">
                  <h3 className="iq-display text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{step.description}</p>
                  <div className={`mt-6 h-1 w-12 rounded-full ${step.bar}`} />
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default LandingWorkflow