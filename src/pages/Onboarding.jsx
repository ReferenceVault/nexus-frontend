import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { setOnboardingStatus, OnboardingStatus, completeOnboarding } from '../utils/onboarding'
import { useAuth } from '../hooks/useAuth'
import { api } from '../utils/api'
import ErrorMessage from '../components/common/ErrorMessage'

const Onboarding = () => {
  const navigate = useNavigate()
  const { signupData, user, updateUser, accessToken, isAuthenticated } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const [resumeUploadError, setResumeUploadError] = useState(null)
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

  useEffect(() => {
    // Prefill data from signup or user data
    if (signupData?.firstName || signupData?.lastName || signupData?.email) {
      setFormData(prev => ({
        ...prev,
        firstName: signupData.firstName || prev.firstName,
        lastName: signupData.lastName || prev.lastName,
        email: signupData.email || prev.email,
      }))
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
      }))
    }
  }, [signupData, user])

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
    setFormData(prev => ({ ...prev, [field]: file }))
    // Clear error when file is selected
    if (field === 'resumeFile') {
      setResumeUploadError(null)
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

      // Upload resume to S3
      const uploaded = await uploadResume()
      if (!uploaded) {
        return
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

  const [showCompletion, setShowCompletion] = useState(false)

  const handleSubmit = () => {
    // Show completion screen
    setShowCompletion(true)
  }

  const handleGoToDashboard = () => {
    // Complete onboarding
    completeOnboarding()
    // Navigate to dashboard
    navigate('/user-dashboard')
  }

  const steps = [
    { number: 1, title: 'Basic Information', icon: 'fa-user' },
    { number: 2, title: 'Upload Resume', icon: 'fa-file-arrow-up' },
    { number: 3, title: 'Video Introduction', icon: 'fa-video' }
  ]

  return (
    <div className="bg-slate-50 text-neutral-900 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {showCompletion ? (
          <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-6 lg:py-9">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Profile Complete Section */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 mb-3">
                  <i className="fa-solid fa-check text-white text-lg"></i>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-1.5 flex items-center justify-center gap-2">
                  <i className="fa-solid fa-party-horn text-yellow-400 text-sm"></i>
                  Profile Complete!
                </h1>
                <p className="text-xs text-slate-300 mb-4">Your onboarding is complete and AI feedback is on the way</p>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-xl mx-auto mb-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm p-3">
                    <div className="text-xl font-bold text-indigo-300 mb-0.5">5.42</div>
                    <div className="text-[10px] text-slate-400">Time to Complete</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm p-3">
                    <div className="text-xl font-bold text-indigo-300 mb-0.5">100%</div>
                    <div className="text-[10px] text-slate-400">Profile Completeness</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm p-3">
                    <div className="text-xl font-bold text-indigo-300 mb-0.5">Top 15%</div>
                    <div className="text-[10px] text-slate-400">Candidate Quality</div>
                  </div>
                </div>

                {/* Go to Dashboard Button */}
                <button
                  onClick={handleGoToDashboard}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                >
                  View Your Dashboard <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
                </button>
              </div>

              {/* AI Analysis Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2">
                  <div className="flex items-center gap-2 text-white">
                    <i className="fa-solid fa-robot text-base"></i>
                    <div>
                      <h2 className="text-base font-bold">AI Analysis in Progress</h2>
                      <p className="text-[10px] text-indigo-100">Our AI is analyzing your profile and preparing personalized feedback</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    {/* Resume Analysis */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <i className="fa-solid fa-file-lines text-indigo-300 text-xs"></i>
                          <h3 className="font-semibold text-white text-xs">Resume Analysis</h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                          <span>Processing...</span>
                          <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-[10px]">
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <i className="fa-solid fa-check text-xs"></i>
                          <span>Document parsed successfully</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <i className="fa-solid fa-check text-xs"></i>
                          <span>Skills extracted and categorized</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <i className="fa-solid fa-circle text-[8px]"></i>
                          <span>Analyzing content quality and impact</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <i className="fa-solid fa-circle text-[8px]"></i>
                          <span>Generating improvement suggestions</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="text-lg font-bold text-indigo-300">~3 mins</div>
                        <div className="text-[10px] text-slate-400">Estimated completion</div>
                      </div>
                    </div>

                    {/* Video Analysis */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <i className="fa-solid fa-video text-indigo-300 text-xs"></i>
                          <h3 className="font-semibold text-white text-xs">Video Analysis</h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                          <span>Processing...</span>
                          <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-[10px]">
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <i className="fa-solid fa-check text-xs"></i>
                          <span>Video uploaded and transcribed</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <i className="fa-solid fa-circle text-[8px]"></i>
                          <span>Analyzing communication clarity</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <i className="fa-solid fa-circle text-[8px]"></i>
                          <span>Evaluating presentation quality</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <i className="fa-solid fa-circle text-[8px]"></i>
                          <span>Generating personalized tips</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="text-lg font-bold text-indigo-300">~5 mins</div>
                        <div className="text-[10px] text-slate-400">Estimated completion</div>
                      </div>
                    </div>
                  </div>

                  {/* Overall Progress */}
                  <div className="pt-3 border-t border-white/20">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-semibold text-white">Overall Progress</span>
                      <span className="text-[10px] font-semibold text-indigo-300">78%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mb-1.5">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-400">Your AI feedback will be ready in approximately 3-5 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
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
                    Choose File
                  </label>
                  {formData.resumeFile && (
                    <p className="mt-4 text-sm text-indigo-300">
                      <i className="fa-solid fa-check-circle mr-2"></i>
                      {formData.resumeFile.name}
                    </p>
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

                <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-indigo-400 transition bg-white/5">
                  <i className="fa-solid fa-video text-4xl text-slate-300 mb-4"></i>
                  <p className="text-sm font-semibold text-white mb-2">Upload your video introduction</p>
                  <p className="text-xs text-slate-400 mb-4">MP4, MOV up to 50MB (Recommended: 1-2 minutes)</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileChange(e, 'videoFile')}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 cursor-pointer transition"
                  >
                    Choose Video
                  </label>
                  {formData.videoFile && (
                    <p className="mt-4 text-sm text-indigo-300">
                      <i className="fa-solid fa-check-circle mr-2"></i>
                      {formData.videoFile.name}
                    </p>
                  )}
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
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Complete Setup
                  <i className="fa-solid fa-check ml-2"></i>
                </button>
              )}
            </div>
          </div>
          </div>
        </section>
        )}
      </main>
    </div>
  )
}

export default Onboarding

