import React, { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'

const GoogleCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const processedRef = useRef(false)

  useEffect(() => {
    // Prevent multiple executions
    if (processedRef.current) return
    
    // Extract tokens and user data from URL query params
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const userDataStr = searchParams.get('user')

    if (accessToken && refreshToken && userDataStr) {
      processedRef.current = true
      try {
        // Parse user data and login using Redux
        const userData = JSON.parse(decodeURIComponent(userDataStr))
        login(userData, { accessToken, refreshToken })

        // Redirect to dashboard
        navigate('/user-dashboard', { replace: true })
      } catch (error) {
        console.error('Error processing Google callback:', error)
        navigate('/signin', { replace: true })
      }
    } else {
      processedRef.current = true
      // Missing required params, redirect to signin
      navigate('/signin', { replace: true })
    }
  }, [searchParams, navigate, login])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <LoadingSpinner text="Completing sign in..." />
    </div>
  )
}

export default GoogleCallback

