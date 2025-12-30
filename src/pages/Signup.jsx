import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { api } from '../utils/api'
import { useAuth } from '../hooks/useAuth'
import FormInput from '../components/common/FormInput'
import ErrorMessage from '../components/common/ErrorMessage'
import { isTokenExpired } from '../utils/apiClient'

const Signup = () => {
  const navigate = useNavigate()
  const { login, setLoading, isLoading, error, setError, clearError, setSignupData, isAuthenticated, accessToken } = useAuth()
  const justSignedUpRef = useRef(false)

  // Redirect if already authenticated (but not if we just signed up)
  useEffect(() => {
    // Don't redirect if we just completed signup - let handleSubmit handle the redirect
    if (justSignedUpRef.current) {
      justSignedUpRef.current = false
      return
    }
    
    if (isAuthenticated && accessToken && !isTokenExpired(accessToken)) {
      navigate('/user-dashboard', { replace: true })
    }
  }, [isAuthenticated, accessToken, navigate])
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    clearError()
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    clearError()
    try {
      const response = await api.signup(
        formData.email,
        formData.firstName,
        formData.lastName,
        formData.password
      )
      
      // Set flag to prevent useEffect from redirecting
      justSignedUpRef.current = true
      
      // Store signup data for onboarding prefilling (before login to avoid race conditions)
      setSignupData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      })
      
      // Login using Redux
      login(response.user, response.tokens)
      
      // Immediately redirect to onboarding for new users
      // Using replace: true to prevent back navigation
      navigate('/onboarding', { replace: true })
    } catch (error) {
      const errorMessage = error.message || 'Signup failed. Please try again.'
      setError(errorMessage)
      setErrors({ submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    // Redirect to backend Google OAuth endpoint
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    window.location.href = `${API_BASE_URL}/auth/google`
  }

  return (
    <div className="bg-white text-neutral-900">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-8 lg:py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-user-plus text-white text-xl"></i>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Create Your Account
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto">
              Join thousands of professionals finding their dream jobs
            </p>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-1">
                <div className="text-base font-semibold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Sign up
                </div>
                <div className="text-sm font-semibold text-slate-400">Create your profile and get started</div>
              </div>

              <ErrorMessage error={error || errors.submit} onDismiss={clearError} />

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        errors.firstName
                          ? 'border-red-300 focus:ring-red-200'
                          : 'border-slate-200 focus:ring-indigo-200'
                      }`}
                      placeholder="John"
                      required
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        errors.lastName
                          ? 'border-red-300 focus:ring-red-200'
                          : 'border-slate-200 focus:ring-indigo-200'
                      }`}
                      placeholder="Doe"
                      required
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-slate-200 focus:ring-indigo-200'
                    }`}
                    placeholder="your@email.com"
                    required
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 ${
                        errors.password
                          ? 'border-red-300 focus:ring-red-200'
                          : 'border-slate-200 focus:ring-indigo-200'
                      }`}
                      placeholder="At least 8 characters"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 ${
                        errors.confirmPassword
                          ? 'border-red-300 focus:ring-red-200'
                          : 'border-slate-200 focus:ring-indigo-200'
                      }`}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <i className="fa-solid fa-arrow-right text-sm"></i>
                    </>
                  )}
                </button>

                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span>Or continue with</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full flex items-center justify-center rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50 py-2.5 text-xs font-semibold hover:from-slate-100 hover:to-indigo-100 transition"
                >
                  <i className="fa-brands fa-google text-indigo-600 mr-2 text-sm"></i>
                  <span className="font-bold">Sign up with Google</span>
                </button>

                <div className="text-center text-xs text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signin')}
                    className="text-indigo-500 hover:text-indigo-600 font-medium"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Signup

