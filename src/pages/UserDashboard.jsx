import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { api } from '../utils/api'
import { useAuth } from '../hooks/useAuth'

const UserDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const profileFormRef = useRef(null)
  const [showProfileForm, setShowProfileForm] = useState(false)
  
  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.email?.split('@')[0] || 'User'
  const userAvatar = 'https://i.pravatar.cc/64?img=4'

  const handleScrollToProfile = () => {
    if (!showProfileForm) {
      setShowProfileForm(true)
      setTimeout(() => {
        if (profileFormRef.current) {
          profileFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 0)
    } else if (profileFormRef.current) {
      profileFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleLogout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Continue with logout even if API call fails
    } finally {
      // Clear all auth data using Redux
      logout()
      
      // Redirect to home page
      navigate('/')
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white min-h-screen flex flex-col">
      <Header 
        userMode 
        activeNav="Dashboard" 
        userName={userName}
        userAvatar={userAvatar}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        <section className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left column: score & quick actions */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-5 shadow-lg">
                <div className="text-sm opacity-80">Your Match Score</div>
                <div className="text-4xl font-bold my-2">92</div>
                <div className="text-sm opacity-90">Based on your profile</div>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Skills Fit</span>
                    <span>95%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full">
                    <div className="h-1.5 bg-white rounded-full" style={{ width: '95%' }} />
                  </div>
                  <div className="flex justify-between">
                    <span>Experience Fit</span>
                    <span>88%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full">
                    <div className="h-1.5 bg-white rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm p-4 space-y-3">
                <div className="text-sm font-semibold text-white">Quick Actions</div>
                <button
                  className="w-full text-left px-3 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 flex items-center space-x-2 text-sm text-white transition"
                  onClick={handleScrollToProfile}
                >
                  <i className="fa-solid fa-pen text-indigo-300"></i>
                  <span>Update profile</span>
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 flex items-center space-x-2 text-sm text-white transition">
                  <i className="fa-solid fa-paperclip text-indigo-300"></i>
                  <span>Upload resume</span>
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 flex items-center space-x-2 text-sm text-white transition">
                  <i className="fa-solid fa-video text-indigo-300"></i>
                  <span>Upload video introduction</span>
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 flex items-center space-x-2 text-sm text-white transition">
                  <i className="fa-solid fa-bell text-indigo-300"></i>
                  <span>Create job alerts</span>
                </button>
              </div>
            </div>

            {/* Middle column */}
            <div className="lg:col-span-3 space-y-6">
              {showProfileForm ? (
                <div ref={profileFormRef} className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm p-5">
                  <div className="mb-4">
                    <h1 className="text-2xl font-bold text-white">Profile Information</h1>
                    <p className="text-sm text-slate-300">Update your personal details and contact information.</p>
                  </div>

                  <div className="space-y-8">
                    {/* Basic Information */}
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                        <i className="fa-solid fa-circle-info text-indigo-300"></i>
                        <span>Basic Information</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-slate-300">Legal First Name *</label>
                          <input className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" placeholder="As shown on document" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-slate-300">Legal Last Name *</label>
                          <input className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" placeholder="As shown on document" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-slate-300">Email *</label>
                          <input type="email" className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" placeholder="your.email@example.com" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
                          <input type="tel" className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" placeholder="+1 (555) 123-4567" />
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                        <i className="fa-solid fa-location-dot text-indigo-300"></i>
                        <span>Address Information</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 flex flex-col gap-2">
                          <label className="text-xs font-semibold text-slate-300">Street Address *</label>
                          <input className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" placeholder="123 Main Street" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-slate-300">City *</label>
                          <input className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" placeholder="San Francisco" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-slate-300">State/Province *</label>
                          <input className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" placeholder="California" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-slate-300">ZIP/Postal Code *</label>
                          <input className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" placeholder="94102" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-slate-300">Country *</label>
                          <select className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400">
                            <option value="" className="bg-slate-900 text-white">Select country</option>
                            <option value="US" className="bg-slate-900 text-white">United States</option>
                            <option value="CA" className="bg-slate-900 text-white">Canada</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save and Cancel buttons */}
                  <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/20">
                    <button
                      onClick={() => setShowProfileForm(false)}
                      className="px-4 py-2 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Handle save logic here
                        setShowProfileForm(false)
                      }}
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                /* Job matches feed */
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Job Matches</h1>
                    <p className="text-sm text-slate-300">Personalized opportunities based on your profile</p>
                  </div>
                  <button className="flex items-center space-x-2 text-sm text-indigo-300 hover:text-indigo-200">
                    <i className="fa-solid fa-filter"></i>
                    <span>Refine filters</span>
                  </button>
                </div>

                <div className="grid gap-4">
                  {[1, 2].map((idx) => (
                    <div key={idx} className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm p-4 hover:bg-white/10 transition">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs text-amber-400 font-semibold mb-1 flex items-center space-x-2">
                            <i className="fa-solid fa-crown"></i>
                            <span>Premium Match</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white">Senior Frontend Developer</h3>
                          <div className="text-sm text-slate-300 mb-2">TechFlow Inc. • San Francisco, CA • Remote OK</div>
                          <div className="flex flex-wrap gap-2 mb-3 text-xs">
                            <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Remote OK</span>
                            <span className="px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">$95k - $130k</span>
                            <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">Equity Available</span>
                          </div>
                          <p className="text-sm text-slate-300">
                            Join our growing team to build next-generation web applications using React, TypeScript, and modern frontend technologies.
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3 text-xs">
                            {['React', 'TypeScript', 'Redux', 'Next.js', 'GraphQL'].map((skill) => (
                              <span key={skill} className="px-2 py-1 rounded bg-white/10 text-slate-300 border border-white/20">{skill}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-3">
                          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-lg font-bold">
                            96
                          </div>
                          <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">
                            Quick Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>

            {/* Right column: insights */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-white">Why This Match?</div>
                  <i className="fa-solid fa-circle-info text-slate-400"></i>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Skills Alignment</span>
                    <span className="text-emerald-400 font-semibold">92%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Experience</span>
                    <span className="text-emerald-400 font-semibold">88%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Salary Fit</span>
                    <span className="text-emerald-400 font-semibold">95%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Location Fit</span>
                    <span className="text-amber-400 font-semibold">100%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm p-4 space-y-3">
                <div className="text-sm font-semibold text-white">Career Insights</div>
                <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-xs text-indigo-200">
                  <div className="font-semibold mb-1">Skill Gap Analysis</div>
                  <div>Consider learning GraphQL to increase your match score by 8%.</div>
                </div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
                  <div className="font-semibold mb-1">Market Trend</div>
                  <div>React developers in your area see 15% salary growth annually.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default UserDashboard

