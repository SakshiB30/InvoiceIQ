import axiosClient from '../api/axiosClient'

const getExpenses = async (filters = {}) => {
  const response = await axiosClient.get(
    '/api/invoices',
    {
      params: {
        search: filters.search || undefined,
        category:
          filters.category &&
          filters.category !== 'All'
            ? filters.category
            : undefined,
        fromDate:
          filters.fromDate || undefined,
        toDate:
          filters.toDate || undefined,
      },
    },
  )

  return response.data
}

const expenseService = {
  getExpenses,
}

export default expenseService