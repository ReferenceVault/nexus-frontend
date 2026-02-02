import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SocialSidebar from '../components/SocialSidebar'
import { api } from '../utils/api'
import { useAuth } from '../hooks/useAuth'
import ErrorMessage from '../components/common/ErrorMessage'
import { isTokenExpired } from '../utils/apiClient'
import { checkOnboardingComplete } from '../utils/onboarding'

const CombinedAuth = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, setLoading, isLoading, error, setError, clearError, setSignupData, isAuthenticated, accessToken, user } = useAuth()
  const justSignedUpRef = useRef(false)
  
  // This page is for jobseekers/users only
  // Read next param from query string for redirect after login
  const searchParams = new URLSearchParams(location.search)
  const next = searchParams.get('next')
  // Determine initial tab based on route or default to 'signin'
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname
    return path === '/signup' ? 'signup' : 'signin'
  })

  const [expandedFaq, setExpandedFaq] = useState(null)

  // Update tab when route changes
  useEffect(() => {
    const path = location.pathname
    if (path === '/signup') {
      setActiveTab('signup')
    } else if (path === '/signin') {
      setActiveTab('signin')
    }
  }, [location.pathname])


  // Redirect if already authenticated (but not during sign-in flow)
  // This useEffect is the ONLY place that performs redirects after auth
  const isHandlingLoginRef = useRef(false)
  
  useEffect(() => {
    // Skip if we just signed up (signup handles its own redirect)
    if (justSignedUpRef.current) {
      justSignedUpRef.current = false
      return
    }
    
    // Skip if we're currently handling login (prevents race condition)
    if (isHandlingLoginRef.current) {
      return
    }
    
    // Only redirect if authenticated with valid token
    if (isAuthenticated && accessToken && !isTokenExpired(accessToken)) {
      // Handle next param if present
      if (next) {
        const nextPath = decodeURIComponent(next)
        navigate(nextPath, { replace: true })
        isHandlingLoginRef.current = false
        return
      }
      
      // Default to user flow - check onboarding
      const checkOnboarding = async () => {
        try {
          const onboardingComplete = await checkOnboardingComplete(api)
          const path = onboardingComplete ? '/user-dashboard' : '/onboarding'
          sessionStorage.setItem('lastDashboardType', 'user')
          navigate(path, { replace: true })
          isHandlingLoginRef.current = false
        } catch (error) {
          console.error('Error checking onboarding:', error)
          navigate('/onboarding', { replace: true })
          isHandlingLoginRef.current = false
        }
      }
      checkOnboarding()
    }
  }, [isAuthenticated, accessToken, navigate, user, next])

  // Sign In form state
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  })

  // Sign Up form state
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSignInPassword, setShowSignInPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSignInInputChange = (e) => {
    const { name, value } = e.target
    setSignInData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    clearError()
  }

  const handleSignUpInputChange = (e) => {
    const { name, value } = e.target
    setSignUpData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    clearError()
  }

  const validateSignUpForm = () => {
    const newErrors = {}
    if (!signUpData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!signUpData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!signUpData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!signUpData.password) {
      newErrors.password = 'Password is required'
    } else if (signUpData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignIn = async (e) => {
    e?.preventDefault()
    setLoading(true)
    clearError()
    isHandlingLoginRef.current = true // Prevent useEffect from interfering during auth
    
    try {
      // Pass 'user' as expected role for job seeker login
      const response = await api.login(signInData.email, signInData.password, 'user')
      
      // Set auth state - useEffect will handle redirect
      login(response.user, response.tokens)
      
      // Clear flag immediately after login - useEffect will run on next render cycle
      // This allows useEffect to perform redirect after state updates
      isHandlingLoginRef.current = false
    } catch (error) {
      const errorMessage = error.message || 'Invalid email or password'
      setError(errorMessage)
      setErrors({ submit: errorMessage })
      isHandlingLoginRef.current = false // Clear flag on error
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!validateSignUpForm()) return

    setLoading(true)
    clearError()
    try {
      const response = await api.signup(
        signUpData.email,
        signUpData.firstName,
        signUpData.lastName,
        signUpData.password
      )
      
      justSignedUpRef.current = true
      
      setSignupData({
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        email: signUpData.email,
      })
      
      login(response.user, response.tokens)
      
      navigate('/onboarding', { replace: true })
    } catch (error) {
      const errorMessage = error.message || 'Signup failed. Please try again.'
      setError(errorMessage)
      setErrors({ submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    // This page is for jobseekers/users - use regular Google auth endpoint
    window.location.href = `${API_BASE_URL}/auth/google`
  }

  const switchTab = (tab) => {
    setActiveTab(tab)
    setErrors({})
    clearError()
    // Preserve next param when switching tabs
    const searchParams = new URLSearchParams(location.search)
    const nextParam = searchParams.get('next')
    const url = tab === 'signup' ? '/signup' : '/signin'
    const finalUrl = nextParam ? `${url}?next=${encodeURIComponent(nextParam)}` : url
    navigate(finalUrl, { replace: true })
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Header />
      <SocialSidebar position="left" />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 md:px-[15%] pt-11 pb-12 sm:pt-12 sm:pb-16">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_60%),radial-gradient(circle_at_center,rgba(99,102,241,0.10),transparent_65%)]" />
          </div>
          
          <div className="relative mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
              
              {/* Left Section - Informational Panel */}
              <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full backdrop-blur-sm">
                  <i className="fa-solid fa-lock text-indigo-300 text-sm"></i>
                  <span className="text-xs font-semibold">Secure Authentication</span>
                </div>

                {/* Main Heading */}
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded-full backdrop-blur-sm mb-4">
                    <i className="fa-solid fa-user-tie text-purple-300"></i>
                    <span className="text-sm font-semibold">For Job Seekers</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                    Find Your Dream{' '}
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Tech Job
                    </span>
                  </h1>
                  <p className="text-base md:text-lg text-slate-300 leading-relaxed">
                    Create your profile, upload your resume, and get matched with top tech companies in Canada.
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <i className="fa-solid fa-bolt text-white text-lg"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1 text-base">Quick Setup</h3>
                      <p className="text-slate-300 text-sm">Get verified in under 2 minutes with secure authentication</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <i className="fa-solid fa-lock text-white text-lg"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1 text-base">Bank-Level Security</h3>
                      <p className="text-slate-300 text-sm">Your data is encrypted and never shared publicly</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <i className="fa-solid fa-users text-white text-lg"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1 text-base">Trusted Community</h3>
                      <p className="text-slate-300 text-sm">Join thousands of verified users on India's safest recruitment platform</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial Card */}
                <div className="relative overflow-hidden rounded-xl border border-indigo-400/20 bg-white/10 backdrop-blur-sm p-5 shadow-xl shadow-indigo-500/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_55%)]" />
                  <div className="relative flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-white font-bold text-base">PS</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <h4 className="font-semibold text-white text-sm">Priya Sharma</h4>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="fa-solid fa-star text-yellow-400 text-xs"></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-200 italic leading-relaxed">
                        "Found my perfect job match in 5 days! The verification process made me feel completely safe."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Sign In / Sign Up Forms */}
              <div className="relative">
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-indigo-200/50 p-6 md:p-8 overflow-hidden">
                  {/* Decorative gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-100/30 pointer-events-none" />
                  
                  <div className="relative">
                    {/* Tab Switcher */}
                    <div className="flex gap-1.5 mb-6 bg-indigo-100/50 p-1.5 rounded-lg border border-indigo-200/50">
                      <button
                        onClick={() => {
                          switchTab('signin')
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                          activeTab === 'signin'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                            : 'text-neutral-600 hover:text-primary hover:bg-white/50'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          switchTab('signup')
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                          activeTab === 'signup'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                            : 'text-neutral-600 hover:text-primary hover:bg-white/50'
                        }`}
                      >
                        Sign Up
                      </button>
                    </div>

                    {activeTab === 'signin' ? (
                      <>
                        {/* Heading */}
                        <div className="text-center mb-6">
                          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                            Welcome Back
                          </h2>
                          <p className="text-xs text-neutral-500">Sign in to your job seeker account</p>
                          <div className="mt-3 text-xs text-neutral-600">
                            Are you an employer?{' '}
                            <button
                              type="button"
                              onClick={() => {
                                const next = new URLSearchParams(location.search).get('next')
                                const url = next 
                                  ? `/employer-signin?next=${encodeURIComponent(next)}`
                                  : '/employer-signin'
                                navigate(url, { replace: true })
                              }}
                              className="text-indigo-600 hover:text-indigo-700 font-semibold"
                            >
                              Sign in as employer
                            </button>
                          </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSignIn} className="space-y-4">
                          <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                              Email address
                            </label>
                            <input
                              id="email"
                              type="email"
                              name="email"
                              value={signInData.email}
                              onChange={handleSignInInputChange}
                              className={`w-full px-3.5 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                error && !signInData.password 
                                  ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                                  : 'border-neutral-200 focus:ring-primary focus:border-primary'
                              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-white/80 hover:border-indigo-300'}`}
                              placeholder="Enter your email"
                              disabled={isLoading}
                              autoFocus
                            />
                          </div>

                          <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-2">
                              Password
                            </label>
                            <div className="relative">
                              <input
                                id="password"
                                type={showSignInPassword ? 'text' : 'password'}
                                name="password"
                                value={signInData.password}
                                onChange={handleSignInInputChange}
                                className={`w-full px-3.5 py-3 pr-10 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                  error && signInData.password 
                                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                                    : 'border-neutral-200 focus:ring-primary focus:border-primary'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-white/80 hover:border-indigo-300'}`}
                                placeholder="Enter your password"
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                onClick={() => setShowSignInPassword(!showSignInPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-primary transition-colors"
                              >
                                <i className={`fa-solid ${showSignInPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                              </button>
                            </div>
                          </div>

                          <ErrorMessage error={error || errors.submit} onDismiss={clearError} />

                          {/* Remember me and Forgot password */}
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary cursor-pointer"
                              />
                              <span className="text-sm text-neutral-700 group-hover:text-neutral-900">Remember me</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => navigate('/forgot-password')}
                              className="text-sm font-semibold text-primary hover:text-indigo-700 transition-colors"
                            >
                              Forgot password?
                            </button>
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={!signInData.email || !signInData.password || isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                          >
                            {isLoading ? (
                              <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                <span>Signing in...</span>
                              </>
                            ) : (
                              <span>Sign In</span>
                            )}
                          </button>
                        </form>

                        {/* Or continue with */}
                        <div className="mt-6">
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-neutral-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-3 bg-white/90 text-neutral-500 font-medium">Or continue with</span>
                            </div>
                          </div>
                        </div>

                        {/* Sign in with Google */}
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={handleGoogleAuth}
                            className="w-full inline-flex items-center justify-center py-3.5 px-6 border-2 border-neutral-300 rounded-xl bg-white text-neutral-700 font-semibold hover:bg-indigo-50 hover:border-primary transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span>Sign in with Google</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Heading */}
                        <div className="text-center mb-8">
                          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                            Create Account
                          </h2>
                          <p className="text-xs text-neutral-500 mb-3">Start your job search journey</p>
                          <div className="text-xs text-neutral-600">
                            Are you an employer?{' '}
                            <button
                              type="button"
                              onClick={() => {
                                const next = new URLSearchParams(location.search).get('next')
                                const url = next 
                                  ? `/employer-signup?next=${encodeURIComponent(next)}`
                                  : '/employer-signup'
                                navigate(url, { replace: true })
                              }}
                              className="text-indigo-600 hover:text-indigo-700 font-semibold"
                            >
                              Sign up as employer
                            </button>
                          </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSignUp} className="space-y-5">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="signup-firstName" className="block text-sm font-semibold text-neutral-700 mb-2">
                                First Name
                              </label>
                              <input
                                id="signup-firstName"
                                type="text"
                                name="firstName"
                                value={signUpData.firstName}
                                onChange={handleSignUpInputChange}
                                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                  errors.firstName 
                                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                                    : 'border-neutral-200 focus:ring-primary focus:border-primary'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-white/80 hover:border-indigo-300'}`}
                                placeholder="John"
                                disabled={isLoading}
                              />
                              {errors.firstName && (
                                <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                              )}
                            </div>
                            <div>
                              <label htmlFor="signup-lastName" className="block text-sm font-semibold text-neutral-700 mb-2">
                                Last Name
                              </label>
                              <input
                                id="signup-lastName"
                                type="text"
                                name="lastName"
                                value={signUpData.lastName}
                                onChange={handleSignUpInputChange}
                                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                  errors.lastName 
                                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                                    : 'border-neutral-200 focus:ring-primary focus:border-primary'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-white/80 hover:border-indigo-300'}`}
                                placeholder="Doe"
                                disabled={isLoading}
                              />
                              {errors.lastName && (
                                <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label htmlFor="signup-email" className="block text-sm font-semibold text-neutral-700 mb-2">
                              Email address
                            </label>
                            <input
                              id="signup-email"
                              type="email"
                              name="email"
                              value={signUpData.email}
                              onChange={handleSignUpInputChange}
                              className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                errors.email 
                                  ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                                  : 'border-neutral-200 focus:ring-primary focus:border-primary'
                              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-white/80 hover:border-indigo-300'}`}
                              placeholder="Enter your email"
                              disabled={isLoading}
                            />
                            {errors.email && (
                              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="signup-password" className="block text-sm font-semibold text-neutral-700 mb-2">
                              Password
                            </label>
                            <div className="relative">
                              <input
                                id="signup-password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={signUpData.password}
                                onChange={handleSignUpInputChange}
                                className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                  errors.password && !errors.confirmPassword 
                                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                                    : 'border-neutral-200 focus:ring-primary focus:border-primary'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-white/80 hover:border-indigo-300'}`}
                                placeholder="At least 8 characters"
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-primary transition-colors"
                              >
                                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                              </button>
                            </div>
                            {errors.password && (
                              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="signup-confirm-password" className="block text-sm font-semibold text-neutral-700 mb-2">
                              Confirm Password
                            </label>
                            <div className="relative">
                              <input
                                id="signup-confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={signUpData.confirmPassword}
                                onChange={handleSignUpInputChange}
                                className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                  errors.confirmPassword 
                                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                                    : 'border-neutral-200 focus:ring-primary focus:border-primary'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-white/80 hover:border-indigo-300'}`}
                                placeholder="Confirm your password"
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-primary transition-colors"
                              >
                                <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                              </button>
                            </div>
                            {errors.confirmPassword && (
                              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                            )}
                          </div>

                          <ErrorMessage error={error || errors.submit} onDismiss={clearError} />

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={!signUpData.firstName || !signUpData.lastName || !signUpData.email || !signUpData.password || !signUpData.confirmPassword || isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                          >
                            {isLoading ? (
                              <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                <span>Creating account...</span>
                              </>
                            ) : (
                              <span>Create Account</span>
                            )}
                          </button>
                        </form>

                        {/* Or continue with */}
                        <div className="mt-6">
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-neutral-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-3 bg-white/90 text-neutral-500 font-medium">Or continue with</span>
                            </div>
                          </div>
                        </div>

                        {/* Sign up with Google */}
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={handleGoogleAuth}
                            className="w-full inline-flex items-center justify-center py-3.5 px-6 border-2 border-neutral-300 rounded-xl bg-white text-neutral-700 font-semibold hover:bg-indigo-50 hover:border-primary transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span>Sign up with Google</span>
                          </button>
                        </div>
                      </>
                    )}

                    {/* Security Badges */}
                    <div className="mt-6 pt-6 border-t border-neutral-200 flex justify-center gap-6">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-lock text-primary text-sm"></i>
                        <span className="text-xs text-neutral-600 font-medium">Secure</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-shield-halved text-primary text-sm"></i>
                        <span className="text-xs text-neutral-600 font-medium">Encrypted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-check text-primary text-sm"></i>
                        <span className="text-xs text-neutral-600 font-medium">256-bit SSL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="relative bg-gradient-to-br from-slate-50 to-white py-12 px-6 md:px-[15%]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-transparent to-transparent" />
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { value: '50K+', label: 'Verified Users', icon: 'fa-users' },
                { value: '15K+', label: 'Active Listings', icon: 'fa-check-circle' },
                { value: '4.8', label: 'User Rating', icon: 'fa-star', isRating: true },
                { value: '₹2Cr+', label: 'Brokerage Saved', icon: 'fa-bolt' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {stat.isRating ? (
                        <i className="fa-solid fa-star text-yellow-300 text-lg"></i>
                      ) : (
                        <i className={`fa-solid ${stat.icon} text-white text-lg`}></i>
                      )}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1.5">
                      {stat.isRating ? (
                        <span className="flex items-center justify-center gap-1">
                          <span>{stat.value}</span>
                          <i className="fa-solid fa-star text-yellow-400 text-sm"></i>
                        </span>
                      ) : (
                        stat.value
                      )}
                    </div>
                    <div className="text-xs md:text-sm text-neutral-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Verify Section */}
        <section className="relative bg-white py-16 px-6 md:px-[15%]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-50 via-transparent to-transparent" />
          <div className="relative max-w-6xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-100/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-700 mb-4">
                Why Verify?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                Your safety and privacy come first
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                We've built multiple layers of security to keep you and your information safe
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: 'fa-check-circle',
                  title: 'Verified Community',
                  description: 'All users are verified with secure authentication for maximum safety',
                  color: 'from-green-500 to-green-600'
                },
                {
                  icon: 'fa-lock',
                  title: 'Data Privacy',
                  description: 'Your information stays private and is never shared with other users',
                  color: 'from-indigo-500 to-purple-600'
                },
                {
                  icon: 'fa-shield-halved',
                  title: 'Data Protection',
                  description: 'Bank-level encryption ensures your personal information stays secure',
                  color: 'from-purple-500 to-pink-600'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-white to-indigo-50/30 p-8 shadow-xl shadow-indigo-100/40 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_55%)]" />
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <i className={`fa-solid ${feature.icon} text-white text-xl`}></i>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                    <p className="text-neutral-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative bg-gradient-to-br from-slate-50 to-white py-16 px-6 md:px-[15%]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-transparent to-transparent" />
          <div className="relative max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-100/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-700 mb-4">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                What our users say
              </h2>
              <p className="text-lg text-neutral-600">
                Trusted by thousands of job seekers
              </p>
            </div>

            {/* Testimonial Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  name: 'Rahul Verma',
                  location: 'Bangalore',
                  quote: '"The verification process was so quick and easy! I felt safe knowing everyone on the platform is verified. Found my dream job in just 3 days."',
                  initials: 'RV',
                  gradient: 'from-blue-500 to-indigo-600'
                },
                {
                  name: 'Anjali Desai',
                  location: 'Pune',
                  quote: '"Love that my data stays private! The secure authentication gave me confidence that I\'m dealing with a trusted platform."',
                  initials: 'AD',
                  gradient: 'from-purple-500 to-pink-600'
                }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-white to-indigo-50/30 p-8 shadow-xl shadow-indigo-100/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_55%)]" />
                  <div className="relative">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star text-yellow-400 text-lg"></i>
                      ))}
                    </div>
                    <p className="text-neutral-700 mb-6 italic leading-relaxed">
                      {testimonial.quote}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <span className="text-white font-semibold text-lg">{testimonial.initials}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                        <div className="text-sm text-neutral-600">{testimonial.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative bg-white py-16 px-6 md:px-[15%]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-50 via-transparent to-transparent" />
          <div className="relative max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-100/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-700 mb-4">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                Common questions
              </h2>
              <p className="text-lg text-neutral-600">
                Everything about our platform
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {[
                {
                  question: 'Why do I need to create an account?',
                  answer: 'Creating an account ensures all users are verified, creating a safe and trusted community. It also helps us prevent spam and protect your information.'
                },
                {
                  question: 'Will my information be shared publicly?',
                  answer: 'Never! Your personal information is kept completely private and encrypted. Other users cannot see it. All communication happens through secure channels.'
                },
                {
                  question: 'How secure is my data?',
                  answer: 'We use bank-level 256-bit SSL encryption to protect your information. Your data is stored on secure servers and never shared with third parties.'
                },
                {
                  question: 'Can I delete my account?',
                  answer: 'Yes! You can delete your account at any time from your profile settings. All your data will be permanently removed from our systems.'
                }
              ].map((faq, index) => {
                const isExpanded = expandedFaq === index
                return (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    onClick={() => setExpandedFaq(isExpanded ? null : index)}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_55%)]" />
                    <div className="relative p-6">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className={`font-semibold text-neutral-900 text-lg group-hover:text-primary transition-colors flex-1 ${isExpanded ? 'text-primary' : ''}`}>
                          {faq.question}
                        </h3>
                        <i className={`fa-solid fa-chevron-down text-primary flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
                      </div>
                      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 mt-4' : 'max-h-0 mt-0'}`}>
                        <p className="text-neutral-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default CombinedAuth
