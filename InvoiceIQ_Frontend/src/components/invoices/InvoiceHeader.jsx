import { useNavigate } from 'react-router-dom'

function InvoiceHeader() {
  const navigate = useNavigate()

  const handleUploadInvoice = () => {
    navigate('/invoices#upload')
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Invoices
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage, review, and track all your invoices.
        </p>
      </div>

      <button
        type="button"
        onClick={handleUploadInvoice}
        className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500"
      >
        + Upload Invoice
      </button>
    </div>
  )
}

export default InvoiceHeader