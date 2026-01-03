import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  loginSuccess,
  logout,
  setLoading,
  setError,
  clearError,
  setSignupData,
  clearSignupData,
  updateUser,
} from '../store/slices/authSlice'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  const login = useCallback((user, tokens) => {
    dispatch(loginSuccess({ user, tokens }))
  }, [dispatch])

  const handleLogout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  const handleSetLoading = useCallback((loading) => {
    dispatch(setLoading(loading))
  }, [dispatch])

  const handleSetError = useCallback((error) => {
    dispatch(setError(error))
  }, [dispatch])

  const handleClearError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleSetSignupData = useCallback((data) => {
    dispatch(setSignupData(data))
  }, [dispatch])

  const handleClearSignupData = useCallback(() => {
    dispatch(clearSignupData())
  }, [dispatch])

  const handleUpdateUser = useCallback((userData) => {
    dispatch(updateUser(userData))
  }, [dispatch])

  return {
    // State
    user: auth.user,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    signupData: auth.signupData,

    // Actions
    login,
    logout: handleLogout,
    setLoading: handleSetLoading,
    setError: handleSetError,
    clearError: handleClearError,
    setSignupData: handleSetSignupData,
    clearSignupData: handleClearSignupData,
    updateUser: handleUpdateUser,
  }
}

