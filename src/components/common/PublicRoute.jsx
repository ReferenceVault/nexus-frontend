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
  // BUT skip this check for signin/signup pages - let their handlers manage it
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isAuthenticatedWithValidToken) {
        setOnboardingComplete(null)
        return
      }

      // Skip onboarding check for signin/signup - let their handlers manage navigation
      const isSignupPage = location.pathname === '/signup'
      const isSigninPage = location.pathname === '/signin'
      if (isSignupPage || isSigninPage) {
        console.log('🚦 PublicRoute: Skipping onboarding check for signin/signup page')
        setOnboardingComplete(null) // Don't redirect, let the page handle it
        return
      }

      console.log('🚦 PublicRoute: Checking onboarding status...')
      setIsCheckingOnboarding(true)
      try {
        const complete = await checkOnboardingComplete(api)
        console.log('🚦 PublicRoute: Onboarding check result:', complete)
        setOnboardingComplete(complete)
      } catch (error) {
        console.error('🚦 PublicRoute: Error checking onboarding:', error)
        setOnboardingComplete(false)
      } finally {
        setIsCheckingOnboarding(false)
      }
    }

    if (isAuthenticatedWithValidToken) {
      checkOnboarding()
    }
  }, [isAuthenticatedWithValidToken, location.pathname])

  // If authenticated, redirect away from auth pages
  if (isAuthenticatedWithValidToken && !isCheckingOnboarding && onboardingComplete !== null) {
    // Special handling for signup and signin pages: allow their handlers to manage navigation
    // This prevents race conditions where PublicRoute redirects before handlers can navigate
    const isSignupPage = location.pathname === '/signup'
    const isSigninPage = location.pathname === '/signin'
    
    if (isSignupPage || isSigninPage) {
      // Allow signup/signin pages to handle their own redirect
      // The login/signup handlers will check onboarding and navigate appropriately
      console.log('🚦 PublicRoute: Allowing signin/signup page to handle navigation')
      return children
    }

    // For other auth pages (forgot-password, etc.), redirect based on onboarding status
    // If onboarding is not complete, redirect to onboarding
    if (!onboardingComplete) {
      console.log('🚦 PublicRoute: Onboarding incomplete, redirecting to /onboarding')
      return <Navigate to="/onboarding" replace />
    }

    // Onboarding complete, redirect to dashboard
    const from = location.state?.from?.pathname || '/user-dashboard'
    console.log('🚦 PublicRoute: Onboarding complete, redirecting to', from)
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

