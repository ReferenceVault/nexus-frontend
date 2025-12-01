import React from 'react'

const Footer = () => {
  return (
    <footer id="footer" className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-network-wired text-white text-lg"></i>
              </div>
              <span className="ml-3 text-2xl font-bold">Nexus</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md leading-relaxed">Connecting exceptional talent with outstanding opportunities worldwide. Fair, transparent, and focused on your success.</p>
            <div className="flex space-x-3">
              <span className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition cursor-pointer">
                <i className="fa-brands fa-twitter"></i>
              </span>
              <span className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition cursor-pointer">
                <i className="fa-brands fa-linkedin"></i>
              </span>
              <span className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition cursor-pointer">
                <i className="fa-brands fa-github"></i>
              </span>
              <span className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition cursor-pointer">
                <i className="fa-brands fa-instagram"></i>
              </span>
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="font-semibold text-white mb-5">For Candidates</h4>
            <ul className="space-y-3">
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">Browse Jobs</span></li>
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">Take Assessments</span></li>
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">Career Resources</span></li>
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">Relocation Guide</span></li>
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">Success Stories</span></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold text-white mb-5">For Employers</h4>
            <ul className="space-y-3">
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">Post Jobs</span></li>
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">Talent Pool</span></li>
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">Assessment Tools</span></li>
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">Enterprise</span></li>
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">API Documentation</span></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-5">Company</h4>
            <ul className="space-y-3">
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">About Us</span></li>
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">Careers</span></li>
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">Press</span></li>
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">Contact</span></li>
              <li><span className="text-slate-400 hover:text-white transition cursor-pointer text-sm">Help Center</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © 2024 Nexus. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
              <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
              <span className="hover:text-white transition cursor-pointer">Cookie Policy</span>
              <span className="hover:text-white transition cursor-pointer">GDPR</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer



