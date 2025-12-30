import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isTokenExpired, getValidAccessToken } from '../../utils/apiClient'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, accessToken, refreshToken } = useAuth()
  const [isValidating, setIsValidating] = useState(true)

  useEffect(() => {
    const validateToken = async () => {
      // If no tokens at all, skip validation
      if (!accessToken && !refreshToken) {
        setIsValidating(false)
        return
      }

      // If we have tokens, check if access token is valid
      if (accessToken && !isTokenExpired(accessToken)) {
        setIsValidating(false)
        return
      }

      // Access token expired or missing, try to refresh
      if (refreshToken) {
        try {
          await getValidAccessToken()
          // Token refreshed successfully
        } catch (error) {
          // Token refresh failed, user will be logged out by apiClient
          console.error('Token validation failed:', error)
        }
      }

      setIsValidating(false)
    }

    validateToken()
  }, [accessToken, refreshToken])

  if (isLoading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg animate-spin">
            <i className="fa-solid fa-spinner text-white text-xl"></i>
          </div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  return children
}

export default ProtectedRoute

