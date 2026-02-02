import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isTokenExpired, getValidAccessToken } from '../../utils/apiClient'
import { checkOnboardingComplete } from '../../utils/onboarding'
import { api } from '../../utils/api'
import RoleAccessDenied from './RoleAccessDenied'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, accessToken, refreshToken, user } = useAuth()
  const [isValidating, setIsValidating] = useState(true)
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(null)
  const [isCheckingEmployer, setIsCheckingEmployer] = useState(false)
  const [employerProfileComplete, setEmployerProfileComplete] = useState(null)
  const location = useLocation()
  
  const userRoles = user?.roles || []
  const isEmployer = Array.isArray(userRoles) && userRoles.includes('employer')
  const isUser = Array.isArray(userRoles) && userRoles.includes('user')
  const isEmployerRoute = location.pathname.startsWith('/employer')
  const isEmployerOnboardingRoute = location.pathname.startsWith('/employer-onboarding')
  
  // Check role access for employer routes
  const requiresEmployerRole = isEmployerRoute && !isEmployerOnboardingRoute
  const hasRequiredRole = requiresEmployerRole ? isEmployer : true

  // Routes that don't require onboarding completion
  const onboardingRoutes = ['/onboarding', '/assessments', '/analysis']
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

  // Check onboarding completion for non-onboarding routes (candidates)
  useEffect(() => {
    const checkOnboarding = async () => {
      // Skip if user is employer AND on employer route (employers have separate onboarding check)
      // But if user has both roles and is on user route, still check user onboarding
      if (isEmployer && isEmployerRoute) {
        console.log('🛡️ ProtectedRoute: Skipping user onboarding check - user is employer on employer route')
        setIsCheckingOnboarding(false)
        setOnboardingComplete(null)
        return
      }

      // Skip check if on onboarding route
      if (isOnboardingRoute) {
        console.log('🛡️ ProtectedRoute: On onboarding route - allowing access')
        setIsCheckingOnboarding(false)
        setOnboardingComplete(true) // Allow access to onboarding route
        return
      }

      // Skip if not authenticated
      if (!isAuthenticated) {
        console.log('🛡️ ProtectedRoute: Not authenticated - clearing onboarding state')
        setIsCheckingOnboarding(false)
        setOnboardingComplete(null)
        return
      }

      // Skip if still validating token (wait for validation to complete)
      if (isValidating) {
        console.log('🛡️ ProtectedRoute: Still validating token - waiting...')
        setIsCheckingOnboarding(false)
        // Don't clear onboardingComplete here - preserve existing state while validating
        return
      }

      // Don't re-check if we already have a valid result (true or false)
      // Only re-check if onboardingComplete is null
      if (onboardingComplete !== null && !isCheckingOnboarding) {
        console.log('🛡️ ProtectedRoute: Onboarding already checked, result:', onboardingComplete)
        return
      }

      // Always check onboarding for authenticated users on protected routes
      // This runs when isValidating becomes false and isAuthenticated is true
      console.log('🛡️ ProtectedRoute: Checking onboarding status for', location.pathname, 'isEmployer:', isEmployer, 'isEmployerRoute:', isEmployerRoute)
      setIsCheckingOnboarding(true)
      setOnboardingComplete(null) // Reset to null while checking
      try {
        const complete = await checkOnboardingComplete(api)
        console.log('🛡️ ProtectedRoute: Onboarding check result:', complete, 'for', location.pathname)
        // Use functional update to ensure we have the latest state
        setOnboardingComplete(() => complete)
      } catch (error) {
        console.error('🛡️ ProtectedRoute: Error checking onboarding:', error)
        // Use functional update to ensure we have the latest state
        setOnboardingComplete(() => false) // Default to false on error - force onboarding
      } finally {
        setIsCheckingOnboarding(false)
      }
    }

    // Run check when authenticated and validation is complete
    if (isAuthenticated && !isValidating) {
      checkOnboarding()
    } else if (!isAuthenticated) {
      // Not authenticated, clear onboarding status
      setOnboardingComplete(null)
      setIsCheckingOnboarding(false)
    }
    // If isValidating is true, wait - don't clear state yet
  }, [isAuthenticated, isValidating, isOnboardingRoute, location.pathname, isEmployer, isEmployerRoute])

  // Check employer onboarding for employer routes
  useEffect(() => {
    const checkEmployerProfile = async () => {
      if (!isEmployer || !isEmployerRoute) {
        setIsCheckingEmployer(false)
        setEmployerProfileComplete(null)
        return
      }

      if (isEmployerOnboardingRoute) {
        setIsCheckingEmployer(false)
        setEmployerProfileComplete(true)
        return
      }

      if (!isAuthenticated || isValidating) {
        setIsCheckingEmployer(false)
        return
      }

      setIsCheckingEmployer(true)
      try {
        await api.getEmployerProfile()
        setEmployerProfileComplete(true)
      } catch (error) {
        setEmployerProfileComplete(false)
      } finally {
        setIsCheckingEmployer(false)
      }
    }

    if (!isValidating && isAuthenticated) {
      checkEmployerProfile()
    } else if (!isAuthenticated) {
      setEmployerProfileComplete(null)
      setIsCheckingEmployer(false)
    }
  }, [
    isEmployer,
    isEmployerRoute,
    isEmployerOnboardingRoute,
    isAuthenticated,
    isValidating,
    location.pathname,
  ])

  if (isLoading || isValidating || isCheckingOnboarding || isCheckingEmployer) {
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
    // Preserve intent from current location if present
    const searchParams = new URLSearchParams(location.search)
    const intent = searchParams.get('intent')
    const redirectPath = isEmployerRoute 
      ? `/employer-signin${intent ? `?intent=${intent}` : '?intent=employer'}` 
      : `/signin${intent ? `?intent=${intent}` : '?intent=user'}`
    return <Navigate to={redirectPath} replace />
  }

  if (isEmployerRoute) {
    // Check if user has required role
    if (requiresEmployerRole && !hasRequiredRole) {
      return <RoleAccessDenied requiredRole="employer" currentPath={location.pathname} />
    }

    if (isEmployerOnboardingRoute) {
      return children
    }

    if (employerProfileComplete === false) {
      return <Navigate to="/employer-onboarding" replace />
    }

    return children
  }
  
  // Check role access for user routes (non-employer routes that require user role)
  const userOnlyRoutes = ['/upload-resume', '/upload-video', '/user-dashboard', '/job-matches', '/job-details']
  const isUserOnlyRoute = userOnlyRoutes.some(route => location.pathname.startsWith(route))
  if (isUserOnlyRoute && !isUser && isAuthenticated) {
    return <RoleAccessDenied requiredRole="user" currentPath={location.pathname} />
  }

  // For onboarding, assessment, and analysis routes, always allow access
  // These routes handle their own logic for what to show based on user state
  if (isOnboardingRoute) {
    return children
  }

  // For all other protected routes, check onboarding completion
  // Only check after we've finished checking (isCheckingOnboarding is false)
  // If onboardingComplete is null, it means we haven't checked yet or check failed
  console.log('🛡️ ProtectedRoute: Final check - onboardingComplete:', onboardingComplete, 'isCheckingOnboarding:', isCheckingOnboarding)
  
  // If we've finished checking and onboarding is not complete, redirect
  if (!isCheckingOnboarding && onboardingComplete === false) {
    console.log('🛡️ ProtectedRoute: Redirecting to onboarding - onboarding incomplete')
    return <Navigate to="/onboarding" replace />
  }
  
  // If we've finished checking and onboarding is complete, allow access
  if (!isCheckingOnboarding && onboardingComplete === true) {
    return children
  }
  
  // If still checking or status is null (shouldn't reach here due to earlier check, but safety net)
  if (isCheckingOnboarding || onboardingComplete === null) {
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

  // Only allow access if onboarding is explicitly complete
  return children
}

export default ProtectedRoute

