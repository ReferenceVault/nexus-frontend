import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SocialSidebar from '../components/SocialSidebar'
import { api } from '../utils/api'
import { useAuth } from '../hooks/useAuth'
import ErrorMessage from '../components/common/ErrorMessage'
import { isTokenExpired, authenticatedFetch } from '../utils/apiClient'

const EmployerAuth = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, setLoading, isLoading, error, setError, clearError, isAuthenticated, accessToken, user, logout } = useAuth()
  const justSignedUpRef = useRef(false)
  
  // This page is for employers only
  // Read next param from query string for redirect after login
  const searchParams = new URLSearchParams(location.search)
  const next = searchParams.get('next')

  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname
    return path === '/employer-signup' ? 'signup' : 'signin'
  })

  useEffect(() => {
    const path = location.pathname
    if (path === '/employer-signup') {
      setActiveTab('signup')
    } else if (path === '/employer-signin') {
      setActiveTab('signin')
    }
  }, [location.pathname])

  // Centralized helper: Resolve employer redirect destination
  // Differentiates between "profile not found" (404) and real API/network errors
  const resolveEmployerRedirect = async () => {
    try {
      // Use authenticatedFetch directly to check response status before handleApiError
      // Pass retryOn401=false to preserve 401 status for handling
      const response = await authenticatedFetch('/employers/me', {}, false)
      
      if (response.ok) {
        // Profile exists - redirect to dashboard
        await response.json().catch(() => {}) // Consume response body
        return { path: '/employer-dashboard', error: null }
      } else if (response.status === 404) {
        // Profile not found (404) - redirect to onboarding
        // This is expected for new employers who haven't completed onboarding
        await response.json().catch(() => {}) // Consume response body if any
        return { path: '/employer-onboarding', error: null }
      } else if (response.status === 401) {
        // Unauthorized - token refresh will handle logout via authenticatedFetch
        // Return null to prevent redirect, let auth system handle it
        return { path: null, error: null }
      } else {
        // Other API error (500, 403, etc.) - show error, don't redirect
        // This prevents silently redirecting users to onboarding on server errors
        const errorData = await response.json().catch(() => ({ message: 'Failed to load employer profile' }))
        return { path: null, error: errorData.message || 'Failed to load employer profile' }
      }
    } catch (error) {
      // Network error or token refresh failure
      const errorMessage = error.message || 'Network error. Please check your connection and try again.'
      
      // If it's a session expiry error, don't show it here - let token refresh handle it
      if (errorMessage.includes('Session expired') || errorMessage.includes('sign in again')) {
        // Token refresh will handle logout, just return null to prevent redirect
        return { path: null, error: null }
      }
      
      // Real network error - show error, don't redirect
      // This prevents silently redirecting users to onboarding on network failures
      return { path: null, error: errorMessage }
    }
  }

  useEffect(() => {
    // Skip if we just signed up (signup handles its own redirect)
    if (justSignedUpRef.current) {
      justSignedUpRef.current = false
      return
    }

    // Handle expired token: force logout if token is expired but user appears authenticated
    if (isAuthenticated && accessToken && isTokenExpired(accessToken)) {
      console.warn('Token expired on auth page - forcing logout')
      logout()
      setError('Your session has expired. Please sign in again.')
      return
    }

    // Only redirect if authenticated with valid token
    if (isAuthenticated && accessToken && !isTokenExpired(accessToken)) {
      // Get next param from query string
      const searchParams = new URLSearchParams(location.search)
      const next = searchParams.get('next')
      
      // If next param exists, redirect to it
      if (next) {
        const nextPath = decodeURIComponent(next)
        navigate(nextPath, { replace: true })
        return
      }
      
      // Resolve employer redirect using centralized helper
      resolveEmployerRedirect().then(({ path, error: redirectError }) => {
        if (redirectError) {
          // Real API/network error - show error, don't redirect
          setError(redirectError)
        } else if (path) {
          // Store dashboard type for back button navigation
          if (path === '/employer-dashboard') {
            sessionStorage.setItem('lastDashboardType', 'employer')
          }
          // Valid redirect path - navigate
          navigate(path, { replace: true })
        }
        // If path is null and no error, token refresh is handling logout
      })
    }
  }, [isAuthenticated, accessToken, user, navigate, logout, location.search])

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  })

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

    try {
      // Pass 'employer' as expected role for employer login
      const response = await api.login(signInData.email, signInData.password, 'employer')
      
      // Get next param from query string
      const searchParams = new URLSearchParams(location.search)
      const next = searchParams.get('next')

      // Set auth state - useEffect will handle redirect
      login(response.user, response.tokens)

      // If next param exists, redirect to it
      if (next) {
        const nextPath = decodeURIComponent(next)
        navigate(nextPath, { replace: true })
        setLoading(false)
        return
      }
    } catch (err) {
      const errorMessage = err.message || 'Invalid email or password'
      setError(errorMessage)
      setErrors({ submit: errorMessage })
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
      const response = await api.employerSignup(
        signUpData.email,
        signUpData.firstName,
        signUpData.lastName,
        signUpData.password
      )

      justSignedUpRef.current = true
      login(response.user, response.tokens)
      navigate('/employer-onboarding', { replace: true })
    } catch (err) {
      const errorMessage = err.message || 'Signup failed. Please try again.'
      setError(errorMessage)
      setErrors({ submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    // Use employer-specific endpoint which sets state=employer
    // Intent is preserved via OAuth state parameter
    window.location.href = `${API_BASE_URL}/auth/employer/google`
  }

  const switchTab = (tab) => {
    setActiveTab(tab)
    setErrors({})
    clearError()
    // Preserve next param when switching tabs
    const searchParams = new URLSearchParams(location.search)
    const nextParam = searchParams.get('next')
    const url = tab === 'signup' ? '/employer-signup' : '/employer-signin'
    const finalUrl = nextParam ? `${url}?next=${encodeURIComponent(nextParam)}` : url
    navigate(finalUrl, { replace: true })
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Header />
      <SocialSidebar position="left" />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 md:px-[15%] pt-11 pb-12 sm:pt-12 sm:pb-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full backdrop-blur-sm">
                  <i className="fa-solid fa-lock text-indigo-300 text-sm"></i>
                  <span className="text-xs font-semibold">Secure Employer Access</span>
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full backdrop-blur-sm mb-4">
                    <i className="fa-solid fa-building text-indigo-300"></i>
                    <span className="text-sm font-semibold">For Employers</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                    Hire Top{' '}
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Tech Talent
                    </span>
                  </h1>
                  <p className="text-base md:text-lg text-slate-300 leading-relaxed">
                    Post jobs, review AI‑ranked candidates, and make confident hiring decisions faster.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: 'fa-bolt', title: 'Post in minutes', text: 'Create a role and start matching instantly' },
                    { icon: 'fa-user-check', title: 'AI Shortlists', text: 'Ranked candidates based on job fit' },
                    { icon: 'fa-chart-line', title: 'Smarter hiring', text: 'Skill gaps and fit analysis in one view' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3 group">
                      <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <i className={`fa-solid ${item.icon} text-white text-lg`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1 text-base">{item.title}</h3>
                        <p className="text-slate-300 text-sm">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative overflow-hidden rounded-xl border border-indigo-400/20 bg-white/10 backdrop-blur-sm p-5 shadow-xl shadow-indigo-500/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_55%)]" />
                  <div className="relative flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-white font-bold text-base">AC</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <h4 className="font-semibold text-white text-sm">Alicia Chen</h4>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="fa-solid fa-star text-yellow-400 text-xs"></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-200 italic leading-relaxed">
                        "We filled a critical role in 7 days using the AI shortlist. It saved our team weeks."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-indigo-200/50 p-6 md:p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-100/30 pointer-events-none" />
                  <div className="relative">
                    <div className="flex gap-1.5 mb-6 bg-indigo-100/50 p-1.5 rounded-lg border border-indigo-200/50">
                      <button
                        onClick={() => switchTab('signin')}
                        className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                          activeTab === 'signin'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                            : 'text-neutral-600 hover:text-primary hover:bg-white/50'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => switchTab('signup')}
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
                        <div className="text-center mb-6">
                          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                            Employer Sign In
                          </h2>
                          <p className="text-xs text-neutral-500">Sign in to your employer account</p>
                          <div className="mt-3 text-xs text-neutral-600">
                            Are you a job seeker?{' '}
                            <button
                              type="button"
                              onClick={() => {
                                const next = new URLSearchParams(location.search).get('next')
                                const url = next 
                                  ? `/signin?next=${encodeURIComponent(next)}`
                                  : '/signin'
                                navigate(url, { replace: true })
                              }}
                              className="text-indigo-600 hover:text-indigo-700 font-semibold"
                            >
                              Sign in as job seeker
                            </button>
                          </div>
                        </div>
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

                          <button
                            type="submit"
                            disabled={!signInData.email || !signInData.password || isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                          </button>

                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={handleGoogleAuth}
                              className="w-full inline-flex items-center justify-center py-3.5 px-6 border-2 border-neutral-300 rounded-xl bg-white text-neutral-700 font-semibold hover:bg-indigo-50 hover:border-primary transition-all duration-300"
                            >
                              <i className="fa-brands fa-google text-indigo-600 mr-2 text-sm"></i>
                              <span>Sign in with Google</span>
                            </button>
                          </div>
                        </form>
                      </>
                      ) : (
                        <>
                          <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                              Create Employer Account
                            </h2>
                            <p className="text-xs text-neutral-500 mb-3">Start hiring top tech talent</p>
                            <div className="text-xs text-neutral-600">
                              Are you a job seeker?{' '}
                              <button
                                type="button"
                                onClick={() => {
                                  const next = new URLSearchParams(location.search).get('next')
                                  const url = next 
                                    ? `/signup?next=${encodeURIComponent(next)}`
                                    : '/signup'
                                  navigate(url, { replace: true })
                                }}
                                className="text-indigo-600 hover:text-indigo-700 font-semibold"
                              >
                                Sign up as job seeker
                              </button>
                            </div>
                          </div>
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
                              placeholder="you@company.com"
                              disabled={isLoading}
                            />
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

                          <button
                            type="submit"
                            disabled={!signUpData.firstName || !signUpData.lastName || !signUpData.email || !signUpData.password || !signUpData.confirmPassword || isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            {isLoading ? 'Creating account...' : 'Create Employer Account'}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-gradient-to-br from-slate-50 to-white py-12 px-6 md:px-[15%]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-transparent to-transparent" />
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { value: '2K+', label: 'Employer Teams', icon: 'fa-building' },
                { value: '18K+', label: 'Open Roles', icon: 'fa-briefcase' },
                { value: '4.7', label: 'Hiring Satisfaction', icon: 'fa-star', isRating: true },
                { value: '65%', label: 'Faster Shortlists', icon: 'fa-bolt' }
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

        <section className="relative bg-white py-16 px-6 md:px-[15%]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-50 via-transparent to-transparent" />
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-100/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-700 mb-4">
                Employer Benefits
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                Hire with confidence
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Verified candidate data and AI insights help you make faster, better decisions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: 'fa-user-check',
                  title: 'Verified profiles',
                  description: 'Review candidate insights, skills, and fit in one view',
                  color: 'from-green-500 to-green-600'
                },
                {
                  icon: 'fa-filter',
                  title: 'Smarter filters',
                  description: 'Shortlists prioritize required skills and job match',
                  color: 'from-indigo-500 to-purple-600'
                },
                {
                  icon: 'fa-shield-halved',
                  title: 'Secure hiring',
                  description: 'Enterprise‑grade security for employer and candidate data',
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

        <section className="relative bg-gradient-to-br from-slate-50 to-white py-16 px-6 md:px-[15%]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-transparent to-transparent" />
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-100/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-700 mb-4">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                What employers say
              </h2>
              <p className="text-lg text-neutral-600">
                Trusted by growing teams across industries
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  name: 'Maya Singh',
                  location: 'Toronto',
                  quote: '"The AI shortlist helped us focus on the top 10% of applicants in hours, not days."',
                  initials: 'MS',
                  gradient: 'from-blue-500 to-indigo-600'
                },
                {
                  name: 'Daniel Kim',
                  location: 'Vancouver',
                  quote: '"We reduced time‑to‑hire by 40% and improved the quality of interviews."',
                  initials: 'DK',
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

        <section className="relative bg-white py-16 px-6 md:px-[15%]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-50 via-transparent to-transparent" />
          <div className="relative max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-100/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-700 mb-4">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                Employer questions
              </h2>
              <p className="text-lg text-neutral-600">
                Everything about employer accounts and job posting
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: 'How long does it take to post a job?',
                  answer: 'Most employers can publish a role in under 5 minutes using our guided flow.'
                },
                {
                  question: 'How are candidates matched?',
                  answer: 'We compare your job requirements with candidate skills and resume insights to generate a fit score.'
                },
                {
                  question: 'Can I edit a job after publishing?',
                  answer: 'Yes. Update the job details and we will refresh the AI matches for you.'
                },
                {
                  question: 'Is candidate data secure?',
                  answer: 'Yes. We use encryption and strict access controls to protect candidate information.'
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_55%)]" />
                  <div className="relative p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-neutral-900 text-lg group-hover:text-primary transition-colors flex-1">
                        {faq.question}
                      </h3>
                      <i className="fa-solid fa-chevron-down text-primary flex-shrink-0"></i>
                    </div>
                    <div className="mt-4">
                      <p className="text-neutral-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default EmployerAuth
