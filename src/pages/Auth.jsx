import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { api, authStorage } from '../utils/api'

const Signin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSignIn = async (e) => {
    e?.preventDefault()
    setLoading(true)
    try {
      const response = await api.login(formData.email, formData.password)
      
      // Store tokens
      authStorage.setTokens(response.tokens.accessToken, response.tokens.refreshToken)
      authStorage.setUserData(response.user)
      
      // Always redirect to dashboard after login
      navigate('/user-dashboard')
    } catch (error) {
      setErrors({ submit: error.message || 'Invalid email or password' })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignin = () => {
    // Redirect to backend Google OAuth endpoint
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    window.location.href = `${API_BASE_URL}/auth/google`
  }
  return (
    <div className="bg-white text-neutral-900">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-8 lg:py-12">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-rocket text-white text-xl"></i>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Launch Your Career with{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI-Powered Insights
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto">
              Get personalized feedback on your resume and video introduction. Complete your profile in minutes and start connecting with top employers.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-slate-200 text-sm">
              <div className="flex items-center space-x-2">
                <i className="fa-regular fa-clock text-indigo-300"></i>
                <span>5 min setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-shield-halved text-green-300"></i>
                <span>Secure &amp; Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-robot text-purple-300"></i>
                <span>AI-Powered Feedback</span>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-1">
                <div className="text-base font-semibold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Sign in
                </div>
                <div className="text-sm font-semibold text-slate-400">Access your profile and applications</div>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="Enter your password"
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
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-indigo-500 hover:text-indigo-600 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <i className="fa-solid fa-right-to-bracket text-sm"></i>
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
                  onClick={handleGoogleSignin}
                  className="w-full flex items-center justify-center rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50 py-2.5 text-xs font-semibold hover:from-slate-100 hover:to-indigo-100 transition"
                >
                  <i className="fa-brands fa-google text-indigo-600 mr-2 text-sm"></i>
                  <span className="font-bold">Sign in with Google</span>
                </button>

                <div className="text-center text-xs text-slate-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="text-indigo-500 hover:text-indigo-600 font-medium"
                  >
                    Sign up
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

export default Signin

