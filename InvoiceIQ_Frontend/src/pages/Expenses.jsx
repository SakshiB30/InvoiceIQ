import ExpenseHeader from '../components/expenses/ExpenseHeader'
import ExpenseSummary from '../components/expenses/ExpenseSummary'
import ExpenseFilters from '../components/expenses/ExpenseFilters'
import ExpenseTable from '../components/expenses/ExpenseTable'

function Expenses() {
  return (
    <div className="space-y-6">
      <ExpenseHeader />
      <ExpenseSummary />
      <ExpenseFilters />
      <ExpenseTable />
    </div>
  )
}

export default Expenses