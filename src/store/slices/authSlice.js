import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  signupData: {
    firstName: null,
    lastName: null,
    email: null,
  },
}

// Load initial state from localStorage (only on app start)
const loadInitialState = () => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const userData = localStorage.getItem('userData')
    
    if (accessToken && userData) {
      return {
        ...initialState,
        accessToken,
        refreshToken,
        user: JSON.parse(userData),
        isAuthenticated: true,
      }
    }
  } catch (error) {
    console.error('Error loading initial state:', error)
  }
  return initialState
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearError: (state) => {
      state.error = null
    },
    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      
      // Persist to localStorage
      if (accessToken) localStorage.setItem('accessToken', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      
      // Persist to localStorage
      if (action.payload) {
        localStorage.setItem('userData', JSON.stringify(action.payload))
      }
    },
    loginSuccess: (state, action) => {
      const { user, tokens } = action.payload
      state.user = user
      state.accessToken = tokens.accessToken
      state.refreshToken = tokens.refreshToken
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
      
      // Persist to localStorage
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      localStorage.setItem('userData', JSON.stringify(user))
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      state.signupData = {
        firstName: null,
        lastName: null,
        email: null,
      }
      
      // Clear localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userData')
      localStorage.removeItem('signupFirstName')
      localStorage.removeItem('signupLastName')
      localStorage.removeItem('signupEmail')
    },
    setSignupData: (state, action) => {
      state.signupData = action.payload
      
      // Persist to localStorage (for backward compatibility during migration)
      if (action.payload.firstName) {
        localStorage.setItem('signupFirstName', action.payload.firstName)
      }
      if (action.payload.lastName) {
        localStorage.setItem('signupLastName', action.payload.lastName)
      }
      if (action.payload.email) {
        localStorage.setItem('signupEmail', action.payload.email)
      }
    },
    clearSignupData: (state) => {
      state.signupData = {
        firstName: null,
        lastName: null,
        email: null,
      }
      
      localStorage.removeItem('signupFirstName')
      localStorage.removeItem('signupLastName')
      localStorage.removeItem('signupEmail')
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      
      // Update localStorage
      if (state.user) {
        localStorage.setItem('userData', JSON.stringify(state.user))
      }
    },
  },
})

export const {
  setLoading,
  setError,
  clearError,
  setTokens,
  setUser,
  loginSuccess,
  logout,
  setSignupData,
  clearSignupData,
  updateUser,
} = authSlice.actions

export default authSlice.reducer

