// Onboarding status management utility

const ONBOARDING_KEY = 'nexus_onboarding_status'

export const OnboardingStatus = {
  NOT_STARTED: 'not_started',
  BASIC_INFO: 'basic_info', // Step 1 completed
  RESUME_UPLOADED: 'resume_uploaded', // Step 2 completed
  VIDEO_UPLOADED: 'video_uploaded', // Step 3 completed
  COMPLETED: 'completed' // All steps done
}

/**
 * Get current onboarding status
 */
export const getOnboardingStatus = () => {
  const status = localStorage.getItem(ONBOARDING_KEY)
  return status || OnboardingStatus.NOT_STARTED
}

/**
 * Set onboarding status
 */
export const setOnboardingStatus = (status) => {
  localStorage.setItem(ONBOARDING_KEY, status)
}

/**
 * Check if user is a first-time user
 */
export const isFirstTimeUser = () => {
  const status = getOnboardingStatus()
  return status === OnboardingStatus.NOT_STARTED || status === OnboardingStatus.BASIC_INFO || status === OnboardingStatus.RESUME_UPLOADED || status === OnboardingStatus.VIDEO_UPLOADED
}

/**
 * Check if onboarding is completed
 */
export const isOnboardingComplete = () => {
  return getOnboardingStatus() === OnboardingStatus.COMPLETED
}

/**
 * Complete onboarding
 */
export const completeOnboarding = () => {
  setOnboardingStatus(OnboardingStatus.COMPLETED)
}

/**
 * Reset onboarding (for testing/logout)
 */
export const resetOnboarding = () => {
  localStorage.removeItem(ONBOARDING_KEY)
}

/**
 * Check if user has completed all onboarding steps by verifying data
 * This is an async function that checks the actual user data
 */
export const checkOnboardingComplete = async (api) => {
  try {
    // Get user profile to check step 1 completion
    const userProfile = await api.getCurrentUser()
    
    // Check if step 1 is complete (has firstName, lastName, phone, addressInformation)
    const step1Complete = 
      userProfile.firstName && 
      userProfile.lastName && 
      userProfile.phone && 
      userProfile.addressInformation &&
      userProfile.addressInformation.streetAddress &&
      userProfile.addressInformation.city &&
      userProfile.addressInformation.state &&
      userProfile.addressInformation.zipCode &&
      userProfile.addressInformation.country

    // Check if step 2 is complete (has uploaded resume)
    let step2Complete = false
    try {
      const resumes = await api.getUserResumes()
      step2Complete = resumes && resumes.length > 0
    } catch (error) {
      console.error('Error checking resumes:', error)
    }

    // Check if step 3 is complete (has uploaded video)
    let step3Complete = false
    try {
      const videos = await api.getUserVideos()
      step3Complete = videos && videos.length > 0
    } catch (error) {
      console.error('Error checking videos:', error)
    }

    // Check if user has analysis results (indicates onboarding was completed at some point)
    // This is the PRIMARY indicator - if analysis exists, onboarding is complete
    let hasAnalysis = false
    let analysisData = null
    try {
      console.log('🔍 Checking for analysis...')
      analysisData = await api.getLatestAnalysis()
      console.log('🔍 Analysis API response:', analysisData)
      
      // Backend returns null (not error) if no analysis found
      // If analysis exists (not null/undefined), user has completed onboarding
      // Check for id, status, or any property that indicates it's a valid analysis object
      hasAnalysis = !!(analysisData && (analysisData.id || analysisData.status || analysisData.userId))
      
      if (hasAnalysis) {
        console.log('✅ Analysis found - onboarding should be complete:', { 
          id: analysisData.id, 
          status: analysisData.status,
          userId: analysisData.userId,
          hasResumeId: !!analysisData.resumeId,
          hasVideoId: !!analysisData.videoId,
          fullResponse: analysisData
        })
      } else {
        console.log('❌ No analysis found - response was:', analysisData)
      }
    } catch (error) {
      // Log all errors to see what's happening
      const errorMsg = error.message || error.toString()
      console.error('❌ Error checking analysis:', {
        message: errorMsg,
        error: error,
        stack: error.stack
      })
      
      // Only treat 404 as "no analysis", other errors are real problems
      if (errorMsg.includes('not found') || errorMsg.includes('404') || errorMsg.includes('No analysis')) {
        console.log('❌ No analysis found (404 or not found error)')
      }
      hasAnalysis = false
    }

    // Debug logging
    console.log('🔍 Onboarding check results:', {
      step1Complete,
      step2Complete,
      step3Complete,
      hasAnalysis,
      analysisId: analysisData?.id || null,
      analysisStatus: analysisData?.status || null,
      hasFirstName: !!userProfile.firstName,
      hasLastName: !!userProfile.lastName,
      hasPhone: !!userProfile.phone,
      hasAddressInfo: !!userProfile.addressInformation,
      addressFields: userProfile.addressInformation ? {
        streetAddress: !!userProfile.addressInformation.streetAddress,
        city: !!userProfile.addressInformation.city,
        state: !!userProfile.addressInformation.state,
        zipCode: !!userProfile.addressInformation.zipCode,
        country: !!userProfile.addressInformation.country,
      } : null
    })

    // PRIORITY: If user has analysis results, they've DEFINITELY completed onboarding
    // This is the strongest indicator - analysis can only exist if onboarding was completed
    if (hasAnalysis) {
      console.log('✅ Onboarding COMPLETE - reason: has analysis results')
      return true
    }

    // FALLBACK 1: If they have resume + video, they've completed essential steps
    if (step2Complete && step3Complete) {
      console.log('✅ Onboarding COMPLETE - reason: has resume and video')
      return true
    }

    // FALLBACK 2: All three steps complete
    if (step1Complete && step2Complete && step3Complete) {
      console.log('✅ Onboarding COMPLETE - reason: all steps complete')
      return true
    }

    console.log('❌ Onboarding INCOMPLETE')
    return false
  } catch (error) {
    console.error('Error checking onboarding completion:', error)
    return false
  }
}

