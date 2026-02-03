import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLogout } from '../hooks/useLogout'
import { checkOnboardingComplete } from '../utils/onboarding'
import { api } from '../utils/api'

const Header = ({
  userMode,
  userName,
  userAvatar,
  activeNav,
  onLogout,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()
  const defaultLogout = useLogout('/signin')
  const [onboardingComplete, setOnboardingComplete] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = React.useRef(null)
  
  const userRoles = user?.roles || []
  const isEmployer = Array.isArray(userRoles) && userRoles.includes('employer')

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])
  // Check onboarding completion (candidate only)
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isAuthenticated || isEmployer) {
        setOnboardingComplete(null)
        return
      }

      try {
        const complete = await checkOnboardingComplete(api)
        setOnboardingComplete(complete)
      } catch (error) {
        console.error('Error checking onboarding:', error)
        setOnboardingComplete(false)
      }
    }

    checkOnboarding()
  }, [isAuthenticated, isEmployer])
  
  // Determine if we should show user header
  // 1. If userMode is explicitly set, use it
  // 2. Otherwise, show user header if user is authenticated (regardless of route)
  const showUserHeader = userMode !== undefined 
    ? userMode 
    : isAuthenticated
  
  // Don't highlight any menu on onboarding routes
  const isOnboardingRoute = location.pathname.startsWith('/onboarding')
  const effectiveActiveNav = isOnboardingRoute ? null : (activeNav || null)
  
  // Get user info from auth state
  const displayName = userName || user?.firstName || user?.name || 'User'
  const displayAvatar = userAvatar || user?.avatar || user?.picture || 'https://i.pravatar.cc/64?img=4'
  
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      defaultLogout()
    }
  }
  
  return (
    <header id="header" className="bg-white shadow-sm border-b border-neutral-50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer hover:opacity-80 transition" 
          onClick={() => {
            navigate('/')
          }}
        >
          <img
            src="/logo.jpeg"
            alt="Logo"
            className="h-8 w-[4.2rem] rounded-lg object-cover"
          />
        </div>

        {showUserHeader ? (
          <>
            {/* User nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-800">
              {(isEmployer
                ? [
                    { name: 'Dashboard', path: '/employer-dashboard' },
                    { name: 'Post Job', path: '/employer-dashboard' },
                    { name: 'Shortlist', path: '/employer-dashboard' },
                  ]
                : [
                    { name: 'Dashboard', path: '/user-dashboard' },
                    { name: 'Job Matches', path: '/job-matches' },
                    { name: 'Assessments', path: '/assessments' },
                    { name: 'Applications', path: '#' },
                    { name: 'Messages', path: '#' },
                    { name: 'Profile', path: '#' },
                  ]
              ).map((item) => {
                const isDisabled = !isEmployer && onboardingComplete !== true
                const isComingSoon = item.path === '#'
                return (
                  <button
                    key={item.name}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()

                      if (isDisabled) {
                        navigate('/onboarding', { replace: true })
                        return
                      }
                      if (isComingSoon) {
                        return
                      }
                      navigate(item.path)
                    }}
                    disabled={isDisabled}
                    className={`pb-1 ${
                      isDisabled 
                        ? 'text-neutral-400 cursor-not-allowed opacity-50 pointer-events-auto' 
                        : effectiveActiveNav === item.name 
                          ? 'text-indigo-600 border-b-2 border-indigo-600' 
                          : isComingSoon
                            ? 'text-neutral-600 opacity-90 cursor-default hover:text-neutral-800'
                            : 'hover:text-indigo-600 transition cursor-pointer text-neutral-800'
                    }`}
                    title={isDisabled ? 'Complete onboarding to access this page' : isComingSoon ? 'Coming soon' : ''}
                  >
                    {item.name}
                  </button>
                )
              })}
            </nav>

            {/* User actions */}
            <div className="flex items-center gap-3 text-neutral-800">
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                >
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-semibold">{displayName}</span>
                  <i className={`fa-solid fa-chevron-down text-xs text-neutral-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        handleLogout()
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-red-50 hover:text-red-700 transition flex items-center"
                    >
                      <i className="fa-solid fa-right-from-bracket mr-2 text-red-600"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center text-neutral-900 font-medium hover:text-primary transition">
                  For Candidates
                  <i className="fa-solid fa-chevron-down ml-2 text-sm"></i>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-50 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <span 
                    className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer"
                    onClick={() => navigate('/job-matches')}
                  >
                    Browse Jobs
                  </span>
                  <span className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer">Take Assessment</span>
                  <span className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer">Career Resources</span>
                  <span className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer">Relocation Guide</span>
                </div>
              </div>
              <div className="relative group">
                <button className="flex items-center text-neutral-900 font-medium hover:text-primary transition">
                  For Employers
                  <i className="fa-solid fa-chevron-down ml-2 text-sm"></i>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-50 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <span
                    className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer"
                    onClick={() => navigate('/employer-signin?intent=employer')}
                  >
                    Post Jobs
                  </span>
                  <span className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer">Talent Pool</span>
                  <span className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer">Assessment Tools</span>
                  <span className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer">Enterprise</span>
                </div>
              </div>
              <span className="text-neutral-900 font-medium hover:text-primary transition cursor-pointer">Resources</span>
              <span className="text-neutral-900 font-medium hover:text-primary transition cursor-pointer">About</span>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {!isAuthenticated && (
                <>
                  <button 
                    className="bg-white border border-neutral-200 text-neutral-900 px-2.5 py-1.5 rounded-lg text-sm font-medium hover:bg-neutral-50 transition flex items-center shadow-sm"
                    onClick={() => navigate('/employer-signin?next=' + encodeURIComponent('/employer-dashboard'))}
                  >
                    <div className="w-4 h-4 bg-neutral-900 rounded-full flex items-center justify-center mr-1.5">
                      <i className="fa-solid fa-plus text-white text-[10px]"></i>
                    </div>
                    Post a Job
                  </button>
                  <button 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2.5 py-1.5 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition flex items-center shadow-sm"
                    onClick={() => navigate('/signin?next=' + encodeURIComponent('/upload-resume'))}
                  >
                    <i className="fa-solid fa-video w-3.5 h-3.5 mr-1.5"></i>
                    Upload Resume
                  </button>
                </>
              )}
              {isAuthenticated && (
                <>
                  <button 
                    className="bg-white border border-neutral-200 text-neutral-900 px-2.5 py-1.5 rounded-lg text-sm font-medium hover:bg-neutral-50 transition flex items-center shadow-sm"
                    onClick={() => {
                      const roles = user?.roles || []
                      const hasEmployerRole = Array.isArray(roles) && roles.includes('employer')
                      if (hasEmployerRole) {
                        navigate('/employer-dashboard')
                      } else {
                        // Role mismatch - redirect to user dashboard
                        navigate('/user-dashboard')
                      }
                    }}
                  >
                    <div className="w-4 h-4 bg-neutral-900 rounded-full flex items-center justify-center mr-1.5">
                      <i className="fa-solid fa-plus text-white text-[10px]"></i>
                    </div>
                    Post a Job
                  </button>
                  <button 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2.5 py-1.5 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition flex items-center shadow-sm"
                    onClick={() => {
                      const roles = user?.roles || []
                      const hasEmployerRole = Array.isArray(roles) && roles.includes('employer')
                      const hasUserRole = roles.includes('user') || (!hasEmployerRole && roles.length === 0)
                      if (hasUserRole) {
                        navigate('/upload-resume')
                      } else {
                        // Role mismatch - redirect to employer dashboard
                        navigate('/employer-dashboard')
                      }
                    }}
                  >
                    <i className="fa-solid fa-video w-3.5 h-3.5 mr-1.5"></i>
                    Upload Resume
                  </button>
                </>
              )}
              {isAuthenticated && (
                <div className="flex items-center gap-3 text-neutral-800">
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                    >
                      <img
                        src={displayAvatar}
                        alt={displayName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-semibold">{displayName}</span>
                      <i className={`fa-solid fa-chevron-down text-xs text-neutral-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false)
                            handleLogout()
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-red-50 hover:text-red-700 transition flex items-center"
                        >
                          <i className="fa-solid fa-right-from-bracket mr-2 text-red-600"></i>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <button className="lg:hidden text-neutral-900">
                <i className="fa-solid fa-bars text-xl"></i>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
