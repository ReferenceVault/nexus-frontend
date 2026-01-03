import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import { setOnboardingStatus, OnboardingStatus, completeOnboarding, getOnboardingStatus, checkOnboardingComplete } from '../utils/onboarding'
import { useAuth } from '../hooks/useAuth'
import { api } from '../utils/api'
import ErrorMessage from '../components/common/ErrorMessage'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Onboarding = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signupData, user, updateUser, accessToken, isAuthenticated } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const [resumeUploadError, setResumeUploadError] = useState(null)
  const [isLoadingProgress, setIsLoadingProgress] = useState(true)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [videoUploadError, setVideoUploadError] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [videoStream, setVideoStream] = useState(null)
  const [uploadedResumeId, setUploadedResumeId] = useState(null)
  const [uploadedResumeInfo, setUploadedResumeInfo] = useState(null) // Store resume file info
  const [uploadedVideoId, setUploadedVideoId] = useState(null)
  const [uploadedVideoInfo, setUploadedVideoInfo] = useState(null) // Store video file info
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    // Step 2: Resume
    resumeFile: null,
    // Step 3: Video
    videoFile: null
  })

  // Prevent browser back navigation during onboarding
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      return
    }

    // Push state to prevent back navigation
    window.history.pushState(null, '', '/onboarding')
    
    const handlePopState = (e) => {
      // Check if onboarding is complete before allowing navigation
      checkOnboardingComplete(api).then((complete) => {
        if (!complete) {
          // Force user to stay on onboarding - push state again
          window.history.pushState(null, '', '/onboarding')
        }
      }).catch(() => {
        // On error, keep user on onboarding
        window.history.pushState(null, '', '/onboarding')
      })
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isAuthenticated, accessToken])

  useEffect(() => {
    // Check onboarding progress and set current step
    const checkOnboardingProgress = async () => {
      if (!isAuthenticated || !accessToken) {
        setIsLoadingProgress(false)
        return
      }

      try {
        // Get user profile to check step 1 completion
        const userProfile = await api.getCurrentUser()
        
        // Check if step 1 is complete (has firstName, lastName, phone, addressInformation)
        const step1Complete = 
          userProfile.firstName && 
          userProfile.lastName && 
          userProfile.phone && 
          userProfile.addressInformation

        // Check if step 2 is complete (has uploaded resume)
        let step2Complete = false
        try {
          const resumes = await api.getUserResumes()
          step2Complete = resumes && resumes.length > 0
          if (resumes && resumes.length > 0) {
            const resume = resumes[0]
            setUploadedResumeId(resume.id)
            // Fetch presigned URL for the resume
            try {
              const presignedUrlResponse = await api.getResumePresignedUrl(resume.id)
              // Store resume info to display when user returns to step 2
              setUploadedResumeInfo({
                fileName: resume.fileUrl?.split('/').pop() || 'resume.pdf',
                fileType: resume.fileType || 'PDF',
                uploadedAt: resume.createdAt,
                presignedUrl: presignedUrlResponse.presignedUrl
              })
            } catch (presignedError) {
              console.error('Error fetching presigned URL for resume:', presignedError)
              // Store without presigned URL if fetch fails
              setUploadedResumeInfo({
                fileName: resume.fileUrl?.split('/').pop() || 'resume.pdf',
                fileType: resume.fileType || 'PDF',
                uploadedAt: resume.createdAt
              })
            }
          }
        } catch (error) {
          console.error('Error checking resumes:', error)
        }

        // Check if step 3 is complete (has uploaded video)
        let step3Complete = false
        try {
          const videos = await api.getUserVideos()
          step3Complete = videos && videos.length > 0
          if (videos && videos.length > 0) {
            const video = videos[0]
            setUploadedVideoId(video.id)
            // Fetch presigned URL for the video
            try {
              const presignedUrlResponse = await api.getVideoPresignedUrl(video.id)
              // Store video info to display when user returns to step 3
              setUploadedVideoInfo({
                fileName: video.fileUrl?.split('/').pop() || 'video.mp4',
                fileType: video.fileType || 'MP4',
                uploadedAt: video.createdAt,
                presignedUrl: presignedUrlResponse.presignedUrl
              })
            } catch (presignedError) {
              console.error('Error fetching presigned URL for video:', presignedError)
              // Store without presigned URL if fetch fails
              setUploadedVideoInfo({
                fileName: video.fileUrl?.split('/').pop() || 'video.mp4',
                fileType: video.fileType || 'MP4',
                uploadedAt: video.createdAt
              })
            }
          }
        } catch (error) {
          console.error('Error checking videos:', error)
        }

        // Determine current step based on completion
        let initialStep = 1
        if (step1Complete && step2Complete && step3Complete) {
          // All steps complete - user should see step 3
          initialStep = 3
        } else if (step1Complete && step2Complete) {
          initialStep = 3
        } else if (step1Complete) {
          initialStep = 2
        }

        // Prefill form data from user profile
        if (userProfile) {
      setFormData(prev => ({
        ...prev,
            firstName: userProfile.firstName || prev.firstName,
            lastName: userProfile.lastName || prev.lastName,
            email: userProfile.email || prev.email,
            phone: userProfile.phone || prev.phone,
            streetAddress: userProfile.addressInformation?.streetAddress || prev.streetAddress,
            city: userProfile.addressInformation?.city || prev.city,
            state: userProfile.addressInformation?.state || prev.state,
            zipCode: userProfile.addressInformation?.zipCode || prev.zipCode,
            country: userProfile.addressInformation?.country || prev.country,
      }))
        }

        // Also check localStorage status as fallback
        const savedStatus = getOnboardingStatus()
        if (savedStatus === OnboardingStatus.RESUME_UPLOADED && step2Complete) {
          initialStep = 3
        } else if (savedStatus === OnboardingStatus.BASIC_INFO && step1Complete) {
          initialStep = step2Complete ? 3 : 2
        }

        // Check if step is specified in URL query params (for direct navigation from dashboard)
        const stepParam = searchParams.get('step')
        if (stepParam) {
          const stepNum = parseInt(stepParam, 10)
          if (stepNum >= 1 && stepNum <= 3) {
            // Override initial step with URL parameter
            initialStep = stepNum
          }
        }

        setCurrentStep(initialStep)
      } catch (error) {
        console.error('Error checking onboarding progress:', error)
        // Fallback to localStorage status
        const savedStatus = getOnboardingStatus()
        if (savedStatus === OnboardingStatus.RESUME_UPLOADED) {
          setCurrentStep(3)
        } else if (savedStatus === OnboardingStatus.BASIC_INFO) {
          setCurrentStep(2)
    }
      } finally {
        setIsLoadingProgress(false)
      }
    }

    checkOnboardingProgress()
  }, [isAuthenticated, accessToken, signupData, user])

  // Check for uploaded resume when navigating to step 2
  useEffect(() => {
    const checkUploadedResume = async () => {
      if (currentStep === 2 && isAuthenticated && accessToken && !uploadedResumeInfo) {
        try {
          const resumes = await api.getUserResumes()
          if (resumes && resumes.length > 0) {
            const resume = resumes[0]
            setUploadedResumeId(resume.id)
            // Fetch presigned URL for the resume
            try {
              const presignedUrlResponse = await api.getResumePresignedUrl(resume.id)
              setUploadedResumeInfo({
                fileName: resume.fileUrl?.split('/').pop() || 'resume.pdf',
                fileType: resume.fileType || 'PDF',
                uploadedAt: resume.createdAt,
                presignedUrl: presignedUrlResponse.presignedUrl
              })
            } catch (presignedError) {
              console.error('Error fetching presigned URL for resume:', presignedError)
              setUploadedResumeInfo({
                fileName: resume.fileUrl?.split('/').pop() || 'resume.pdf',
                fileType: resume.fileType || 'PDF',
                uploadedAt: resume.createdAt
              })
            }
          }
        } catch (error) {
          console.error('Error checking resumes:', error)
    }
      }
    }

    checkUploadedResume()
  }, [currentStep, isAuthenticated, accessToken, uploadedResumeInfo])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setSaveError(null)
  }

  const handleFileChange = (e, field) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate video file immediately when selected
    if (field === 'videoFile') {
      setVideoUploadError(null)
      setRecordedVideo(null) // Clear recorded video if a file is uploaded

      // Validate file type
      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm']
      if (!allowedTypes.includes(file.type)) {
        setVideoUploadError('Only MP4, MOV, and WebM video files are allowed')
        e.target.value = '' // Clear the input
        return
      }

      // Validate file size (50MB)
      const maxSize = 50 * 1024 * 1024 // 50MB in bytes
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2)
      
      if (file.size > maxSize) {
        setVideoUploadError(
          `Video file is too large (${fileSizeMB} MB). Maximum file size is 50 MB. Please compress your video or choose a smaller file.`
        )
        e.target.value = '' // Clear the input
        return
      }
    }

    // Validate resume file immediately when selected
    if (field === 'resumeFile') {
      setResumeUploadError(null)

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
      if (!allowedTypes.includes(file.type)) {
        setResumeUploadError('Only PDF and DOCX files are allowed')
        e.target.value = '' // Clear the input
        return
      }

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2)
      
      if (file.size > maxSize) {
        setResumeUploadError(`Resume file is too large (${fileSizeMB} MB). Maximum file size is 5 MB.`)
        e.target.value = '' // Clear the input
        return
      }
    }

    setFormData(prev => ({ ...prev, [field]: file }))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      setVideoStream(stream)

      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      })

      const chunks = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const file = new File([blob], `recorded-video-${Date.now()}.webm`, {
          type: 'video/webm'
        })
        setRecordedVideo(file)
        setFormData(prev => ({ ...prev, videoFile: file }))
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      setVideoUploadError('Failed to access camera/microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop())
        setVideoStream(null)
      }
    }
  }

  const validateStep3 = () => {
    // Allow validation to pass if video is already uploaded (user returning to step 3)
    if (uploadedVideoId) {
      setVideoUploadError(null)
      return true
    }

    const videoToUpload = recordedVideo || formData.videoFile
    if (!videoToUpload) {
      setVideoUploadError('Please record or upload your video introduction')
      return false
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm']
    if (!allowedTypes.includes(videoToUpload.type)) {
      setVideoUploadError('Only MP4, MOV, and WebM video files are allowed')
      return false
    }

    // Validate file size (50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB in bytes
    const fileSizeMB = (videoToUpload.size / 1024 / 1024).toFixed(2)
    
    if (videoToUpload.size > maxSize) {
      setVideoUploadError(
        `Video file is too large (${fileSizeMB} MB). Maximum file size is 50 MB. Please compress your video or choose a smaller file.`
      )
      return false
    }

    setVideoUploadError(null)
    return true
  }

  const uploadVideo = async (videoFile) => {
    try {
      setIsUploadingVideo(true)
      setVideoUploadError(null)

      if (!isAuthenticated || !accessToken) {
        setVideoUploadError('You must be signed in to upload your video')
        setTimeout(() => navigate('/signin'), 2000)
        return false
      }

      if (!videoFile) {
        setVideoUploadError('Please record or upload a video')
        return false
      }

      // Double-check file size before upload (in case validation was bypassed)
      const maxSize = 50 * 1024 * 1024 // 50MB
      const fileSizeMB = (videoFile.size / 1024 / 1024).toFixed(2)
      
      if (videoFile.size > maxSize) {
        setVideoUploadError(
          `Video file is too large (${fileSizeMB} MB). Maximum file size is 50 MB. Please compress your video or choose a smaller file.`
        )
        return false
      }

      const result = await api.uploadVideo(videoFile)
      setUploadedVideoId(result.id)
      return true
    } catch (error) {
      let errorMessage = error.message || 'Failed to upload video'
      
      // Handle specific error cases
      if (errorMessage.includes('File too large') || errorMessage.includes('too large') || errorMessage.includes('LIMIT_FILE_SIZE')) {
        const fileSizeMB = (videoFile.size / 1024 / 1024).toFixed(2)
        errorMessage = `Video file is too large (${fileSizeMB} MB). Maximum file size is 50 MB. Please compress your video or choose a smaller file.`
      } else if (errorMessage.includes('413') || errorMessage.includes('Request Entity Too Large')) {
        errorMessage = 'Video file is too large. Maximum file size is 50 MB. Please compress your video or choose a smaller file.'
      } else if (!errorMessage.includes('Session expired') && !errorMessage.includes('sign in again')) {
        // Keep original error message if it's not a session error
        errorMessage = `Failed to upload video: ${errorMessage}`
      }
      
      setVideoUploadError(errorMessage)
      
      if (errorMessage.includes('Session expired') || errorMessage.includes('sign in again')) {
        setTimeout(() => {
          navigate('/signin')
        }, 2000)
      }
      
      return false
    } finally {
      setIsUploadingVideo(false)
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.streetAddress?.trim()) {
      newErrors.streetAddress = 'Street address is required'
    }
    if (!formData.city?.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.state?.trim()) {
      newErrors.state = 'State/Province is required'
    }
    if (!formData.zipCode?.trim()) {
      newErrors.zipCode = 'ZIP/Postal code is required'
    }
    if (!formData.country?.trim()) {
      newErrors.country = 'Country is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const saveStep1Data = async () => {
    try {
      setIsSaving(true)
      setSaveError(null)

      // Check if user is authenticated and has token
      if (!isAuthenticated || !accessToken) {
        setSaveError('You must be signed in to save your profile')
        setTimeout(() => navigate('/signin'), 2000)
        return false
      }

      if (!user || !user.id) {
        setSaveError('User information not found. Please sign in again.')
        setTimeout(() => navigate('/signin'), 2000)
        return false
      }

      const profileData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        addressInformation: {
          streetAddress: formData.streetAddress.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim(),
          country: formData.country.trim(),
        },
      }

      const updatedUser = await api.updateProfile(profileData)
      
      // Update Redux state
      updateUser({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
      })

      return true
    } catch (error) {
      const errorMessage = error.message || 'Failed to save profile information'
      setSaveError(errorMessage)
      
      // If session expired, redirect to signin
      if (errorMessage.includes('Session expired') || errorMessage.includes('sign in again')) {
        setTimeout(() => {
          navigate('/signin')
        }, 2000)
      }
      
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const validateStep2 = () => {
    // Allow validation to pass if resume is already uploaded (user returning to step 2)
    if (uploadedResumeId) {
      setResumeUploadError(null)
      return true
    }

    if (!formData.resumeFile) {
      setResumeUploadError('Please upload your resume')
      return false
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    if (!allowedTypes.includes(formData.resumeFile.type)) {
      setResumeUploadError('Only PDF and DOCX files are allowed')
      return false
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (formData.resumeFile.size > maxSize) {
      setResumeUploadError('File size must be less than 5MB')
      return false
    }

    setResumeUploadError(null)
    return true
  }

  const uploadResume = async () => {
    try {
      setIsUploadingResume(true)
      setResumeUploadError(null)

      if (!isAuthenticated || !accessToken) {
        setResumeUploadError('You must be signed in to upload your resume')
        setTimeout(() => navigate('/signin'), 2000)
        return false
      }

      const result = await api.uploadResume(formData.resumeFile)
      setUploadedResumeId(result.id)
      return true
    } catch (error) {
      const errorMessage = error.message || 'Failed to upload resume'
      setResumeUploadError(errorMessage)
      
      if (errorMessage.includes('Session expired') || errorMessage.includes('sign in again')) {
        setTimeout(() => {
          navigate('/signin')
        }, 2000)
      }
      
      return false
    } finally {
      setIsUploadingResume(false)
    }
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate step 1 fields
      if (!validateStep1()) {
        return
      }

      // Save data to backend
      const saved = await saveStep1Data()
      if (!saved) {
        return
      }

      // Save basic info status
      setOnboardingStatus(OnboardingStatus.BASIC_INFO)
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // Validate resume
      if (!validateStep2()) {
        return
      }

      // Only upload if there's a new file (not already uploaded)
      if (formData.resumeFile && !uploadedResumeId) {
        // Upload resume to S3
        const uploaded = await uploadResume()
        if (!uploaded) {
          return
        }
      }

      // Save resume status
      setOnboardingStatus(OnboardingStatus.RESUME_UPLOADED)
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    // Validate video before attempting upload
    if (!validateStep3()) {
      return
    }

    let videoId = uploadedVideoId

    // Only upload if there's a new file (not already uploaded)
    if (!videoId && (formData.videoFile || recordedVideo)) {
      const videoFile = formData.videoFile || recordedVideo
      
      // Upload video
      setIsUploadingVideo(true)
      try {
        const videoResult = await api.uploadVideo(videoFile)
        videoId = videoResult.id
        setUploadedVideoId(videoId)
        
        // Update video info
        setUploadedVideoInfo({
          fileName: videoResult.fileUrl?.split('/').pop() || 'video.mp4',
          fileType: 'MP4',
          uploadedAt: new Date(),
          fileUrl: videoResult.fileUrl
        })
      } catch (error) {
        const errorMessage = error.message || 'Failed to upload video'
        setVideoUploadError(errorMessage)
        
        if (errorMessage.includes('Session expired') || errorMessage.includes('sign in again')) {
          setTimeout(() => {
            navigate('/signin')
          }, 2000)
        }
        
        setIsUploadingVideo(false)
        return
      } finally {
        setIsUploadingVideo(false)
      }
    }

    // If video already exists, fetch it
    if (!videoId) {
      try {
        const videos = await api.getUserVideos()
        if (videos && videos.length > 0) {
          videoId = videos[0].id
          setUploadedVideoId(videoId)
        }
      } catch (error) {
        console.error('Error fetching videos:', error)
      }
    }
    
    // Save video status
    setOnboardingStatus(OnboardingStatus.VIDEO_UPLOADED)

    // Get resume ID if not already set
    let resumeId = uploadedResumeId
    if (!resumeId) {
      try {
        const resumes = await api.getUserResumes()
        if (resumes && resumes.length > 0) {
          resumeId = resumes[0].id
          setUploadedResumeId(resumeId)
        }
      } catch (error) {
        console.error('Error fetching resumes:', error)
      }
    }

    // Start analysis if we have both resume and video IDs
    if (resumeId && videoId) {
      try {
        console.log('Starting analysis with resumeId:', resumeId, 'videoId:', videoId)
        const analysisRequest = await api.startAnalysis(resumeId, videoId)
        console.log('Analysis started successfully:', analysisRequest)
        
    // Complete onboarding
    completeOnboarding()
        
        // Navigate to analysis status page
        navigate(`/analysis/${analysisRequest.id}`, { replace: true })
        return // Exit early - navigation will happen
      } catch (error) {
        console.error('Failed to start analysis:', error)
        setVideoUploadError('Video uploaded successfully, but failed to start analysis: ' + (error.message || 'Unknown error'))
      }
    } else {
      console.error('Missing IDs - resumeId:', resumeId, 'videoId:', videoId)
      setVideoUploadError('Unable to start analysis. Missing resume or video. Please ensure both are uploaded.')
    }
  }

  // Cleanup video stream on unmount
  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop())
  }
    }
  }, [videoStream])

  const steps = [
    { number: 1, title: 'Basic Information', icon: 'fa-user' },
    { number: 2, title: 'Upload Resume', icon: 'fa-file-arrow-up' },
    { number: 3, title: 'Video Introduction', icon: 'fa-video' }
  ]

  if (isLoadingProgress) {
    return (
      <div className="bg-slate-50 text-neutral-900 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </main>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 text-neutral-900 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
          <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-8 lg:py-12">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                          currentStep >= step.number
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white/20 text-slate-300'
                        }`}
                      >
                        {currentStep > step.number ? (
                          <i className="fa-solid fa-check text-white"></i>
                        ) : (
                          <i className={`fa-solid ${step.icon}`}></i>
                        )}
                      </div>
                      <span className="mt-2 text-xs font-medium text-slate-300 text-center">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 transition-all ${
                          currentStep > step.number ? 'bg-indigo-600' : 'bg-white/20'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="rounded-2xl border border-white/20 shadow-xl p-6 sm:p-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Tell us about yourself so we can match you with the{' '}
                      <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        right opportunities.
                      </span>
                    </h2>
                    <p className="text-sm text-slate-300">Basic Information</p>
                  </div>

                  <ErrorMessage error={saveError} onDismiss={() => setSaveError(null)} />

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-300">Legal First Name *</label>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                          errors.firstName ? 'border-red-400' : 'border-white/20 focus:border-indigo-400'
                        }`}
                        placeholder="John"
                        required
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-400">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-300">Legal Last Name *</label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                          errors.lastName ? 'border-red-400' : 'border-white/20 focus:border-indigo-400'
                        }`}
                        placeholder="Doe"
                        required
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-400">{errors.lastName}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-300">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                        placeholder="john.doe@example.com"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                          errors.phone ? 'border-red-400' : 'border-white/20 focus:border-indigo-400'
                        }`}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-400">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                      <i className="fa-solid fa-location-dot text-indigo-300"></i>
                      <span>Address Information</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-300">Street Address *</label>
                        <input
                          name="streetAddress"
                          value={formData.streetAddress}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                            errors.streetAddress ? 'border-red-400' : 'border-white/20 focus:border-indigo-400'
                          }`}
                          placeholder="123 Main Street"
                          required
                        />
                        {errors.streetAddress && (
                          <p className="text-xs text-red-400">{errors.streetAddress}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-300">City *</label>
                        <input
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                            errors.city ? 'border-red-400' : 'border-white/20 focus:border-indigo-400'
                          }`}
                          placeholder="San Francisco"
                          required
                        />
                        {errors.city && (
                          <p className="text-xs text-red-400">{errors.city}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-300">State/Province *</label>
                        <input
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                            errors.state ? 'border-red-400' : 'border-white/20 focus:border-indigo-400'
                          }`}
                          placeholder="California"
                          required
                        />
                        {errors.state && (
                          <p className="text-xs text-red-400">{errors.state}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-300">ZIP/Postal Code *</label>
                        <input
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                            errors.zipCode ? 'border-red-400' : 'border-white/20 focus:border-indigo-400'
                          }`}
                          placeholder="94102"
                          required
                        />
                        {errors.zipCode && (
                          <p className="text-xs text-red-400">{errors.zipCode}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-300">Country *</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                            errors.country ? 'border-red-400' : 'border-white/20 focus:border-indigo-400'
                          }`}
                          required
                        >
                          <option value="" className="bg-slate-900 text-white">Select country</option>
                          <option value="US" className="bg-slate-900 text-white">United States</option>
                          <option value="CA" className="bg-slate-900 text-white">Canada</option>
                          <option value="UK" className="bg-slate-900 text-white">United Kingdom</option>
                          <option value="AU" className="bg-slate-900 text-white">Australia</option>
                        </select>
                        {errors.country && (
                          <p className="text-xs text-red-400">{errors.country}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Upload Your Resume</h2>
                  <p className="text-sm text-slate-300">Upload your resume in PDF or DOCX format</p>
                </div>

                <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-indigo-400 transition bg-white/5">
                  <i className="fa-solid fa-file-arrow-up text-4xl text-slate-300 mb-4"></i>
                  <p className="text-sm font-semibold text-white mb-2">Drop your resume here or click to browse</p>
                  <p className="text-xs text-slate-400 mb-4">PDF, DOCX up to 5MB</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'resumeFile')}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 cursor-pointer transition"
                  >
                    {uploadedResumeId ? 'Change File' : 'Choose File'}
                  </label>
                  {(formData.resumeFile || uploadedResumeInfo) && (
                    <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                      <p className="text-sm text-emerald-300 flex items-center justify-center mb-2">
                        <i className="fa-solid fa-check-circle mr-2"></i>
                        {formData.resumeFile ? formData.resumeFile.name : uploadedResumeInfo?.fileName || 'Resume uploaded'}
                      </p>
                      {uploadedResumeInfo && !formData.resumeFile && uploadedResumeInfo.presignedUrl && (
                        <div className="mt-2">
                          <iframe
                            src={uploadedResumeInfo.presignedUrl}
                            className="w-full h-64 rounded-lg border border-emerald-500/30"
                            title="Resume Preview"
                          />
                          <a
                            href={uploadedResumeInfo.presignedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-300 hover:text-emerald-200 mt-2 inline-block"
                          >
                            <i className="fa-solid fa-download mr-1"></i>
                            Download Resume
                          </a>
                        </div>
                      )}
                      {uploadedResumeInfo && !formData.resumeFile && (
                        <p className="text-xs text-emerald-400/80 mt-2 text-center">
                          Resume already uploaded. You can upload a new one to replace it.
                        </p>
                      )}
                    </div>
                  )}
                  {resumeUploadError && (
                    <ErrorMessage message={resumeUploadError} />
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Video Introduction</h2>
                  <p className="text-sm text-slate-300">Record or upload a short video introducing yourself</p>
                </div>

                {videoUploadError && (
                  <ErrorMessage message={videoUploadError} />
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Record Video Section */}
                  <div className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:border-indigo-400 transition bg-white/5">
                    <i className="fa-solid fa-video text-3xl text-slate-300 mb-3"></i>
                    <h3 className="text-sm font-semibold text-white mb-2">Record Video</h3>
                    <p className="text-xs text-slate-400 mb-4">Record directly from your camera</p>
                    
                    {!isRecording && !recordedVideo && (
                      <button
                        onClick={startRecording}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 cursor-pointer transition"
                      >
                        <i className="fa-solid fa-circle mr-2"></i>
                        Start Recording
                      </button>
                    )}

                    {isRecording && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 text-red-400">
                          <i className="fa-solid fa-circle animate-pulse"></i>
                          <span className="text-sm font-semibold">Recording...</span>
                        </div>
                        <button
                          onClick={stopRecording}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 cursor-pointer transition"
                        >
                          <i className="fa-solid fa-stop mr-2"></i>
                          Stop Recording
                        </button>
                      </div>
                    )}

                    {recordedVideo && !isRecording && (
                      <div className="space-y-3">
                        <p className="text-sm text-indigo-300">
                          <i className="fa-solid fa-check-circle mr-2"></i>
                          Video recorded ({Math.round(recordedVideo.size / 1024 / 1024 * 100) / 100} MB)
                        </p>
                        <video
                          src={URL.createObjectURL(recordedVideo)}
                          controls
                          className="w-full max-h-48 rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setRecordedVideo(null)
                            setFormData(prev => ({ ...prev, videoFile: null }))
                          }}
                          className="px-3 py-1 bg-slate-600 text-white rounded text-xs hover:bg-slate-700"
                        >
                          Record Again
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Upload Video Section */}
                  <div className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:border-indigo-400 transition bg-white/5">
                    <i className="fa-solid fa-file-arrow-up text-3xl text-slate-300 mb-3"></i>
                    <h3 className="text-sm font-semibold text-white mb-2">Upload Video</h3>
                    <p className="text-xs text-slate-400 mb-4">MP4, MOV, WebM up to 50MB</p>
                  <input
                    type="file"
                      accept="video/mp4,video/mov,video/webm"
                    onChange={(e) => handleFileChange(e, 'videoFile')}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 cursor-pointer transition"
                  >
                    {uploadedVideoInfo ? 'Change Video File' : 'Choose Video File'}
                  </label>
                    {(formData.videoFile || uploadedVideoInfo) && !recordedVideo && (
                      <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                        {formData.videoFile ? (
                          <div className="space-y-2">
                            <p className="text-sm text-emerald-300 flex items-center justify-center">
                              <i className="fa-solid fa-check-circle mr-2"></i>
                              {formData.videoFile.name}
                            </p>
                            <p className="text-xs text-slate-400 text-center">
                              {(formData.videoFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            {formData.videoFile.type.startsWith('video/') && (
                              <video
                                src={URL.createObjectURL(formData.videoFile)}
                                controls
                                className="w-full max-h-48 rounded-lg mt-2"
                              />
                            )}
                          </div>
                        ) : uploadedVideoInfo ? (
                          <div>
                            <p className="text-sm text-emerald-300 flex items-center justify-center mb-2">
                              <i className="fa-solid fa-check-circle mr-2"></i>
                              {uploadedVideoInfo.fileName || 'Video uploaded'}
                            </p>
                            {uploadedVideoInfo.presignedUrl && (
                              <div className="mt-2">
                                <video
                                  src={uploadedVideoInfo.presignedUrl}
                                  controls
                                  className="w-full max-h-48 rounded-lg"
                                />
                                <a
                                  href={uploadedVideoInfo.presignedUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-emerald-300 hover:text-emerald-200 mt-2 inline-block"
                                >
                                  <i className="fa-solid fa-download mr-1"></i>
                                  Download Video
                                </a>
                              </div>
                            )}
                            <p className="text-xs text-emerald-400/80 mt-2 text-center">
                              Video already uploaded. You can upload a new one to replace it.
                            </p>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-4 py-2 rounded-lg border border-white/30 text-white text-sm font-semibold transition ${
                  currentStep === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-white/10'
                }`}
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Back
              </button>
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={isSaving || isUploadingResume}
                  className={`px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition ${
                    isSaving || isUploadingResume ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </>
                  ) : isUploadingResume ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Uploading...
                    </>
                  ) : (
                    <>
                  Next
                  <i className="fa-solid fa-arrow-right ml-2"></i>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isUploadingVideo}
                  className={`px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition ${
                    isUploadingVideo ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isUploadingVideo ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Uploading Video...
                    </>
                  ) : (
                    <>
                  Complete Setup
                  <i className="fa-solid fa-check ml-2"></i>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Onboarding

