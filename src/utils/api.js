import { store } from '../store'
import { authenticatedFetch, unauthenticatedFetch, handleApiError } from './apiClient'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Helper to get auth token from Redux store (for backward compatibility)
const getAuthToken = () => {
  const state = store.getState()
  return state.auth.accessToken
}

// API client with automatic token injection
export const api = {
  async signup(email, firstName, lastName, password) {
    const response = await unauthenticatedFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, firstName, lastName, password }),
    })
    return handleApiError(response)
  },

  async login(email, password) {
    const response = await unauthenticatedFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    return handleApiError(response)
  },

  async getCurrentUser() {
    const response = await authenticatedFetch('/users/me')
    return handleApiError(response)
  },

  async refreshToken() {
    // This is now handled automatically by authenticatedFetch
    // Keeping for backward compatibility but it's not needed
    const response = await unauthenticatedFetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ 
        refreshToken: store.getState().auth.refreshToken 
      }),
    })
    return handleApiError(response)
  },

  async logout() {
    try {
      await authenticatedFetch('/auth/logout', {
        method: 'POST',
      }, false) // Don't retry on 401 for logout
    } catch (error) {
      console.error('Logout API error:', error)
    }
    return { success: true }
  },

  async forgotPassword(email) {
    const response = await unauthenticatedFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    return handleApiError(response)
  },

  async resetPassword(token, newPassword) {
    const response = await unauthenticatedFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    })
    return handleApiError(response)
  },

  async updateProfile(profileData) {
    const response = await authenticatedFetch('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    })
    return handleApiError(response)
  },

  async uploadResume(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await authenticatedFetch('/resumes/upload', {
      method: 'POST',
      body: formData,
    })
    return handleApiError(response)
  },

  async getUserResumes() {
    const response = await authenticatedFetch('/resumes')
    return handleApiError(response)
  },

  async uploadVideo(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await authenticatedFetch('/videos/upload', {
      method: 'POST',
      body: formData,
    })
    return handleApiError(response)
  },

  async getUserVideos() {
    const response = await authenticatedFetch('/videos')
    return handleApiError(response)
  },

  // Generic authenticated request helper (now uses authenticatedFetch)
  async authenticatedRequest(url, options = {}) {
    const response = await authenticatedFetch(url, options)
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
