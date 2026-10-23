function InvoiceStatusBadge({ invoice }) {
  const getStatus = () => {
    const processingStatus =
      invoice?.processingStatus

    const validationValid =
      invoice?.validation?.valid

    // Invoice has been confirmed successfully
    if (processingStatus === 'COMPLETED') {
      return {
        label: 'Verified',
        className:
          'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
        dotClassName: 'bg-emerald-400',
      }
    }

    // Invoice is currently being processed
    if (
      processingStatus === 'PROCESSING' ||
      processingStatus === 'UPLOADING'
    ) {
      return {
        label: 'Processing',
        className:
          'border-amber-500/20 bg-amber-500/10 text-amber-300',
        dotClassName: 'bg-amber-400 animate-pulse',
      }
    }

    // Invoice processing finished but validation failed
    if (validationValid === false) {
      return {
        label: 'Needs Review',
        className:
          'border-orange-500/20 bg-orange-500/10 text-orange-300',
        dotClassName: 'bg-orange-400',
      }
    }

    // Invoice was processed but still needs confirmation
    if (processingStatus === 'PENDING') {
      return {
        label: 'Pending Review',
        className:
          'border-indigo-500/20 bg-indigo-500/10 text-indigo-300',
        dotClassName: 'bg-indigo-400',
      }
    }

    // Fallback for unknown or missing status
    return {
      label: 'Pending Review',
      className:
        'border-slate-600/40 bg-slate-700/30 text-slate-300',
      dotClassName: 'bg-slate-400',
    }
  }

  const status = getStatus()

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${status.className}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${status.dotClassName}`}
        aria-hidden="true"
      />

      {status.label}
    </span>
  )
}

export default InvoiceStatusBadge
