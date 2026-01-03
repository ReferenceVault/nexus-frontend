import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
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
  const { isAuthenticated, user, logout } = useAuth()
  const [onboardingComplete, setOnboardingComplete] = useState(null)
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false)
  
  // Check onboarding completion
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isAuthenticated) {
        setOnboardingComplete(null)
        return
      }

      setIsCheckingOnboarding(true)
      try {
        const complete = await checkOnboardingComplete(api)
        setOnboardingComplete(complete)
      } catch (error) {
        console.error('Error checking onboarding:', error)
        setOnboardingComplete(false)
      } finally {
        setIsCheckingOnboarding(false)
      }
    }

    checkOnboarding()
  }, [isAuthenticated])
  
  // Determine if we should show user header
  // 1. If userMode is explicitly set, use it
  // 2. Otherwise, show user header if user is authenticated (regardless of route)
  const isProtectedRoute = location.pathname.startsWith('/onboarding') || 
                          location.pathname.startsWith('/user-dashboard') ||
                          location.pathname.startsWith('/assessments') ||
                          location.pathname.startsWith('/analysis') ||
                          location.pathname.startsWith('/create-profile') ||
                          location.pathname.startsWith('/import-profile') ||
                          location.pathname.startsWith('/job-matches') ||
                          location.pathname.startsWith('/job-details')
  
  const showUserHeader = userMode !== undefined 
    ? userMode 
    : isAuthenticated
  
  // Don't highlight any menu on onboarding routes
  const isOnboardingRoute = location.pathname.startsWith('/onboarding')
  const effectiveActiveNav = isOnboardingRoute ? null : (activeNav || null)
  
  // Disable navigation if onboarding is not complete
  // Only allow navigation if onboarding is explicitly complete (true)
  // Block if null (checking), false (incomplete), or undefined
  const canNavigate = onboardingComplete === true
  
  // Get user info from auth state
  const displayName = userName || user?.firstName || user?.name || 'User'
  const displayAvatar = userAvatar || user?.avatar || user?.picture || 'https://i.pravatar.cc/64?img=4'
  
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      logout()
      navigate('/signin')
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
              {[
                { name: 'Dashboard', path: '/user-dashboard' },
                { name: 'Job Matches', path: '/job-matches' },
                { name: 'Assessments', path: '/assessments' },
                { name: 'Applications', path: '#' },
                { name: 'Messages', path: '#' },
                { name: 'Profile', path: '#' }
              ].map((item) => {
                // Disable ALL menu items if onboarding is not explicitly complete
                // Only enable if onboardingComplete === true
                const isDisabled = onboardingComplete !== true
                const isComingSoon = item.path === '#'
                return (
                  <button
                    key={item.name}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      
                      // If onboarding not complete, redirect to onboarding
                      if (isDisabled) {
                        navigate('/onboarding', { replace: true })
                        return
                      }
                      
                      // If coming soon, do nothing (but button is still enabled for visual consistency)
                      if (isComingSoon) {
                        return
                      }
                      
                      // Navigate to the path
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
                    title={isDisabled ? 'Complete onboarding (upload resume and video) to access this page' : isComingSoon ? 'Coming soon' : ''}
                  >
                    {item.name}
                  </button>
                )
              })}
            </nav>

            {/* User actions */}
            <div className="flex items-center gap-3 text-neutral-800">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-sm font-semibold">{displayName}</span>
              </div>
              <button
                className="bg-white border border-slate-200 text-neutral-900 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
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
                  <span className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer">Post Jobs</span>
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
                    onClick={() => navigate('/create-profile')}
                  >
                    <div className="w-4 h-4 bg-neutral-900 rounded-full flex items-center justify-center mr-1.5">
                      <i className="fa-solid fa-plus text-white text-[10px]"></i>
                    </div>
                    Post a Job
                  </button>
                  <button 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2.5 py-1.5 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition flex items-center shadow-sm"
                    onClick={() => navigate('/signin')}
                  >
                    <i className="fa-solid fa-video w-3.5 h-3.5 mr-1.5"></i>
                    Upload Resume
                  </button>
                </>
              )}
              {isAuthenticated && (
                <div className="flex items-center gap-3 text-neutral-800">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
                    <img
                      src={displayAvatar}
                      alt={displayName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-semibold">{displayName}</span>
                  </div>
                  <button
                    className="bg-white border border-slate-200 text-neutral-900 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
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
