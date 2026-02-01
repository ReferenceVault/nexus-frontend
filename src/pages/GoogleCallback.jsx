import React, { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api } from '../utils/api'
import { unauthenticatedFetch, handleApiError } from '../utils/apiClient'
import LoadingSpinner from '../components/common/LoadingSpinner'

const GoogleCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const processedRef = useRef(false)

  const checkOnboardingAndRedirect = async (intent = 'user', userRoles = []) => {
    try {
      // Use intent to determine flow, not roles
      if (intent === 'employer') {
        // Validate user has employer role
        const hasEmployerRole = Array.isArray(userRoles) && userRoles.includes('employer')
        if (!hasEmployerRole) {
          // User doesn't have employer role, redirect to signin with error
          navigate('/employer-signin?intent=employer&error=missing_role', { replace: true })
          return
        }
        
        // Check employer onboarding
        try {
          const profile = await api.getEmployerProfile()
          if (profile) {
            sessionStorage.setItem('lastDashboardType', 'employer')
            navigate('/employer-dashboard', { replace: true })
            return
          }
        } catch (error) {
          // Fall through to onboarding redirect
        }
        navigate('/employer-onboarding', { replace: true })
        return
      }

      // Default to user flow (intent === 'user' or not specified)
      const userProfile = await api.getCurrentUser()
      
      // Check if onboarding is complete
      const hasBasicInfo = 
        userProfile.firstName && 
        userProfile.lastName && 
        userProfile.phone && 
        userProfile.addressInformation &&
        userProfile.addressInformation.streetAddress &&
        userProfile.addressInformation.city &&
        userProfile.addressInformation.state &&
        userProfile.addressInformation.zipCode &&
        userProfile.addressInformation.country

      let hasResume = false
      let hasVideo = false
      
      try {
        const resumes = await api.getUserResumes()
        hasResume = resumes && resumes.length > 0
      } catch (error) {
        console.error('Error checking resumes:', error)
      }

      try {
        const videos = await api.getUserVideos()
        hasVideo = videos && videos.length > 0
      } catch (error) {
        console.error('Error checking videos:', error)
      }

      const onboardingComplete = hasBasicInfo && hasResume && hasVideo

      // Redirect based on onboarding status
      if (onboardingComplete) {
        sessionStorage.setItem('lastDashboardType', 'user')
        navigate('/user-dashboard', { replace: true })
      } else {
        navigate('/onboarding', { replace: true })
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      navigate('/onboarding', { replace: true })
    }
  }

  useEffect(() => {
    // Prevent multiple executions
    if (processedRef.current) return
    
    // Extract code from URL query params
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      processedRef.current = true
      console.error('Missing authorization code from Google')
      navigate('/signin', { replace: true })
      return
    }

    processedRef.current = true
    
    const processCallback = async () => {
      try {
        // Determine intent from state parameter (state can be 'employer' or 'user')
        const intent = state === 'employer' ? 'employer' : 'user'
        
        // Exchange code for tokens and user data
        const isEmployerState = state === 'employer'
        const callbackPath = isEmployerState
          ? '/auth/employer/google/callback'
          : '/auth/google/callback'

        const response = await unauthenticatedFetch(callbackPath, {
          method: 'POST',
          body: JSON.stringify({ code }),
        })
        
        const result = await handleApiError(response)
        
        // Login using Redux with tokens and user data
        login(result.user, {
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        })

        // Use intent for redirection, not roles
        await checkOnboardingAndRedirect(intent, result.user?.roles || [])
      } catch (error) {
        console.error('Error processing Google callback:', error)
        // Preserve intent when redirecting to signin
        const intent = state === 'employer' ? 'employer' : 'user'
        navigate(state === 'employer' ? `/employer-signin?intent=${intent}` : `/signin?intent=${intent}`, { replace: true })
      }
    }

    processCallback()
  }, [searchParams, navigate, login])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <LoadingSpinner text="Completing sign in..." />
    </div>
  )
}

export default GoogleCallback

