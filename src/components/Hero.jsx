import React from 'react'
import { useNavigate } from 'react-router-dom'

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
    <section id="hero-section" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-8 pb-12 lg:pt-12 lg:pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <i className="fa-solid fa-sparkles w-3.5 h-3.5 mr-1.5"></i>
            The Future of IT Recruitment
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Where Tech Talent
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Meets Opportunity
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Connect with top tech companies through video resumes. Show who you are, not just what's on paper.
          </p>
        </div>

        {/* Two Cards Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/30 flex items-center justify-center">
                  <i className="fa-solid fa-building text-indigo-300 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-white">Hire Top IT Talent</h3>
              </div>
              <p className="text-slate-300 text-sm mb-5">
                Find exceptional IT talent through video resumes. See candidates' skills and personality before the interview.
              </p>
              <div className="flex flex-wrap gap-3">
                <button 
                  className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg px-4 py-2.5 rounded-lg font-medium transition flex items-center"
                  onClick={() => navigate('/create-profile')}
                >
                  Post a Job
                  <i className="fa-solid fa-arrow-right w-4 h-4 ml-2"></i>
                </button>
                <button 
                  className="border border-white/30 text-white hover:bg-white/10 px-4 py-2.5 rounded-lg font-medium transition"
                  onClick={() => navigate('/job-matches')}
                >
                  Browse Talent
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
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/30 flex items-center justify-center">
                  <i className="fa-solid fa-video text-purple-300 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-white">Get Your Dream Job</h3>
              </div>
              <p className="text-slate-300 text-sm mb-5">
                Stand out with a video resume. Let employers see your experience and personality come to life.
              </p>
              <div className="flex flex-wrap gap-3">
                <button 
                  className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg px-4 py-2.5 rounded-lg font-medium transition flex items-center"
                  onClick={() => navigate('/create-profile')}
                >
                  <i className="fa-solid fa-play w-4 h-4 mr-2"></i>
                  Upload Resume
                </button>
                <button 
                  className="border border-white/30 text-white hover:bg-white/10 px-4 py-2.5 rounded-lg font-medium transition"
                  onClick={() => navigate('/job-matches')}
                >
                  Browse Jobs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Skills Section */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm mb-3">Popular Skills</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {popularSkills.map((skill, index) => (
              <button
                key={index}
                className="px-3 py-1.5 rounded-full bg-white/5 text-slate-400 text-sm hover:bg-white/10 hover:text-white transition-colors border border-slate-700/50"
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
