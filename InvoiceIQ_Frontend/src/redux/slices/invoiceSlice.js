import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import invoiceService from '../../services/invoiceService'

const initialState = {
  invoices: [],
  selectedInvoice: null,

  processingResult: null,

  // Loading states
  loading: false,
  invoiceDetailsLoading: false,
  uploadLoading: false,
  updateLoading: false,
  revalidateLoading: false,

  // Errors
  error: null,
  invoiceDetailsError: null,
  uploadError: null,
  updateError: null,
  revalidateError: null,

  // AI Insights
  aiInsights: null,
  aiInsightsLoading: false,
  aiInsightsError: null,

  // Invoice list filters
  filters: {
    search: '',
    category: 'All',
    dateFilter: 'All',
    fromDate: '',
    toDate: '',
  },

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
}

// ==========================================
// FETCH INVOICES
// ==========================================

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await invoiceService.getInvoices(filters)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Failed to fetch invoices.',
      )
    }
  },
)

// ==========================================
// FETCH SINGLE INVOICE
// ==========================================

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (id, { rejectWithValue }) => {
    try {
      return await invoiceService.getInvoiceById(id)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Failed to fetch invoice.',
      )
    }
  },
)

// ==========================================
// UPLOAD INVOICE
// ==========================================

export const uploadInvoice = createAsyncThunk(
  'invoices/uploadInvoice',
  async (file, { rejectWithValue }) => {
    try {
      return await invoiceService.uploadInvoice(file)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Invoice upload failed.',
      )
    }
  },
)

// ==========================================
// UPDATE INVOICE
// ==========================================

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async (
    { id, invoiceData },
    { rejectWithValue },
  ) => {
    try {
      return await invoiceService.updateInvoice(
        id,
        invoiceData,
      )
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Failed to update invoice.',
      )
    }
  },
)

// ==========================================
// REVALIDATE INVOICE
// ==========================================

export const revalidateInvoice = createAsyncThunk(
  'invoices/revalidateInvoice',
  async (id, { rejectWithValue }) => {
    try {
      return await invoiceService.revalidateInvoice(id)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Failed to revalidate invoice.',
      )
    }
  },
)

// ==========================================
// DELETE INVOICE
// ==========================================

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await invoiceService.deleteInvoice(id)

      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Failed to delete invoice.',
      )
    }
  },
)

// ==========================================
// CONFIRM INVOICE
// ==========================================

export const confirmInvoice = createAsyncThunk(
  'invoices/confirmInvoice',
  async (id, { rejectWithValue }) => {
    try {
      return await invoiceService.confirmInvoice(id)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Failed to confirm invoice.',
      )
    }
  },
)

// ==========================================
// AI INSIGHTS
// ==========================================

export const fetchAIInsights = createAsyncThunk(
  'invoices/fetchAIInsights',
  async (_, { rejectWithValue }) => {
    try {
      return await invoiceService.getAIInsights()
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Failed to generate AI insights.',
      )
    }
  },
)

// ==========================================
// SLICE
// ==========================================

