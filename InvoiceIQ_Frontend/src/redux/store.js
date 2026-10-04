import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import invoiceReducer from './slices/invoiceSlice'
import expenseReducer from './slices/expenseSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    invoices: invoiceReducer,
    expenses: expenseReducer,
  },
})

export default store