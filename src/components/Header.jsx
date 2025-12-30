import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = ({
  userMode = false,
  userName = 'Alex Kim',
  userAvatar = 'https://i.pravatar.cc/64?img=4',
  activeNav = 'Job Matches',
  onLogout = () => {},
}) => {
  const navigate = useNavigate()
  return (
    <header id="header" className="bg-white shadow-sm border-b border-neutral-50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <img
            src="/logo.jpeg"
            alt="Logo"
            className="h-10 w-[5.25rem] rounded-lg object-cover"
          />
        </div>

        {userMode ? (
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
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => item.path !== '#' && navigate(item.path)}
                  className={`pb-1 ${activeNav === item.name ? 'text-indigo-600 border-b-2 border-indigo-600' : 'hover:text-indigo-600 transition'}`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* User actions */}
            <div className="flex items-center gap-3 text-neutral-800">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-sm font-semibold">{userName}</span>
              </div>
              <button
                className="bg-white border border-slate-200 text-neutral-900 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
                onClick={onLogout}
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
                onClick={() => {
                  // Check if user is logged in
                  const accessToken = localStorage.getItem('accessToken')
                  if (accessToken) {
                    // User is logged in, go to dashboard
                    navigate('/user-dashboard')
                  } else {
                    // No token, check if email exists in localStorage (user might have signed up before)
                    const userEmail = localStorage.getItem('signupEmail')
                    if (userEmail) {
                      // User exists, redirect to signin
                      navigate('/signin')
                    } else {
                      // New user, redirect to signup
                      navigate('/signup')
                    }
                  }
                }}
              >
                <i className="fa-solid fa-video w-3.5 h-3.5 mr-1.5"></i>
                Upload Resume
              </button>
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
