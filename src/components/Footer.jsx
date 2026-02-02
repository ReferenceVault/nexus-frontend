import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Footer = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  // Footer link styles - centralized to reduce redundancy
  const footerLinkClass = "text-neutral-600 hover:text-indigo-600 transition-colors text-sm cursor-pointer flex items-center group"
  const footerArrowIcon = <i className="fa-solid fa-arrow-right text-xs ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"></i>

  const renderFooterLink = (label, onClick = null) => {
    const content = (
      <>
        {label}
        {footerArrowIcon}
      </>
    )
    
    if (onClick) {
      return (
        <button onClick={onClick} className={footerLinkClass}>
          {content}
        </button>
      )
    }
    return (
      <span className={footerLinkClass}>
        {content}
      </span>
    )
  }

  return (
    <footer id="footer" className="bg-gradient-to-br from-indigo-100/40 via-blue-50/30 to-purple-100/40 border-t border-indigo-200/50 relative overflow-hidden">
      {/* Gradient overlay with blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-300/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-300/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/logo.jpeg"
                alt="Logo"
                className="h-10 w-[5.25rem] rounded-lg object-cover"
              />
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">CIPNexus</span>
            </div>
            <p className="text-neutral-600 mb-6 max-w-md leading-relaxed text-sm">
              Connecting exceptional talent with outstanding opportunities worldwide. Fair, transparent, and focused on your success.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all duration-300 cursor-pointer group"
                aria-label="Twitter"
              >
                <i className="fa-brands fa-twitter text-neutral-600 group-hover:text-white transition-colors"></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all duration-300 cursor-pointer group"
                aria-label="LinkedIn"
              >
                <i className="fa-brands fa-linkedin text-neutral-600 group-hover:text-white transition-colors"></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all duration-300 cursor-pointer group"
                aria-label="GitHub"
              >
                <i className="fa-brands fa-github text-neutral-600 group-hover:text-white transition-colors"></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all duration-300 cursor-pointer group"
                aria-label="Instagram"
              >
                <i className="fa-brands fa-instagram text-neutral-600 group-hover:text-white transition-colors"></i>
              </a>
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4 text-sm">For Candidates</h4>
            <ul className="space-y-2.5">
              <li>{renderFooterLink('Browse Jobs', () => navigate('/job-matches'))}</li>
              <li>{renderFooterLink('Take Assessments', () => navigate('/assessments'))}</li>
              <li>{renderFooterLink('Career Resources')}</li>
              <li>{renderFooterLink('Relocation Guide')}</li>
              <li>{renderFooterLink('Success Stories')}</li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4 text-sm">For Employers</h4>
            <ul className="space-y-2.5">
              <li>{renderFooterLink('Post Jobs', () => {
                if (!isAuthenticated || !user) {
                  navigate('/employer-signin?next=' + encodeURIComponent('/employer-dashboard'))
                } else {
                  const roles = user?.roles || []
                  const hasEmployerRole = Array.isArray(roles) && roles.includes('employer')
                  if (hasEmployerRole) {
                    navigate('/employer-dashboard')
                  } else {
                    navigate('/user-dashboard')
                  }
                }
              })}</li>
              <li>{renderFooterLink('Talent Pool')}</li>
              <li>{renderFooterLink('Assessment Tools')}</li>
              <li>{renderFooterLink('Enterprise')}</li>
              <li>{renderFooterLink('API Documentation')}</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5">
              <li>{renderFooterLink('About Us')}</li>
              <li>{renderFooterLink('Careers')}</li>
              <li>{renderFooterLink('Press')}</li>
              <li>{renderFooterLink('Contact')}</li>
              <li>{renderFooterLink('Help Center')}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-200 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-neutral-500 text-xs">
              © 2025 CIPNexus. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-xs">
              <button className="text-neutral-500 hover:text-indigo-600 transition-colors cursor-pointer">
                Privacy Policy
              </button>
              <button className="text-neutral-500 hover:text-indigo-600 transition-colors cursor-pointer">
                Terms of Service
              </button>
              <button className="text-neutral-500 hover:text-indigo-600 transition-colors cursor-pointer">
                Cookie Policy
              </button>
              <button className="text-neutral-500 hover:text-indigo-600 transition-colors cursor-pointer">
                GDPR
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
