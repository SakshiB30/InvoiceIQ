function InvoiceStatusBadge({ status }) {
  const statusStyles = {
    Verified: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Review: 'bg-orange-100 text-orange-700',
    Rejected: 'bg-red-100 text-red-700',
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        statusStyles[status] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {status}
    </span>
  )
}

export default InvoiceStatusBadge