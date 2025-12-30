import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { api } from '../utils/api'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setErrors({ token: 'Invalid or missing reset token' })
    }
  }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
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
    if (!token) {
      setErrors({ token: 'Invalid or missing reset token' })
      return
    }

    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      await api.resetPassword(token, formData.password)
      setSuccess(true)
      setTimeout(() => {
        navigate('/signin')
      }, 3000)
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to reset password. The token may be invalid or expired.' })
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="bg-white text-neutral-900">
        <Header />
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-8 lg:py-12">
          <div className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <i className="fa-solid fa-exclamation-triangle text-red-600 text-2xl"></i>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Invalid Reset Link</h2>
              <p className="text-sm text-slate-600 mb-4">
                The password reset link is invalid or has expired.
              </p>
              <button
                onClick={() => navigate('/forgot-password')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg px-6 py-2 text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Request New Reset Link
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
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

        <div className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-lock text-white text-xl"></i>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              {success ? 'Password Reset Successful!' : 'Reset Your Password'}
            </h1>
            <p className="text-base sm:text-lg text-slate-300">
              {success
                ? 'Your password has been reset. Redirecting to sign in...'
                : 'Enter your new password below'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8 space-y-6">
              {success ? (
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                    <i className="fa-solid fa-check-circle text-emerald-600 text-2xl"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">Success!</h2>
                  <p className="text-sm text-slate-600">
                    Your password has been successfully reset.
                  </p>
                  <p className="text-xs text-slate-500">
                    Redirecting to sign in page...
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center space-y-1">
                    <div className="text-base font-semibold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      New Password
                    </div>
                    <div className="text-sm font-semibold text-slate-400">
                      Choose a strong password
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
                      {errors.submit}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        New Password *
                      </label>
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
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Confirm Password *
                      </label>
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
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          <span>Resetting Password...</span>
                        </>
                      ) : (
                        <>
                          <span>Reset Password</span>
                          <i className="fa-solid fa-arrow-right text-sm"></i>
                        </>
                      )}
                    </button>

                    <div className="text-center text-xs text-slate-600">
                      Remember your password?{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/signin')}
                        className="text-indigo-500 hover:text-indigo-600 font-medium"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ResetPassword

