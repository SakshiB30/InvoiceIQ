import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import InvoiceHeader from '../components/invoices/InvoiceHeader'
import InvoiceFilters from '../components/invoices/InvoiceFilters'
import InvoiceTable from '../components/invoices/InvoiceTable'
import InvoiceUpload from '../components/invoices/InvoiceUpload'

import {
  fetchInvoices,
  setInvoiceFilters,
  setPage,
} from '../redux/slices/invoiceSlice'

function Invoices() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { filters, invoices } = useSelector(
    (state) => state.invoices,
  )

  const loadInvoices = useCallback(
    (invoiceFilters = {}) => {
      dispatch(fetchInvoices(invoiceFilters))
    },
    [dispatch],
  )

  // Initial load: preserve the existing Redux invoice list.
  useEffect(() => {
    if (invoices.length > 0) {
      return
    }

    loadInvoices()
  }, [invoices.length, loadInvoices])

  // Save filters, reset pagination, and fetch matching invoices.
  const handleFilterChange = useCallback(
    (newFilters) => {
      dispatch(
        setInvoiceFilters({
          search: newFilters.search || '',
          category: newFilters.category || 'All',
          dateFilter: newFilters.dateFilter || 'All',
          fromDate: newFilters.fromDate || '',
          toDate: newFilters.toDate || '',
        }),
      )

      dispatch(setPage(1))

      loadInvoices({
        search: newFilters.search || undefined,
        category: newFilters.category || undefined,
        fromDate: newFilters.fromDate || undefined,
        toDate: newFilters.toDate || undefined,
      })
    },
    [dispatch, loadInvoices],
  )

  // Navigate to the newly uploaded invoice when its ID is available.
  const handleUploadSuccess = useCallback(
    (processingResult) => {
      const invoiceId = processingResult?.savedInvoiceId

      if (invoiceId) {
        navigate(`/invoices/${invoiceId}`)
        return
      }

      // Fallback when the upload response has no saved invoice ID.
      dispatch(setPage(1))

      loadInvoices({
        search: filters.search || undefined,
        category:
          filters.category !== 'All'
            ? filters.category
            : undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
      })
    },
    [dispatch, filters, loadInvoices, navigate],
  )

  return (
    <div className="min-w-0 space-y-6">
      <InvoiceHeader />

      <InvoiceUpload onUploadSuccess={handleUploadSuccess} />

      <InvoiceFilters onFilterChange={handleFilterChange} />

      <InvoiceTable />
    </div>
  )
}

export default Invoices
