import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isTokenExpired } from '../../utils/apiClient'

/**
 * PublicRoute - Redirects authenticated users away from public pages (login/signup)
 * Prevents authenticated users from accessing auth pages
 * Note: For signup page, allows the signup handler to manage redirect to onboarding
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, accessToken } = useAuth()
  const location = useLocation()

  // Check if user is authenticated and has valid token
  const isAuthenticatedWithValidToken = isAuthenticated && accessToken && !isTokenExpired(accessToken)

  // If authenticated, redirect away from auth pages
  if (isAuthenticatedWithValidToken) {
    // Special handling for signup page: allow navigation to happen
    // The signup handler will redirect to onboarding, so we don't intercept here
    // This prevents race conditions where PublicRoute redirects before signup handler can navigate
    const isSignupPage = location.pathname === '/signup'
    
    if (isSignupPage) {
      // Allow signup page to handle its own redirect to onboarding
      // The signup component's useEffect is controlled by justSignedUpRef flag
      return children
    }

    // For other auth pages (login, forgot-password, etc.), redirect to dashboard
    const from = location.state?.from?.pathname || '/user-dashboard'
    return <Navigate to={from} replace />
  }

  return children
}

export default PublicRoute

