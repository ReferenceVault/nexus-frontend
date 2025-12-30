import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { api } from '../utils/api'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.forgotPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
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
              <i className="fa-solid fa-key text-white text-xl"></i>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Forgot Password?
            </h1>
            <p className="text-base sm:text-lg text-slate-300">
              {success
                ? 'Check your email for password reset instructions'
                : 'Enter your email address and we\'ll send you a link to reset your password'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8 space-y-6">
              {success ? (
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                    <i className="fa-solid fa-envelope-circle-check text-emerald-600 text-2xl"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">Email Sent!</h2>
                  <p className="text-sm text-slate-600">
                    We've sent password reset instructions to <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-slate-500">
                    Please check your inbox and follow the link to reset your password.
                  </p>
                  <div className="pt-4 space-y-2">
                    <button
                      onClick={() => navigate('/signin')}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-600/30"
                    >
                      Back to Sign In
                    </button>
                    <button
                      onClick={() => {
                        setSuccess(false)
                        setEmail('')
                      }}
                      className="w-full text-sm text-slate-600 hover:text-slate-900 font-medium"
                    >
                      Resend Email
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center space-y-1">
                    <div className="text-base font-semibold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Reset Password
                    </div>
                    <div className="text-sm font-semibold text-slate-400">
                      Enter your email to receive reset instructions
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Reset Link</span>
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

export default ForgotPassword

