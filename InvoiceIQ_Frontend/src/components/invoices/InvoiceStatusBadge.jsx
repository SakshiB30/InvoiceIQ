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
        className: 'bg-green-100 text-green-700',
      }
    }

    // Invoice is currently being processed
    if (
      processingStatus === 'PROCESSING' ||
      processingStatus === 'UPLOADING'
    ) {
      return {
        label: 'Processing',
        className: 'bg-yellow-100 text-yellow-700',
      }
    }

    // Invoice processing finished but validation failed
    if (validationValid === false) {
      return {
        label: 'Needs Review',
        className: 'bg-orange-100 text-orange-700',
      }
    }

    // Invoice was processed but still needs confirmation
    if (processingStatus === 'PENDING') {
      return {
        label: 'Pending Review',
        className: 'bg-blue-100 text-blue-700',
      }
    }

    // Fallback for unknown or missing status
    return {
      label: 'Pending Review',
      className: 'bg-slate-100 text-slate-600',
    }
  }

  const status = getStatus()

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
    >
      {status.label}
    </span>
  )
}

export default InvoiceStatusBadge