const invoiceSlice = createSlice({
  name: 'invoices',

  initialState,

  reducers: {
    setSelectedInvoice: (state, action) => {
      state.selectedInvoice = action.payload
    },

    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null
      state.invoiceDetailsError = null
    },

    // ------------------------------------------
    // Save complete invoice filter state
    // ------------------------------------------

    setInvoiceFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      }
    },

    setSearchFilter: (state, action) => {
      state.filters.search = action.payload
    },

    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload
    },

    setDateFilter: (state, action) => {
      state.filters.dateFilter = action.payload
    },

    setPage: (state, action) => {
      state.pagination.page = action.payload
    },

    clearInvoiceError: (state) => {
      state.error = null
      state.invoiceDetailsError = null
      state.uploadError = null
      state.updateError = null
      state.revalidateError = null
    },

    clearProcessingResult: (state) => {
      state.processingResult = null
    },

    clearAIInsights: (state) => {
      state.aiInsights = null
      state.aiInsightsError = null
    },

    clearUpdateError: (state) => {
      state.updateError = null
    },

    clearRevalidateError: (state) => {
      state.revalidateError = null
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================================
      // FETCH INVOICES
      // ==========================================

      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false

        state.invoices = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.content || []

        state.pagination.total = Array.isArray(
          action.payload,
        )
          ? action.payload.length
          : action.payload?.totalElements || 0

        state.error = null
      })

      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ==========================================
      // FETCH SINGLE INVOICE
      // ==========================================

      .addCase(fetchInvoiceById.pending, (state) => {
        state.invoiceDetailsLoading = true
        state.invoiceDetailsError = null

        // IMPORTANT:
        // Do NOT clear selectedInvoice here.
        //
        // This prevents the UI from temporarily
        // showing "Invoice not found" while the
        // backend is fetching the invoice.
      })

      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.invoiceDetailsLoading = false
        state.selectedInvoice = action.payload
        state.invoiceDetailsError = null
      })

      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.invoiceDetailsLoading = false
        state.selectedInvoice = null
        state.invoiceDetailsError = action.payload
      })

      // ==========================================
      // UPLOAD INVOICE
      // ==========================================

      .addCase(uploadInvoice.pending, (state) => {
        state.uploadLoading = true
        state.uploadError = null
        state.processingResult = null
      })

      .addCase(uploadInvoice.fulfilled, (state, action) => {
        state.uploadLoading = false
        state.uploadError = null
        state.processingResult = action.payload

        // Existing insights are outdated.
        state.aiInsights = null
      })

      .addCase(uploadInvoice.rejected, (state, action) => {
        state.uploadLoading = false
        state.uploadError = action.payload
      })

      // ==========================================
      // UPDATE INVOICE
      // ==========================================

      .addCase(updateInvoice.pending, (state) => {
        state.updateLoading = true
        state.updateError = null
      })

      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.updateLoading = false
        state.updateError = null

        const updatedInvoice = action.payload

        state.selectedInvoice = updatedInvoice

        const index = state.invoices.findIndex(
          (invoice) =>
            invoice.id === updatedInvoice.id,
        )

        if (index !== -1) {
          state.invoices[index] = updatedInvoice
        }

        state.aiInsights = null
      })

      .addCase(updateInvoice.rejected, (state, action) => {
        state.updateLoading = false
        state.updateError = action.payload
      })

      // ==========================================
      // REVALIDATE INVOICE
      // ==========================================

      .addCase(revalidateInvoice.pending, (state) => {
        state.revalidateLoading = true
        state.revalidateError = null
      })

      .addCase(revalidateInvoice.fulfilled, (state, action) => {
        state.revalidateLoading = false
        state.revalidateError = null

        const validatedInvoice = action.payload

        state.selectedInvoice = validatedInvoice

        const index = state.invoices.findIndex(
          (invoice) =>
            invoice.id === validatedInvoice.id,
        )

        if (index !== -1) {
          state.invoices[index] = validatedInvoice
        }
      })

      .addCase(revalidateInvoice.rejected, (state, action) => {
        state.revalidateLoading = false
        state.revalidateError = action.payload
      })

      // ==========================================
      // DELETE INVOICE
      // ==========================================

      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter(
          (invoice) => invoice.id !== action.payload,
        )

        state.pagination.total = state.invoices.length

        state.aiInsights = null

        if (
          state.selectedInvoice?.id === action.payload
        ) {
          state.selectedInvoice = null
        }
      })

      .addCase(deleteInvoice.rejected, (state, action) => {
        state.error = action.payload
      })

      // ==========================================
      // CONFIRM INVOICE
      // ==========================================

      .addCase(confirmInvoice.fulfilled, (state, action) => {
        const updatedInvoice = action.payload

        const index = state.invoices.findIndex(
          (invoice) =>
            invoice.id === updatedInvoice.id,
        )

        if (index !== -1) {
          state.invoices[index] = updatedInvoice
        }

        if (
          state.selectedInvoice?.id ===
          updatedInvoice.id
        ) {
          state.selectedInvoice = updatedInvoice
        }

        state.aiInsights = null
      })

      .addCase(confirmInvoice.rejected, (state, action) => {
        state.error = action.payload
      })

      // ==========================================
      // FETCH AI INSIGHTS
      // ==========================================

      .addCase(fetchAIInsights.pending, (state) => {
        state.aiInsightsLoading = true
        state.aiInsightsError = null
      })

      .addCase(fetchAIInsights.fulfilled, (state, action) => {
        state.aiInsightsLoading = false
        state.aiInsights = action.payload
        state.aiInsightsError = null
      })

      .addCase(fetchAIInsights.rejected, (state, action) => {
        state.aiInsightsLoading = false
        state.aiInsightsError =
          action.payload ||
          'Failed to generate AI insights.'
      })
  },
})

// ==========================================
// ACTIONS
// ==========================================

export const {
  setSelectedInvoice,
  clearSelectedInvoice,
  setInvoiceFilters,
  setSearchFilter,
  setCategoryFilter,
  setDateFilter,
  setPage,
  clearInvoiceError,
  clearProcessingResult,
  clearAIInsights,
  clearUpdateError,
  clearRevalidateError,
} = invoiceSlice.actions

// ==========================================
// REDUCER
// ==========================================

export default invoiceSlice.reducer