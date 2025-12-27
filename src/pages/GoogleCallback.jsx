import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authStorage } from '../utils/api'

const GoogleCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Extract tokens and user data from URL query params
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const userDataStr = searchParams.get('user')

    if (accessToken && refreshToken && userDataStr) {
      try {
        // Store tokens and user data
        authStorage.setTokens(accessToken, refreshToken)
        const userData = JSON.parse(decodeURIComponent(userDataStr))
        authStorage.setUserData(userData)

        // Redirect to dashboard
        navigate('/user-dashboard', { replace: true })
      } catch (error) {
        console.error('Error processing Google callback:', error)
        navigate('/signin', { replace: true })
      }
    } else {
      // Missing required params, redirect to signin
      navigate('/signin', { replace: true })
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <div className="text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg animate-spin">
          <i className="fa-solid fa-spinner text-white text-xl"></i>
        </div>
        <p className="text-white text-lg">Completing sign in...</p>
      </div>
    </div>
  )
}

export default GoogleCallback

