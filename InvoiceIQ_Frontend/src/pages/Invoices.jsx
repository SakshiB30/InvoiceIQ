import InvoiceHeader from '../components/invoices/InvoiceFilters'
import InvoiceFilters from '../components/invoices/InvoiceFilters'
import InvoiceTable from '../components/invoices/InvoiceTable'
import InvoiceUpload from '../components/invoices/InvoiceUpload'

function Invoices() {
  return (
    <div className="space-y-6">
      <InvoiceHeader />

      <InvoiceUpload/>
      <InvoiceFilters />
      <InvoiceTable />
    </div>
  )
}

export default Invoices