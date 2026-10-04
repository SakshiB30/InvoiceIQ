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
    if (
      currentPage > totalPages &&
      currentPage !== 1
    ) {
      dispatch(setPage(totalPages))
    }
  }, [
    currentPage,
    totalPages,
    dispatch,
  ])

  const startIndex =
    (currentPage - 1) * limit

  const endIndex =
    startIndex + limit

  const currentInvoices =
    invoices.slice(startIndex, endIndex)

  const showingFrom =
    totalInvoices === 0
      ? 0
      : startIndex + 1

  const showingTo =
    Math.min(endIndex, totalInvoices)

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

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-yellow-400" />

          <p className="mt-3 text-sm text-slate-500">
            Loading invoices...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
          ⚠️
        </div>

        <p className="mt-3 text-sm font-semibold text-red-600">
          Failed to load invoices
        </p>

        <p className="mt-1 text-xs text-red-500">
          {typeof error === 'string'
            ? error
            : 'Please try again.'}
        </p>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50 text-2xl">
          📄
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          No invoices found
        </h3>

        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
          No invoices match your current filters.
          Upload an invoice or clear your filters
          to see more results.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              All Invoices
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage your uploaded invoices.
            </p>
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1.5">
            <span className="text-xs font-medium text-slate-600">
              {totalInvoices}{' '}
              {totalInvoices === 1
                ? 'invoice'
                : 'invoices'}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">

                <th className="px-6 py-3.5 font-medium text-slate-500">
                  Invoice
                </th>

                <th className="px-6 py-3.5 font-medium text-slate-500">
                  Vendor
                </th>

                <th className="px-6 py-3.5 font-medium text-slate-500">
                  Category
                </th>

                <th className="px-6 py-3.5 font-medium text-slate-500">
                  Date
                </th>

                <th className="px-6 py-3.5 font-medium text-slate-500">
                  Amount
                </th>

                <th className="px-6 py-3.5 font-medium text-slate-500">
                  Status
                </th>

                <th className="px-6 py-3.5 text-right font-medium text-slate-500">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>
              {currentInvoices.map((invoice) => {
                const vendorName =
                  getVendorName(invoice)

                return (
                  <tr
                    key={invoice.id}
                    className="group border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                  >

                    {/* Invoice */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/invoices/${invoice.id}`,
                          )
                        }
                        className="text-left"
                      >
                        <p className="font-semibold text-slate-900 transition group-hover:text-yellow-600">
                          {invoice.invoiceNumber || '—'}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          Invoice
                        </p>
                      </button>
                    </td>

                    {/* Vendor */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                          {getVendorInitial(
                            vendorName,
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[180px] truncate font-medium text-slate-700">
                            {vendorName}
                          </p>

                          <p className="text-xs text-slate-400">
                            Supplier
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      {invoice.category ? (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {invoice.category}
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          —
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(
                        invoice.invoiceDate,
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {formatAmount(
                          invoice.totalAmount,
                        )}
                      </p>

                      {invoice.tax !== undefined &&
                        invoice.tax !== null && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            Tax:{' '}
                            {formatAmount(
                              invoice.tax,
                            )}
                          </p>
                        )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <InvoiceStatusBadge
                        invoice={invoice}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/invoices/${invoice.id}`,
                            )
                          }
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-700"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteClick(invoice)
                          }
                          disabled={deleteLoading}
                          className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-medium text-slate-700">
              {showingFrom}
            </span>
            {' '}to{' '}
            <span className="font-medium text-slate-700">
              {showingTo}
            </span>
            {' '}of{' '}
            <span className="font-medium text-slate-700">
              {totalInvoices}
            </span>
            {' '}
            {totalInvoices === 1
              ? 'invoice'
              : 'invoices'}
          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-yellow-400 px-3 text-sm font-semibold text-slate-900">
              {currentPage}
            </div>

            <span className="text-sm text-slate-400">
              of {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>

          </div>

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {invoiceToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-invoice-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-xl">
              🗑️
            </div>

            <h2
              id="delete-invoice-title"
              className="mt-4 text-lg font-semibold text-slate-900"
            >
              Delete this invoice?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This will permanently remove invoice{' '}
              <span className="font-semibold text-slate-700">
                {invoiceToDelete.invoiceNumber || 'this invoice'}
              </span>{' '}
              from your InvoiceIQ records.
            </p>

            <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3">
              <div className="flex items-start gap-2">
                <span className="text-sm">⚠️</span>

                <p className="text-xs leading-5 text-red-600">
                  This action cannot be undone. The invoice will
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
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}

                {deleteLoading
                  ? 'Deleting...'
                  : 'Delete Invoice'}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  )
}

export default InvoiceTable
