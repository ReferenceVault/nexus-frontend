import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuth } from './useAuth'

export const useLogout = (redirectPath = '/') => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  return useCallback(async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      logout()
      navigate(redirectPath)
    }
  }, [logout, navigate, redirectPath])
}
