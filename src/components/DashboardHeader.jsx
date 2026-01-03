import React, { useState, useRef, useEffect } from 'react'

const DashboardHeader = ({
  userName,
  userEmail,
  userInitial,
  onProfile,
  onLogout,
  breadcrumbs = [],
  title,
  subtitle
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
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
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
      <div className="flex">
        {/* Logo section - 70px from left (30px + 40px) */}
        <div className="pl-[70px] flex items-center flex-shrink-0">
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/'
              }
            }}
          >
            <img
              src="/logo.jpeg"
              alt="Logo"
              className="h-12 w-[6.75rem] rounded-lg object-cover"
            />
          </div>
        </div>
        
        {/* Spacer to push breadcrumbs to align with content (sidebar w-72 = 288px + padding = 320px total) */}
        <div className="flex-shrink-0" style={{ width: 'calc(288px + 32px - 70px - 108px)' }}></div>
        
        {/* Main header content - aligned with content area */}
        <div className="flex-1 pr-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Breadcrumbs - aligned with content start */}
            <div className="flex items-center">
              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <nav className="flex items-center space-x-2 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <i className="fa-solid fa-chevron-right text-neutral-400 text-xs"></i>
                      )}
                      {crumb.href ? (
                        <a
                          href={crumb.href}
                          className="text-neutral-600 hover:text-primary transition-colors"
                        >
                          {crumb.label}
                        </a>
                      ) : (
                        <span className={index === breadcrumbs.length - 1 ? 'text-neutral-900 font-medium' : 'text-neutral-600'}>
                          {crumb.label}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              )}
            </div>

            {/* Right: User Menu */}
            <div className="flex items-center space-x-3">
              {/* Bell Icon with Notification */}
              <button
                className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Notifications"
              >
                <i className="fa-solid fa-bell text-lg"></i>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Heart Icon */}
              <button
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Favorites"
              >
                <i className="fa-solid fa-heart text-lg"></i>
              </button>

              {/* User Avatar with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
                  title="User menu"
                >
                  {userInitial}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-neutral-200">
                      <div className="font-semibold text-neutral-900 text-sm">{userName}</div>
                      <div className="text-xs text-neutral-600 mt-0.5">{userEmail}</div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onProfile()
                          setIsDropdownOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center gap-3"
                      >
                        <i className="fa-solid fa-eye text-neutral-500 w-4"></i>
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          onLogout()
                          setIsDropdownOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center gap-3"
                      >
                        <i className="fa-solid fa-sign-out-alt text-neutral-500 w-4"></i>
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Title and Subtitle Section - Only show if title exists and is not "Dashboard" */}
          {title && title !== 'Dashboard' && (title || subtitle) && (
            <div className="pb-4 pt-2">
              {title && (
                <h1 className="text-2xl font-bold text-neutral-900 mb-1">{title}</h1>
              )}
              {subtitle && (
                <p className="text-sm text-neutral-600">{subtitle}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader

