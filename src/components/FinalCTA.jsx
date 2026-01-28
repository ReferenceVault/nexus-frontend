import React from 'react'
import { useNavigate } from 'react-router-dom'
import AnimatedBackground from './common/AnimatedBackground'

const FinalCTA = () => {
  const navigate = useNavigate()
  return (
    <section id="final-cta" className="relative overflow-hidden py-12 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <AnimatedBackground />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
          Ready to Transform Your Tech Career in Canada?
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mb-6 max-w-2xl mx-auto">
          CIP Nexus is the AI recruitment marketplace connecting you to Canada's top tech companies, roles and salaries.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-8">
          <button 
            className="bg-white text-indigo-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-50 transition flex items-center justify-center shadow-lg"
            onClick={() => navigate('/create-profile')}
          >
            <i className="fa-solid fa-rocket mr-1.5 text-xs"></i>
            Get Started – It's Free
          </button>
          <button 
            className="border border-white/30 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition flex items-center justify-center"
            onClick={() => navigate('/demo')}
          >
            <i className="fa-solid fa-play mr-1.5 text-xs"></i>
            Watch how to get Started?
          </button>
        </div>

        <div className="text-center">
          <p className="text-slate-400 text-xs mb-3">Trusted by Tech Professionals</p>
          <div className="flex flex-wrap justify-center items-center gap-4 text-slate-300 text-xs">
            <div className="flex items-center">
              <i className="fa-solid fa-shield-check mr-1.5"></i>
              <span>Privacy-First Platform</span>
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-map-marker-alt mr-1.5"></i>
              <span>Canada-Focused Roles</span>
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-star mr-1.5"></i>
              <span>4.9★ Rated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA
