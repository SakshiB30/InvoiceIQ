import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit'

import expenseService from '../../services/expenseService'

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  expenses: [],

  loading: false,
  error: null,

  filters: {
    search: '',
    category: 'All',
    dateFilter: 'This Month',
    fromDate: '',
    toDate: '',
  },
}

// ==========================================
// FETCH EXPENSES
// ==========================================

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await expenseService.getExpenses(filters)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Failed to fetch expenses.',
      )
    }
  },
)

// ==========================================
// SLICE
// ==========================================

const expenseSlice = createSlice({
  name: 'expenses',

  initialState,

  reducers: {
    setExpenseFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      }
    },

    clearExpenseFilters: (state) => {
      state.filters = {
        search: '',
        category: 'All',
        dateFilter: 'This Month',
        fromDate: '',
        toDate: '',
      }
    },

    clearExpenseError: (state) => {
      state.error = null
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================================
      // FETCH EXPENSES - PENDING
      // ==========================================

      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true
        state.error = null
      })

      // ==========================================
      // FETCH EXPENSES - SUCCESS
      // ==========================================

      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false
        state.error = null

        state.expenses = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.content || []
      })

      // ==========================================
      // FETCH EXPENSES - FAILED
      // ==========================================

      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.payload ||
          'Failed to fetch expenses.'
      })
  },
})

// ==========================================
// ACTIONS
// ==========================================

export const {
  setExpenseFilters,
  clearExpenseFilters,
  clearExpenseError,
} = expenseSlice.actions

// ==========================================
// REDUCER
// ==========================================

export default expenseSlice.reducer