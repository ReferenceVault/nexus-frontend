import { store } from '../store'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Helper to get auth token from Redux store
const getAuthToken = () => {
  const state = store.getState()
  return state.auth.accessToken
}

// Helper to handle API errors
const handleApiError = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred',
    }))
    throw new Error(error.message || 'Request failed')
  }
  return response.json()
}

// API client with automatic token injection
export const api = {
  async signup(email, firstName, lastName, password) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, firstName, lastName, password }),
    })
    return handleApiError(response)
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return handleApiError(response)
  },

  async getCurrentUser() {
    const token = getAuthToken()
    if (!token) {
      throw new Error('No authentication token')
    }
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return handleApiError(response)
  },

  async refreshToken() {
    const state = store.getState()
    const refreshToken = state.auth.refreshToken
    if (!refreshToken) {
      throw new Error('No refresh token')
    }
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    return handleApiError(response)
  },

  async logout() {
    const token = getAuthToken()
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch (error) {
        console.error('Logout API error:', error)
      }
    }
    return { success: true }
  },

  async forgotPassword(email) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    return handleApiError(response)
  },

  async resetPassword(token, newPassword) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    })
    return handleApiError(response)
  },

  // Generic authenticated request helper
  async authenticatedRequest(url, options = {}) {
    const token = getAuthToken()
    if (!token) {
      throw new Error('No authentication token')
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })
    return handleApiError(response)
  },
}

// Legacy authStorage for backward compatibility (deprecated - use Redux)
export const authStorage = {
  getAccessToken: () => getAuthToken(),
  getRefreshToken: () => {
    const state = store.getState()
    return state.auth.refreshToken
  },
  getUserData: () => {
    const state = store.getState()
    return state.auth.user
  },
  getSignupData: () => {
    const state = store.getState()
    return state.auth.signupData
  },
  // These methods are kept for migration but should use Redux actions
  setTokens: (accessToken, refreshToken) => {
    store.dispatch({ type: 'auth/setTokens', payload: { accessToken, refreshToken } })
  },
  setUserData: (userData) => {
    store.dispatch({ type: 'auth/setUser', payload: userData })
  },
  clearTokens: () => {
    store.dispatch({ type: 'auth/logout' })
  },
  clearUserData: () => {
    store.dispatch({ type: 'auth/logout' })
  },
  setSignupData: (firstName, lastName, email) => {
    store.dispatch({
      type: 'auth/setSignupData',
      payload: { firstName, lastName, email },
    })
  },
  clearSignupData: () => {
    store.dispatch({ type: 'auth/clearSignupData' })
  },
}
