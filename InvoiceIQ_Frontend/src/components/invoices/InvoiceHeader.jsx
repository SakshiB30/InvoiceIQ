import { useNavigate } from 'react-router-dom'

function InvoiceHeader() {
  const navigate = useNavigate()

  const handleUploadInvoice = () => {
    navigate('/invoices#upload')
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#303454] bg-[#151B2B] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] sm:p-7">
      {/* Decorative background accents */}
      <div
        className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">
              Invoice management
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
            Invoices
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Manage, review, and track your invoices in one place.
            Let AI help simplify your invoice workflow.
          </p>
        </div>

        <button
          type="button"
          onClick={handleUploadInvoice}
          className="iq-primary-button relative shrink-0 self-start px-5 py-3 sm:self-center"
        >
          <span className="text-lg leading-none" aria-hidden="true">
            +
          </span>
          <span>Upload invoice</span>
        </button>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#263148] pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-indigo-400" />
          AI-powered processing
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          Invoice validation
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Centralized tracking
        </div>
      </div>
    </section>
  )
}

export default InvoiceHeader
