import React, { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api } from '../utils/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

const GoogleCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const processedRef = useRef(false)

  useEffect(() => {
    // Prevent multiple executions
    if (processedRef.current) return
    
    // Extract tokens and user data from URL query params
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const userDataStr = searchParams.get('user')

    if (accessToken && refreshToken && userDataStr) {
      processedRef.current = true
      
      const processCallback = async () => {
        try {
          // Parse user data and login using Redux
          const userData = JSON.parse(decodeURIComponent(userDataStr))
          login(userData, { accessToken, refreshToken })

          // Check if user has completed onboarding (new user check)
          try {
            const userProfile = await api.getCurrentUser()
            
            // Check if onboarding is complete
            // Onboarding is complete if user has: firstName, lastName, phone, addressInformation, resume, and video
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
              // Existing user with completed onboarding - go to dashboard
              navigate('/user-dashboard', { replace: true })
            } else {
              // New user or incomplete onboarding - go to onboarding
              navigate('/onboarding', { replace: true })
            }
          } catch (error) {
            console.error('Error checking onboarding status:', error)
            // If we can't check onboarding, assume new user and send to onboarding
            navigate('/onboarding', { replace: true })
          }
        } catch (error) {
          console.error('Error processing Google callback:', error)
          navigate('/signin', { replace: true })
        }
      }

      processCallback()
    } else {
      processedRef.current = true
      // Missing required params, redirect to signin
      navigate('/signin', { replace: true })
    }
  }, [searchParams, navigate, login])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <LoadingSpinner text="Completing sign in..." />
    </div>
  )
}

export default GoogleCallback

