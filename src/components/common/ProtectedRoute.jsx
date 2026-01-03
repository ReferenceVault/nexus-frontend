import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isTokenExpired, getValidAccessToken } from '../../utils/apiClient'
import { checkOnboardingComplete } from '../../utils/onboarding'
import { api } from '../../utils/api'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, accessToken, refreshToken } = useAuth()
  const [isValidating, setIsValidating] = useState(true)
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(null)
  const location = useLocation()
  
  // Routes that don't require onboarding completion
  const onboardingRoutes = ['/onboarding']
  const isOnboardingRoute = onboardingRoutes.some(route => location.pathname.startsWith(route))

  useEffect(() => {
    const validateToken = async () => {
      // If no tokens at all, skip validation
      if (!accessToken && !refreshToken) {
        setIsValidating(false)
        return
      }

      // If we have tokens, check if access token is valid
      if (accessToken && !isTokenExpired(accessToken)) {
        setIsValidating(false)
        return
      }

      // Access token expired or missing, try to refresh
      if (refreshToken) {
        try {
          await getValidAccessToken()
          // Token refreshed successfully
        } catch (error) {
          // Token refresh failed, user will be logged out by apiClient
          console.error('Token validation failed:', error)
        }
      }

      setIsValidating(false)
    }

    validateToken()
  }, [accessToken, refreshToken])

  // Check onboarding completion for non-onboarding routes
  useEffect(() => {
    const checkOnboarding = async () => {
      // Skip check if on onboarding route
      if (isOnboardingRoute) {
        setIsCheckingOnboarding(false)
        setOnboardingComplete(true) // Allow access to onboarding route
        return
      }

      // Skip if not authenticated or still validating token
      if (!isAuthenticated || isValidating) {
        setIsCheckingOnboarding(false)
        return
      }

      // Always check onboarding for authenticated users on protected routes
      setIsCheckingOnboarding(true)
      try {
        const complete = await checkOnboardingComplete(api)
        setOnboardingComplete(complete)
      } catch (error) {
        console.error('Error checking onboarding:', error)
        setOnboardingComplete(false) // Default to false on error - force onboarding
      } finally {
        setIsCheckingOnboarding(false)
      }
    }

    if (!isValidating && isAuthenticated) {
      checkOnboarding()
    } else if (!isAuthenticated) {
      // Not authenticated, clear onboarding status
      setOnboardingComplete(null)
      setIsCheckingOnboarding(false)
    }
  }, [isAuthenticated, isValidating, isOnboardingRoute, location.pathname])

  if (isLoading || isValidating || isCheckingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg animate-spin">
            <i className="fa-solid fa-spinner text-white text-xl"></i>
          </div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  // For onboarding route, always allow access
  if (isOnboardingRoute) {
    return children
  }

  // For all other protected routes, check onboarding completion
  // Block access if onboarding is not complete (false) or still checking (null)
  if (onboardingComplete !== true) {
    // Still checking or incomplete - redirect to onboarding
    return <Navigate to="/onboarding" replace />
  }

  // Only allow access if onboarding is explicitly complete
  return children
}

export default ProtectedRoute

