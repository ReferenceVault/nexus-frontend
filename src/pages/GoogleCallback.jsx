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

  const checkOnboardingAndRedirect = async (isEmployer = false) => {
    try {
      if (isEmployer) {
        try {
          const profile = await api.getEmployerProfile()
          if (profile) {
            navigate('/employer-dashboard', { replace: true })
            return
          }
        } catch (error) {
          // Fall through to onboarding redirect
        }
        navigate('/employer-onboarding', { replace: true })
        return
      }

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

        const isEmployerUser = Array.isArray(result.user?.roles) && result.user.roles.includes('employer')
        // Check onboarding and redirect
        await checkOnboardingAndRedirect(isEmployerState || isEmployerUser)
      } catch (error) {
        console.error('Error processing Google callback:', error)
        navigate(state === 'employer' ? '/employer-signin' : '/signin', { replace: true })
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

