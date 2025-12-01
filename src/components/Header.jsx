import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  return (
    <header id="header" className="bg-white shadow-sm border-b border-neutral-50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-network-wired text-white text-lg"></i>
            </div>
            <span className="ml-3 text-2xl font-bold text-neutral-900">Nexus</span>
          </div>

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
              onClick={() => navigate('/create-profile')}
            >
              <i className="fa-solid fa-video w-3.5 h-3.5 mr-1.5"></i>
              Upload Resume
            </button>
            <button className="lg:hidden text-neutral-900">
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
