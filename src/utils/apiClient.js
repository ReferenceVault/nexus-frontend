import { store } from '../store'
import { setTokens, logout } from '../store/slices/authSlice'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false
let refreshPromise = null

/**
 * Decode JWT token to check expiry (without verification)
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token payload or null if invalid
 */
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    return null
  }
}

/**
 * Check if token is expired or will expire soon (within 1 minute)
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is expired or expiring soon
 */
const isTokenExpired = (token) => {
  if (!token) return true
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true
  
  // Check if token expires within 1 minute (buffer time)
  const expirationTime = decoded.exp * 1000 // Convert to milliseconds
  const currentTime = Date.now()
  const bufferTime = 60 * 1000 // 1 minute buffer
  
  return expirationTime - currentTime < bufferTime
}

/**
 * Refresh access token using refresh token
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 */
const refreshAccessToken = async () => {
  const state = store.getState()
  const refreshToken = state.auth.refreshToken
  
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Token refresh failed',
    }))
    throw new Error(error.message || 'Token refresh failed')
  }

  const data = await response.json()
  return data.tokens
}

/**
 * Attempt to refresh token with retry logic
 * Prevents multiple simultaneous refresh attempts
 */
const attemptTokenRefresh = async () => {
  // If already refreshing, wait for the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const tokens = await refreshAccessToken()
      
      // Update Redux store with new tokens
      store.dispatch(setTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }))
      
      return tokens.accessToken
    } catch (error) {
      // Refresh failed - logout user
      console.error('Token refresh failed:', error)
      store.dispatch(logout())
      throw error
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

/**
 * Get current access token, refreshing if needed
 * @returns {Promise<string>} - Valid access token
 */
const getValidAccessToken = async () => {
  const state = store.getState()
  let accessToken = state.auth.accessToken

  // Check if token is expired or expiring soon
  if (isTokenExpired(accessToken)) {
    try {
      accessToken = await attemptTokenRefresh()
    } catch (error) {
      // Refresh failed, user will be logged out
      throw new Error('Session expired. Please sign in again.')
    }
  }

  return accessToken
}

/**
 * Make authenticated API request with automatic token refresh
 * @param {string} url - API endpoint (relative to API_BASE_URL)
 * @param {RequestInit} options - Fetch options
 * @param {boolean} retryOn401 - Whether to retry on 401 (default: true)
 * @returns {Promise<Response>}
 */
export const authenticatedFetch = async (url, options = {}, retryOn401 = true) => {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`
  
  // Get valid access token (will refresh if needed)
  let accessToken
  try {
    accessToken = await getValidAccessToken()
  } catch (error) {
    // Token refresh failed, user is logged out
    throw error
  }

  // Check if body is FormData (don't set Content-Type for FormData, browser will set it with boundary)
  const isFormData = options.body instanceof FormData

  // Prepare request with token
  const requestOptions = {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }), // Only set Content-Type if not FormData
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  }

  // Make the request
  let response = await fetch(fullUrl, requestOptions)

  // Handle 401 Unauthorized - try refreshing token once
  if (response.status === 401 && retryOn401) {
    try {
      // Attempt to refresh token
      const newAccessToken = await attemptTokenRefresh()
      
      // Retry original request with new token
      requestOptions.headers.Authorization = `Bearer ${newAccessToken}`
      response = await fetch(fullUrl, requestOptions)
      
      // If still 401 after refresh, token refresh failed or user is invalid
      if (response.status === 401) {
        store.dispatch(logout())
        throw new Error('Session expired. Please sign in again.')
      }
    } catch (error) {
      // Refresh failed or retry failed
      if (error.message !== 'Session expired. Please sign in again.') {
        store.dispatch(logout())
      }
      throw new Error('Session expired. Please sign in again.')
    }
  }

  return response
}

/**
 * Handle API response errors
 * @param {Response} response - Fetch response
 * @returns {Promise<any>} - Parsed JSON or throws error
 */
export const handleApiError = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred',
    }))
    throw new Error(error.message || 'Request failed')
  }
  return response.json()
}

/**
 * Make unauthenticated API request
 * @param {string} url - API endpoint
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export const unauthenticatedFetch = async (url, options = {}) => {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`
  return fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

// Export token validation utilities
export { isTokenExpired, decodeToken, getValidAccessToken }

