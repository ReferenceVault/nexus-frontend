import React from 'react'
import { useNavigate } from 'react-router-dom'
import AnimatedBackground from './common/AnimatedBackground'

const Hero = () => {
  const navigate = useNavigate()
  
  const popularSkills = [
    'React',
    'Node.js',
    'Python',
    'AWS',
    'Kubernetes',
    'TypeScript',
    'DevOps',
    'Machine Learning',
    'Go',
    'Rust',
    'Java',
    'Flutter'
  ]

  return (
    <section id="hero-section" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-6 pb-8 lg:pt-8 lg:pb-12">
      <AnimatedBackground />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-medium mb-4">
            <i className="fa-solid fa-sparkles w-3 h-3 mr-1.5"></i>
            The Future of IT Recruitment
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
            Where Top Tech Talent
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Gets Discovered
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Get discovered by top Canadian tech employers with AI-rated video resumes.
          </p>
        </div>

        {/* Two Cards Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {/* For Employers Card */}
          <div className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300">
            {/* Video Preview */}
            <div className="relative aspect-video bg-gradient-to-br from-indigo-600/50 to-indigo-900/50 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop" 
                alt="Two business professionals high-fiving across a desk with laptop" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-play text-white text-lg ml-1"></i>
                </div>
              </div>
              <div className="absolute top-3 left-3">
                <div className="px-3 py-1 rounded-full bg-indigo-500/80 text-white text-xs font-medium backdrop-blur-sm">
                  For Employers
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center">
                  <i className="fa-solid fa-building text-indigo-300 text-sm"></i>
                </div>
                <h3 className="text-base font-bold text-white">Hire Exceptional Tech Talent in Canada</h3>
              </div>
              <p className="text-slate-300 text-xs mb-4">
                Source exceptional, pre‑vetted tech talent with AI‑verified skills and Canadian work eligibility.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button 
                  className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg px-3 py-2 rounded-lg text-sm font-medium transition flex items-center"
                  onClick={() => navigate('/employer-signin')}
                >
                  Post a Job for Free • Discover AI‑Verified Talent
                  <i className="fa-solid fa-arrow-right w-3.5 h-3.5 ml-1.5"></i>
                </button>
              </div>
            </div>
          </div>

          {/* For Candidates Card */}
          <div className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300">
            {/* Video Preview */}
            <div className="relative aspect-video bg-gradient-to-br from-purple-600/50 to-purple-900/50 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=400&fit=crop" 
                alt="Person working on laptop" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-play text-white text-lg ml-1"></i>
                </div>
              </div>
              <div className="absolute top-3 left-3">
                <div className="px-3 py-1 rounded-full bg-purple-500/80 text-white text-xs font-medium backdrop-blur-sm">
                  For Candidates
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center">
                  <i className="fa-solid fa-video text-purple-300 text-sm"></i>
                </div>
                <h3 className="text-base font-bold text-white">Get Discovered by Canada's Top Tech Companies</h3>
              </div>
              <p className="text-slate-300 text-xs mb-4">
                Stand out with an AI‑rated video resume and get matched to exceptional tech roles across Canada.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button 
                  className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg px-3 py-2 rounded-lg text-sm font-medium transition flex items-center"
                onClick={() => navigate('/user-dashboard')}
                >
                  <i className="fa-solid fa-play w-3.5 h-3.5 mr-1.5"></i>
                  Upload Your Video Resume • Find Top Tech Roles
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Skills Section */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-xs mb-2">Popular Skills</p>
          <div className="flex flex-wrap justify-center gap-1.5 max-w-2xl mx-auto">
            {popularSkills.map((skill, index) => (
              <button
                key={index}
                className="px-2.5 py-1 rounded-full bg-white/5 text-slate-400 text-xs hover:bg-white/10 hover:text-white transition-colors border border-slate-700/50"
                onClick={() => navigate(`/job-matches?skill=${skill}`)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
