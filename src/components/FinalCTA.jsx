import React from 'react'
import { useNavigate } from 'react-router-dom'

const FinalCTA = () => {
  const navigate = useNavigate()
  return (
    <section id="final-cta" className="relative overflow-hidden py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          Ready to Transform Your Career?
        </h2>
        <p className="text-base sm:text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who've found their dream jobs through Nexus Recruitment. Your next opportunity is waiting.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-12">
          <button 
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition flex items-center justify-center shadow-lg"
            onClick={() => navigate('/create-profile')}
          >
            <i className="fa-solid fa-rocket mr-2"></i>
            Start Your Journey
          </button>
          <button 
            className="border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition flex items-center justify-center"
            onClick={() => navigate('/demo')}
          >
            <i className="fa-solid fa-play mr-2"></i>
            Watch Demo
          </button>
        </div>

        <div className="text-center">
          <p className="text-slate-400 text-sm mb-4">Trusted by professionals worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-300 text-sm">
            <div className="flex items-center">
              <i className="fa-solid fa-shield-check mr-2"></i>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-globe mr-2"></i>
              <span>Global Opportunities</span>
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-star mr-2"></i>
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA
