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

    // All three steps must be complete
    return step1Complete && step2Complete && step3Complete
  } catch (error) {
    console.error('Error checking onboarding completion:', error)
    return false
  }
}

