import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLogout } from '../../hooks/useLogout'

const RoleAccessDenied = ({ requiredRole, currentPath }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const logout = useLogout()

  const userRoles = user?.roles || []
  const hasBothRoles = userRoles.includes('user') && userRoles.includes('employer')
  const isEmployerRoute = requiredRole === 'employer'
  const signupPath = isEmployerRoute ? '/employer-signup' : '/signup'
  const roleName = isEmployerRoute ? 'employer' : 'job seeker'

  const handleLogoutAndSignup = () => {
    logout()
    navigate(signupPath)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <i className="fa-solid fa-lock text-red-600 text-2xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Access Denied</h2>
        <p className="text-neutral-600 mb-6">
          You need a <span className="font-semibold">{roleName}</span> account to access this page.
        </p>
        {hasBothRoles ? (
          <div className="space-y-3">
            <p className="text-sm text-neutral-500 mb-4">
              You have both roles. Please switch to the {roleName} account.
            </p>
            <button
              onClick={() => {
                const dashboard = isEmployerRoute ? '/employer-dashboard' : '/user-dashboard'
                navigate(dashboard)
              }}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              Switch to {roleName === 'employer' ? 'Employer' : 'Job Seeker'} Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-neutral-500 mb-4">
              Please logout and signup with the {roleName} role to access this page.
            </p>
            <button
              onClick={handleLogoutAndSignup}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              Logout and Signup as {roleName === 'employer' ? 'Employer' : 'Job Seeker'}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-neutral-100 text-neutral-700 py-3 rounded-lg font-semibold hover:bg-neutral-200 transition"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoleAccessDenied
