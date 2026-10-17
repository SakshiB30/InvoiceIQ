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
  
  const {
    filters,
    invoices,
  } = useSelector((state) => state.invoices)

  const loadInvoices = useCallback(
    (invoiceFilters = {}) => {
      dispatch(fetchInvoices(invoiceFilters))
    },
    [dispatch],
  )

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    /*
     * If invoices already exist in Redux,
     * it means we are probably returning from
     * the Invoice Details page.
     *
     * In that case:
     * - keep the existing invoice list
     * - keep the existing filters
     * - keep the existing page
     * - do NOT fetch everything again
     */
    if (invoices.length > 0) {
      return
    }

    /*
     * First visit to the Invoices page.
     */
    loadInvoices()
  }, [
    invoices.length,
    loadInvoices,
  ])

  // ==========================================
  // FILTER CHANGE
  // ==========================================

  const handleFilterChange = useCallback(
    (newFilters) => {
      /*
       * Save the filters in Redux.
       *
       * This allows us to restore them when
       * coming back from Invoice Details.
       */
      dispatch(
        setInvoiceFilters({
          search: newFilters.search || '',
          category:
            newFilters.category || 'All',
          dateFilter:
            newFilters.dateFilter || 'All',
          fromDate:
            newFilters.fromDate || '',
          toDate:
            newFilters.toDate || '',
        }),
      )

      /*
       * Whenever filters change,
       * return to page 1.
       */
      dispatch(setPage(1))

      /*
       * Fetch filtered invoices.
       */
      loadInvoices({
        search:
          newFilters.search || undefined,

        category:
          newFilters.category || undefined,

        fromDate:
          newFilters.fromDate || undefined,

        toDate:
          newFilters.toDate || undefined,
      })
    },
    [dispatch, loadInvoices],
  )

  // ==========================================
  // UPLOAD SUCCESS
  // ==========================================

  const handleUploadSuccess = useCallback(
  (processingResult) => {
    const invoiceId = processingResult?.savedInvoiceId

    if (invoiceId) {
      navigate(`/invoices/${invoiceId}`)
      return
    }

    // Fallback if the response doesn't contain an ID.
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
    <div className="space-y-6">

      <InvoiceHeader />

      <InvoiceUpload
        onUploadSuccess={handleUploadSuccess}
      />

      <InvoiceFilters
        onFilterChange={handleFilterChange}
      />

      <InvoiceTable />

    </div>
  )
}

export default Invoices