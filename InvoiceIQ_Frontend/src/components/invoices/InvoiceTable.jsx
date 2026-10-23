import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import InvoiceStatusBadge from './InvoiceStatusBadge'
import {
  deleteInvoice,
  setPage,
} from '../../redux/slices/invoiceSlice'

function formatDate(date) {
  if (!date) {
    return '—'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatAmount(amount) {
  if (amount === null || amount === undefined) {
    return '₹0'
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount)
}

function getVendorName(invoice) {
  return (
    invoice.vendor?.name ||
    invoice.vendorName ||
    'Unknown Vendor'
  )
}

function getVendorInitial(name) {
  if (!name || name === 'Unknown Vendor') {
    return '?'
  }

  return name.charAt(0).toUpperCase()
}

function InvoiceTable() {
  const {
    invoices,
    loading,
    error,
    pagination,
  } = useSelector((state) => state.invoices)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [invoiceToDelete, setInvoiceToDelete] =
    useState(null)

  const [deleteLoading, setDeleteLoading] =
    useState(false)

  const currentPage = pagination.page
  const limit = pagination.limit

  const totalInvoices = invoices.length

  const totalPages = Math.max(
    1,
    Math.ceil(totalInvoices / limit),
  )

  useEffect(() => {
    if (currentPage > totalPages && currentPage !== 1) {
      dispatch(setPage(totalPages))
    }
  }, [currentPage, totalPages, dispatch])

  const startIndex = (currentPage - 1) * limit
  const endIndex = startIndex + limit

  const currentInvoices = invoices.slice(
    startIndex,
    endIndex,
  )

  const showingFrom =
    totalInvoices === 0 ? 0 : startIndex + 1

  const showingTo = Math.min(
    endIndex,
    totalInvoices,
  )

  const handleDeleteClick = (invoice) => {
    if (deleteLoading) {
      return
    }

    setInvoiceToDelete(invoice)
  }

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete?.id || deleteLoading) {
      return
    }

    setDeleteLoading(true)

    try {
      const result = await dispatch(
        deleteInvoice(invoiceToDelete.id),
      )

      if (deleteInvoice.fulfilled.match(result)) {
        setInvoiceToDelete(null)
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDeleteCancel = () => {
    if (deleteLoading) {
      return
    }

    setInvoiceToDelete(null)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(setPage(currentPage - 1))
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setPage(currentPage + 1))
    }
  }

  const navigateToInvoice = (invoice) => {
    navigate(`/invoices/${invoice.id}`)
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-[#151B2B] p-12 shadow-lg shadow-black/10">
        <div className="flex flex-col items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

          <p className="mt-4 text-sm font-medium text-slate-300">
            Loading invoices...
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Retrieving your invoice records
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-[#151B2B] p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.3 3.86 1.82 18.5A2 2 0 0 0 3.55 21h16.9a2 2 0 0 0 1.73-3L13.7 3.86a2 2 0 0 0-3.4 0Z"
            />
          </svg>
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-100">
          Failed to load invoices
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
          {typeof error === 'string'
            ? error
            : 'Something went wrong while retrieving your invoices. Please try again.'}
        </p>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-[#151B2B] px-6 py-14 text-center shadow-lg shadow-black/10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 3.75h7l5 5v11.5H7a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 4v5h5M9 14h6m-6 3h6"
            />
          </svg>
        </div>

        <h3 className="mt-5 text-lg font-semibold text-slate-100">
          No invoices found
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
          No invoices match your current filters. Upload an invoice
          or clear your filters to see more results.
        </p>
      </div>
    )
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#151B2B] shadow-lg shadow-black/10">
        {/* Table header */}
        <div className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 3.75h7l5 5v11.5H7a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 4v5h5M9 14h6m-6 3h6"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-100">
                  All Invoices
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  View and manage your uploaded invoices.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-slate-700/70 bg-slate-800/50 px-3.5 py-2 sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />

            <span className="text-sm font-medium text-slate-300">
              {totalInvoices}{' '}
              {totalInvoices === 1 ? 'invoice' : 'invoices'}
            </span>
          </div>
        </div>

        {/* Invoice table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-[#101625]/80">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Invoice
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Vendor
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Category
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/70">
              {currentInvoices.map((invoice) => {
                const vendorName = getVendorName(invoice)

                return (
                  <tr
                    key={invoice.id}
                    className="group transition-colors duration-200 hover:bg-slate-800/30"
                  >
                    {/* Invoice */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => navigateToInvoice(invoice)}
                        className="group/invoice rounded-md text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        <p className="font-semibold text-slate-200 transition-colors group-hover/invoice:text-indigo-300">
                          {invoice.invoiceNumber || '—'}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Invoice record
                        </p>
                      </button>
                    </td>

                    {/* Vendor */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/15 bg-cyan-500/10 text-sm font-semibold text-cyan-300">
                          {getVendorInitial(vendorName)}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[180px] truncate font-medium text-slate-200">
                            {vendorName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Supplier
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      {invoice.category ? (
                        <span className="inline-flex rounded-lg border border-slate-700/80 bg-slate-800/60 px-2.5 py-1.5 text-xs font-medium text-slate-300">
                          {invoice.category}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                      {formatDate(invoice.invoiceDate)}
                    </td>

                    {/* Amount */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <p className="font-semibold text-slate-100">
                        {formatAmount(invoice.totalAmount)}
                      </p>

                      {invoice.tax !== undefined &&
                        invoice.tax !== null && (
                          <p className="mt-1 text-xs text-slate-500">
                            Tax: {formatAmount(invoice.tax)}
                          </p>
                        )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <InvoiceStatusBadge invoice={invoice} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => navigateToInvoice(invoice)}
                          className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteClick(invoice)}
                          disabled={deleteLoading}
                          className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs font-medium text-rose-300 transition hover:border-rose-500/40 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-400">
            Showing{' '}
            <span className="font-medium text-slate-200">
              {showingFrom}
            </span>{' '}
            to{' '}
            <span className="font-medium text-slate-200">
              {showingTo}
            </span>{' '}
            of{' '}
            <span className="font-medium text-slate-200">
              {totalInvoices}
            </span>{' '}
            {totalInvoices === 1 ? 'invoice' : 'invoices'}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span aria-hidden="true">← </span>
              Previous
            </button>

            <div className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-3 text-sm font-semibold text-indigo-300">
              {currentPage}
            </div>

            <span className="px-1 text-sm text-slate-500">
              of {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <span aria-hidden="true"> →</span>
            </button>
          </div>
        </div>
      </section>

      {/* Delete confirmation modal */}
      {invoiceToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050811]/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-invoice-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-700/80 bg-[#151B2B] p-6 shadow-2xl shadow-black/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M10 11v6m4-6v6M5 7l1 13h12l1-13M9 7V4h6v3"
                />
              </svg>
            </div>

            <h2
              id="delete-invoice-title"
              className="mt-5 text-lg font-semibold text-slate-100"
            >
              Delete this invoice?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              This will permanently remove invoice{' '}
              <span className="font-semibold text-slate-200">
                {invoiceToDelete.invoiceNumber || 'this invoice'}
              </span>{' '}
              from your InvoiceIQ records.
            </p>

            <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5">
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="mt-0.5 h-5 w-5 shrink-0 text-rose-400"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.3 3.86 1.82 18.5A2 2 0 0 0 3.55 21h16.9a2 2 0 0 0 1.73-3L13.7 3.86a2 2 0 0 0-3.4 0Z"
                  />
                </svg>

                <p className="text-xs leading-5 text-rose-300/90">
                  This action cannot be undone. This invoice will
                  also no longer be included in your dashboard
                  spending and AI insight calculations.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleDeleteCancel}
                disabled={deleteLoading}
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/15 px-4 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-rose-300/30 border-t-rose-300" />
                )}

                {deleteLoading ? 'Deleting...' : 'Delete Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InvoiceTable
