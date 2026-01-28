import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import SocialSidebar from '../components/SocialSidebar'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'
import { useAuth } from '../hooks/useAuth'
import { useLogout } from '../hooks/useLogout'
import { api } from '../utils/api'
import { getCandidateMenuItems, getCandidateQuickActions } from '../utils/candidateSidebar'

const JobMatches = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, accessToken } = useAuth()
  const handleLogout = useLogout('/signin')
  const [savedJobs, setSavedJobs] = useState(new Set())
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isLoadingJobs, setIsLoadingJobs] = useState(false)
  const [jobs, setJobs] = useState([])
  const [jobsError, setJobsError] = useState(null)
  const [filters, setFilters] = useState({
    location: '',
    salaryMin: '',
    salaryMax: '',
    experience: 'mid',
    skills: ['React', 'JavaScript', 'Node.js'],
    companySize: ['medium'],
    remote: true
  })

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoadingJobs(true)
      setJobsError(null)
      try {
        const data = await api.listPublishedJobs()
        setJobs(data || [])
      } catch (error) {
        setJobsError(error.message || 'Failed to load jobs.')
      } finally {
        setIsLoadingJobs(false)
      }
    }

    loadJobs()
  }, [])

  const jobMatches = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company?.name || 'Company',
    location: job.location || 'Location not set',
    posted: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently',
    companyType: job.company?.industry || 'Hiring',
    salary: job.salaryRange || 'Salary not listed',
    workType: job.workFormat || 'Work format',
    benefits: job.employmentType ? [job.employmentType.replace('_', ' ')] : [],
    matchScore: 0,
    isPremium: false,
    description: job.descriptionRaw || 'Job description not available.',
    skills: job.skillsRequired || [],
    logo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2615db9833-1271f64869e51bf90875.png'
  }))

  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''
  const userInitial = (user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()


  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleSkillAdd = (skill) => {
    if (skill && !filters.skills.includes(skill)) {
      setFilters(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
    }
  }

  const handleSkillRemove = (skillToRemove) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const getWorkTypeColor = (workType) => {
    const normalized = (workType || '').toString().toUpperCase()
    if (normalized.includes('REMOTE')) {
      return 'bg-green-100 text-green-700 border border-green-300'
    }
    if (normalized.includes('HYBRID')) {
      return 'bg-orange-100 text-orange-700 border border-orange-300'
    }
    return 'bg-neutral-100 text-neutral-700 border border-neutral-300'
  }

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 80) return 'bg-indigo-500'
    if (score >= 70) return 'bg-purple-600'
    return 'bg-orange-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/30 via-white to-indigo-50/20 flex flex-col">
      <SocialSidebar position="right" />
      
      <DashboardHeader
        userName={userName}
        userEmail={userEmail}
        userInitial={userInitial}
        onProfile={() => navigate('/user-dashboard')}
        onLogout={handleLogout}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Job Matches' }
        ]}
        title=""
        subtitle=""
      />

      <div className="flex flex-1">
        <DashboardSidebar
          title="Workspace"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeView="job-matches"
          menuItems={getCandidateMenuItems({ navigate })}
          quickFilters={getCandidateQuickActions(navigate)}
        />

        <main className="flex-1 pr-11 lg:pr-14">
          <section className="px-8 py-4">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mb-0.5">Job Matches</h1>
                    <p className="text-xs text-neutral-600">All published roles available right now</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="px-3 py-1.5 rounded-lg border border-indigo-200 bg-white text-neutral-700 text-xs font-semibold hover:bg-indigo-50 transition flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-filter text-xs"></i>
                      Filters
                    </button>
                    <div className="flex items-center bg-white rounded-lg border border-indigo-200 px-2 py-1.5">
                      <i className="fa-solid fa-sort mr-1.5 text-neutral-400 text-xs"></i>
                      <select className="border-none bg-transparent focus:ring-0 text-xs text-neutral-700">
                        <option>Best Match</option>
                        <option>Newest First</option>
                        <option>Highest Salary</option>
                        <option>Company Rating</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Stats Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4 hover:shadow-lg transition-all duration-300">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">{jobMatches.length}</div>
                    <div className="text-xs text-neutral-600 font-medium">Available Jobs</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4 hover:shadow-lg transition-all duration-300">
                    <div className="text-2xl font-bold text-purple-600 mb-1">{jobs.length}</div>
                    <div className="text-xs text-neutral-600 font-medium">Published Roles</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4 hover:shadow-lg transition-all duration-300">
                    <div className="text-2xl font-bold text-orange-600 mb-1">{savedJobs.size}</div>
                    <div className="text-xs text-neutral-600 font-medium">Saved Jobs</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4 hover:shadow-lg transition-all duration-300">
                    <div className="text-2xl font-bold text-pink-600 mb-1">0</div>
                    <div className="text-xs text-neutral-600 font-medium">Applications</div>
                  </div>
                </div>

                {/* Active Filters */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-neutral-600">Active Filters:</span>
                  {filters.remote && (
                    <div className="bg-indigo-100 text-indigo-700 border border-indigo-300 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                      Remote OK
                      <i className="fa-solid fa-times cursor-pointer text-xs" onClick={() => handleFilterChange('remote', false)}></i>
                    </div>
                  )}
                  {filters.salaryMin && filters.salaryMax && (
                    <div className="bg-purple-100 text-purple-700 border border-purple-300 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                      ${filters.salaryMin} - ${filters.salaryMax}
                      <i className="fa-solid fa-times cursor-pointer text-xs" onClick={() => {
                        handleFilterChange('salaryMin', '')
                        handleFilterChange('salaryMax', '')
                      }}></i>
                    </div>
                  )}
                  <div className="bg-purple-100 text-purple-700 border border-purple-300 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                    {filters.experience === 'mid' ? 'Mid Level' : filters.experience === 'senior' ? 'Senior Level' : 'Entry Level'}
                    <i className="fa-solid fa-times cursor-pointer text-xs" onClick={() => handleFilterChange('experience', 'mid')}></i>
                  </div>
                  <button className="text-xs text-neutral-500 hover:text-neutral-700 underline">Clear all</button>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4 mb-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Location Filter */}
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1.5">Location</label>
                      <input 
                        type="text" 
                        className="w-full border border-neutral-200 bg-white rounded-lg px-2.5 py-1.5 text-xs text-neutral-700 placeholder-neutral-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="City, state, or country"
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                      />
                    </div>

                    {/* Salary Range */}
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1.5">Salary Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="number" 
                          className="border border-neutral-200 bg-white rounded-lg px-2 py-1.5 text-xs text-neutral-700 placeholder-neutral-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                          placeholder="Min"
                          value={filters.salaryMin}
                          onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                        />
                        <input 
                          type="number" 
                          className="border border-neutral-200 bg-white rounded-lg px-2 py-1.5 text-xs text-neutral-700 placeholder-neutral-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                          placeholder="Max"
                          value={filters.salaryMax}
                          onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1.5">Experience Level</label>
                      <select 
                        className="w-full border border-neutral-200 bg-white rounded-lg px-2.5 py-1.5 text-xs text-neutral-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={filters.experience}
                        onChange={(e) => handleFilterChange('experience', e.target.value)}
                      >
                        <option value="entry">Entry Level (0-2 years)</option>
                        <option value="mid">Mid Level (3-5 years)</option>
                        <option value="senior">Senior Level (6+ years)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Job Matches List */}
              <div className="space-y-4">
                {jobsError && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {jobsError}
                  </div>
                )}

                {isLoadingJobs ? (
                  <div className="text-xs text-neutral-600">Loading jobs...</div>
                ) : jobMatches.length ? (
                  <>
                    {jobMatches.map((job) => (
                      <div 
                        key={job.id} 
                        className={`${
                          job.isPremium 
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300' 
                            : 'bg-white/80 backdrop-blur-sm border border-indigo-200/50'
                        } rounded-xl p-4 shadow-md hover:shadow-lg transition-all`}
                      >
                        {job.isPremium && (
                          <div className="absolute -top-2 left-5 bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                            <i className="fa-solid fa-crown mr-1 text-xs"></i>
                            Premium Match
                          </div>
                        )}
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-neutral-200 flex-shrink-0">
                            <img className="w-10 h-10 rounded-md object-cover" src={job.logo} alt={`${job.company} logo`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-base font-bold text-neutral-900 mb-0.5">{job.title}</h3>
                                <p className="text-sm font-semibold text-neutral-700 mb-1">{job.company}</p>
                                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                                  <span className="flex items-center">
                                    <i className="fa-solid fa-map-marker-alt mr-1 text-xs"></i>
                                    {job.location}
                                  </span>
                                  <span className="flex items-center">
                                    <i className="fa-solid fa-clock mr-1 text-xs"></i>
                                    {job.posted}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getWorkTypeColor(job.workType)}`}>
                                    {job.workType}
                                  </span>
                                  <span className="bg-indigo-100 text-indigo-700 border border-indigo-300 px-2 py-0.5 rounded-full text-xs font-medium">
                                    {job.salary}
                                  </span>
                                  {job.benefits.map((benefit, index) => (
                                    <span key={index} className="bg-purple-100 text-purple-700 border border-purple-300 px-2 py-0.5 rounded-full text-xs font-medium">
                                      {benefit}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-1 ${getMatchScoreColor(job.matchScore)}`}>
                                  <span className="text-white font-bold text-sm">{job.matchScore}</span>
                                </div>
                                <div className="text-xs text-neutral-500">Match</div>
                              </div>
                            </div>
                            
                            <p className="text-neutral-600 mb-2 leading-relaxed text-sm">
                              {job.description}
                            </p>
                            
                            <div className="mb-2">
                              <div className="text-xs font-medium text-neutral-600 mb-1">Required Skills:</div>
                              <div className="flex flex-wrap gap-1">
                                {job.skills.map((skill, index) => (
                                  <span key={index} className="bg-indigo-600 text-white px-2 py-0.5 rounded text-xs">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button 
                                  className="text-neutral-500 hover:text-neutral-700 transition text-xs"
                                  onClick={() => toggleSaveJob(job.id)}
                                >
                                  <i className={`${savedJobs.has(job.id) ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'} mr-1 text-xs`}></i>
                                  {savedJobs.has(job.id) ? 'Saved' : 'Save'}
                                </button>
                                <button className="text-neutral-500 hover:text-neutral-700 transition text-xs">
                                  <i className="fa-solid fa-share mr-1 text-xs"></i>
                                  Share
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  className="border border-indigo-200 bg-white text-neutral-700 px-4 py-1.5 rounded-lg font-medium hover:bg-indigo-50 transition text-xs"
                                  onClick={() => navigate(`/job-details/${job.id}`)}
                                >
                                  View Details
                                </button>
                                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition flex items-center text-xs">
                                  <i className="fa-solid fa-paper-plane mr-1 text-xs"></i>
                                  {job.isPremium ? 'Quick Apply' : 'Apply'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="text-center py-4">
                      <p className="text-xs text-neutral-500 mt-2">Showing {jobMatches.length} published jobs</p>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-neutral-500">No published jobs yet.</div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default JobMatches
