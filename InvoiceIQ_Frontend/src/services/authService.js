import axiosClient from '../api/axiosClient'

const login = async (credentials) => {
  const response = await axiosClient.post('/api/auth/login', credentials)

  return response.data
}

const register = async (userData) => {
  const response = await axiosClient.post('/api/auth/register', userData)

  return response.data
}

const getCurrentUser = async () => {
  const response = await axiosClient.get('/api/auth/me')

  return response.data
}

const updateProfile = async (profileData) => {
  const response = await axiosClient.put(
    '/api/auth/profile',
    profileData,
  )

  return response.data
} 

const authService = {
  login,
  register,
  getCurrentUser,
  updateProfile,
}

export default authService