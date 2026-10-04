import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ExpenseHeader from '../components/expenses/ExpenseHeader'
import ExpenseSummary from '../components/expenses/ExpenseSummary'
import ExpenseFilters from '../components/expenses/ExpenseFilters'
import ExpenseTable from '../components/expenses/ExpenseTable'

import {
  fetchExpenses,
  setExpenseFilters,
} from '../redux/slices/expenseSlice'

function Expenses() {
  const dispatch = useDispatch()

  const filters = useSelector(
    (state) => state.expenses.filters,
  )

  const loadExpenses = useCallback(
    (expenseFilters = {}) => {
      dispatch(fetchExpenses(expenseFilters))
    },
    [dispatch],
  )

  useEffect(() => {
    loadExpenses({
      category:
        filters.category !== 'All'
          ? filters.category
          : undefined,
      search:
        filters.search || undefined,
      fromDate:
        filters.fromDate || undefined,
      toDate:
        filters.toDate || undefined,
    })
  }, [
    loadExpenses,
    filters.category,
    filters.search,
    filters.fromDate,
    filters.toDate,
  ])

  const handleFilterChange = useCallback(
    (newFilters) => {
      dispatch(
        setExpenseFilters(newFilters),
      )
    },
    [dispatch],
  )

  return (
    <div className="space-y-6">
      <ExpenseHeader />

      <ExpenseSummary />

      <ExpenseFilters
        onFilterChange={handleFilterChange}
      />

      <ExpenseTable />
    </div>
  )
}

export default Expenses