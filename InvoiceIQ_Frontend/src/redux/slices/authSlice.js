import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import authService from '../../services/authService'

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: Boolean(localStorage.getItem('token')),

  loading: false,
  error: null,
}

// Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const token = await authService.login(credentials)

      return token
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Login failed. Please try again.',
      )
    }
  },
)

// Register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Registration failed. Please try again.',
      )
    }
  },
)

// Get current user
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getCurrentUser()

      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Unable to fetch user.',
      )
    }
  },
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await authService.updateProfile(profileData)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Profile update failed. Please try again.',
      )
    }
  },
)

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null

      localStorage.removeItem('token')
    },

    clearAuthError: (state) => {
      state.error = null
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = null

        // Backend returns JWT directly as a String
        state.token = action.payload
        state.isAuthenticated = true

        // Store JWT for Axios interceptor
        localStorage.setItem('token', action.payload)
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.payload
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })

      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = action.payload

        localStorage.removeItem('token')
      })

            .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  logout,
  clearAuthError,
} = authSlice.actions

export default authSlice.reducer