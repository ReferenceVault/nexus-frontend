import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../utils/api'
import { isTokenExpired } from '../../utils/apiClient'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const { user, accessToken, updateUser, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)

  // Fetch current user on mount and when token changes
  useEffect(() => {
    const fetchCurrentUser = async () => {
      // Only fetch if we have a token
      if (!accessToken) {
        setLoading(false)
        return
      }

      // Skip if token is expired (apiClient will handle refresh)
      if (isTokenExpired(accessToken)) {
        setLoading(false)
        return
      }

      // Only fetch if user data is missing or incomplete
      if (user && user.id && user.email && user.roles) {
        setLoading(false)
        return
      }

      try {
        // Use getCurrentUser to get fresh role data from database (not from JWT token)
        const userData = await api.getCurrentUser()
        // Update user in Redux store only if data changed
        if (!user || user.id !== userData.id || JSON.stringify(user.roles || []) !== JSON.stringify(userData.roles || [])) {
          updateUser({
            id: userData.id,
            email: userData.email,
            roles: userData.roles || [],
            firstName: userData.firstName,
            lastName: userData.lastName,
          })
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error)
        // If fetch fails, user might not be authenticated
        // Don't clear user here - let the auth guard handle it
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentUser()
  }, [accessToken]) // Only depend on accessToken to avoid infinite loops

  const value = {
    user,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
