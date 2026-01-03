import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isTokenExpired } from '../../utils/apiClient'
import { checkOnboardingComplete } from '../../utils/onboarding'
import { api } from '../../utils/api'

/**
 * PublicRoute - Redirects authenticated users away from public pages (login/signup)
 * Prevents authenticated users from accessing auth pages
 * Note: For signup page, allows the signup handler to manage redirect to onboarding
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, accessToken } = useAuth()
  const location = useLocation()
  const [onboardingComplete, setOnboardingComplete] = useState(null)
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false)

  // Check if user is authenticated and has valid token
  const isAuthenticatedWithValidToken = isAuthenticated && accessToken && !isTokenExpired(accessToken)

  // Check onboarding completion for authenticated users
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isAuthenticatedWithValidToken) {
        setOnboardingComplete(null)
        return
      }

      setIsCheckingOnboarding(true)
      try {
        const complete = await checkOnboardingComplete(api)
        setOnboardingComplete(complete)
      } catch (error) {
        console.error('Error checking onboarding:', error)
        setOnboardingComplete(false)
      } finally {
        setIsCheckingOnboarding(false)
      }
    }

    if (isAuthenticatedWithValidToken) {
      checkOnboarding()
    }
  }, [isAuthenticatedWithValidToken])

  // If authenticated, redirect away from auth pages
  if (isAuthenticatedWithValidToken && !isCheckingOnboarding && onboardingComplete !== null) {
    // Special handling for signup page: allow navigation to happen
    // The signup handler will redirect to onboarding, so we don't intercept here
    // This prevents race conditions where PublicRoute redirects before signup handler can navigate
    const isSignupPage = location.pathname === '/signup'
    
    if (isSignupPage) {
      // Allow signup page to handle its own redirect to onboarding
      // The signup component's useEffect is controlled by justSignedUpRef flag
      return children
    }

    // If onboarding is not complete, redirect to onboarding
    if (!onboardingComplete) {
      return <Navigate to="/onboarding" replace />
    }

    // For other auth pages (login, forgot-password, etc.), redirect based on onboarding status
    const from = location.state?.from?.pathname || '/user-dashboard'
    return <Navigate to={from} replace />
  }

  // Show loading while checking onboarding
  if (isAuthenticatedWithValidToken && isCheckingOnboarding) {
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

  return children
}

export default PublicRoute

