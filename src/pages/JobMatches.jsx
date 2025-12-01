import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const JobMatches = () => {
  const navigate = useNavigate()
  const [savedJobs, setSavedJobs] = useState(new Set(['react-developer-healthtech']))
  const [filters, setFilters] = useState({
    location: '',
    salaryMin: '',
    salaryMax: '',
    experience: 'mid',
    skills: ['React', 'JavaScript', 'Node.js'],
    companySize: ['medium'],
    remote: true
  })

  const jobMatches = [
    {
      id: 'senior-frontend-techflow',
      title: 'Senior Frontend Developer',
      company: 'TechFlow Inc.',
      location: 'San Francisco, CA',
      posted: '2 days ago',
      companyType: 'Series B Startup',
      salary: '$95k - $130k',
      workType: 'Remote OK',
      benefits: ['Equity Available'],
      matchScore: 96,
      isPremium: true,
      description: 'Join our growing team to build next-generation web applications using React, TypeScript, and modern frontend technologies. We\'re looking for someone passionate about user experience and performance optimization.',
      skills: ['React', 'TypeScript', 'Redux', 'Next.js', 'GraphQL'],
      logo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2615db9833-1271f64869e51bf90875.png'
    },
    {
      id: 'full-stack-financehub',
      title: 'Full Stack Engineer',
      company: 'FinanceHub',
      location: 'New York, NY',
      posted: '1 week ago',
      companyType: '200-500 employees',
      salary: '$85k - $115k',
      workType: 'Hybrid',
      benefits: ['Great Benefits'],
      matchScore: 89,
      isPremium: false,
      description: 'Build scalable financial applications using React, Node.js, and PostgreSQL. Work with a collaborative team to deliver features that impact millions of users worldwide.',
      skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
      logo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/623dd88eee-8b0dcc56b705435f7025.png'
    },
    {
      id: 'react-developer-healthtech',
      title: 'React Developer',
      company: 'HealthTech Solutions',
      location: 'Austin, TX',
      posted: '3 days ago',
      companyType: 'Growth Stage',
      salary: '$75k - $105k',
      workType: 'Remote OK',
      benefits: ['Mission Driven'],
      matchScore: 84,
      isPremium: false,
      description: 'Develop healthcare applications that improve patient outcomes. Work with cutting-edge technology to create intuitive user interfaces for medical professionals.',
      skills: ['React', 'JavaScript', 'Redux', 'Material-UI', 'Jest'],
      logo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e72528e45d-81fb3cc5e5597fae6dff.png'
    },
    {
      id: 'frontend-engineer-shopsmart',
      title: 'Frontend Engineer',
      company: 'ShopSmart',
      location: 'Seattle, WA',
      posted: '5 days ago',
      companyType: '1000+ employees',
      salary: '$90k - $125k',
      workType: 'Hybrid',
      benefits: ['Stock Options'],
      matchScore: 82,
      isPremium: false,
      description: 'Build and optimize e-commerce experiences for millions of users. Work with modern frontend technologies to create fast, responsive, and accessible web applications.',
      skills: ['React', 'TypeScript', 'Next.js', 'Webpack', 'CSS-in-JS'],
      logo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/9bd2c40ef2-e2aa0c3d756f68bb892d.png'
    },
    {
      id: 'javascript-developer-gamestudio',
      title: 'JavaScript Developer',
      company: 'GameStudio Pro',
      location: 'Los Angeles, CA',
      posted: '1 week ago',
      companyType: 'Gaming Studio',
      salary: '$80k - $110k',
      workType: 'Remote OK',
      benefits: ['Creative Environment'],
      matchScore: 78,
      isPremium: false,
      description: 'Create immersive gaming experiences using JavaScript and WebGL. Join a creative team building the next generation of browser-based games and interactive entertainment.',
      skills: ['JavaScript', 'WebGL', 'Three.js', 'Canvas API', 'Game Physics'],
      logo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/d900c6a2d2-ccd92a21d53ecf6baaa1.png'
    }
  ]

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
    switch (workType) {
      case 'Remote OK':
        return 'bg-success/10 text-success'
      case 'Hybrid':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'bg-success'
    if (score >= 80) return 'bg-secondary'
    if (score >= 70) return 'bg-purple-600'
    return 'bg-orange-500'
  }

  return (
    <div className="bg-neutral-50 font-sans min-h-screen">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b border-neutral-50 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-network-wired text-white text-lg"></i>
              </div>
              <span className="ml-3 text-2xl font-bold text-neutral-900">Nexus</span>
              <span className="ml-1 text-2xl font-light text-primary">Recruitment</span>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <span className="text-neutral-900 font-medium hover:text-primary transition cursor-pointer">Dashboard</span>
              <span className="text-primary font-medium border-b-2 border-primary pb-1">Job Matches</span>
              <span className="text-neutral-900 font-medium hover:text-primary transition cursor-pointer">Assessments</span>
              <span className="text-neutral-900 font-medium hover:text-primary transition cursor-pointer">Applications</span>
              <span className="text-neutral-900 font-medium hover:text-primary transition cursor-pointer">Messages</span>
              <span className="text-neutral-900 font-medium hover:text-primary transition cursor-pointer">Profile</span>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 p-2">
                <i className="fa-solid fa-search text-lg"></i>
              </button>
              <button className="relative text-gray-500 hover:text-gray-700 p-2">
                <i className="fa-solid fa-bell text-lg"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <div className="flex items-center bg-secondary/10 text-secondary rounded-full py-1.5 px-3">
                <i className="fa-solid fa-circle text-xs mr-2"></i>
                <span className="text-sm font-medium">Available for work</span>
              </div>
              <div className="flex items-center space-x-2">
                <img alt="Profile" className="w-10 h-10 rounded-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg" />
                <i className="fa-solid fa-chevron-down text-xs text-gray-500"></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar Filters */}
        <aside className="w-80 bg-white border-r border-neutral-200 p-6 overflow-y-auto">
          {/* Match Insights */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">Your Match Score</h3>
                  <p className="text-blue-100 text-sm">Based on your profile</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">92</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Skills Match</span>
                  <span>95%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-primary text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-600 transition flex items-center">
                <i className="fa-solid fa-plus mr-2"></i>
                Save New Search
              </button>
              <button className="w-full border border-neutral-300 text-neutral-900 py-2.5 px-4 rounded-lg font-medium hover:bg-neutral-50 transition flex items-center">
                <i className="fa-solid fa-bell mr-2"></i>
                Job Alerts
              </button>
              <button className="w-full border border-neutral-300 text-neutral-900 py-2.5 px-4 rounded-lg font-medium hover:bg-neutral-50 transition flex items-center">
                <i className="fa-solid fa-filter mr-2"></i>
                Advanced Filters
              </button>
            </div>
          </div>

          {/* Saved Searches */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Saved Searches</h3>
            <div className="space-y-3">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-neutral-900">Senior Frontend Developer</span>
                  <i className="fa-solid fa-star text-primary"></i>
                </div>
                <div className="text-sm text-neutral-600">Remote • $80k-$120k • 23 new matches</div>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-neutral-900">Full Stack Engineer</span>
                  <i className="fa-regular fa-star text-neutral-400"></i>
                </div>
                <div className="text-sm text-neutral-600">San Francisco • $90k-$140k • 8 new matches</div>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-neutral-900">React Developer</span>
                  <i className="fa-regular fa-star text-neutral-400"></i>
                </div>
                <div className="text-sm text-neutral-600">NYC • Remote OK • $70k-$110k • 15 new matches</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Filters</h3>
            
            {/* Location Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="City, state, or country"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
                <i className="fa-solid fa-map-marker-alt absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
              </div>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-neutral-300 text-primary focus:ring-primary" 
                    checked={filters.remote}
                    onChange={(e) => handleFilterChange('remote', e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-neutral-700">Remote OK</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-neutral-300 text-primary focus:ring-primary"
                    checked={filters.hybrid}
                    onChange={(e) => handleFilterChange('hybrid', e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-neutral-700">Hybrid</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-neutral-300 text-primary focus:ring-primary"
                    checked={filters.onsite}
                    onChange={(e) => handleFilterChange('onsite', e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-neutral-700">On-site only</span>
                </label>
              </div>
            </div>

            {/* Salary Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Salary Range</label>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" 
                  className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="Min"
                  value={filters.salaryMin}
                  onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                />
                <input 
                  type="number" 
                  className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="Max"
                  value={filters.salaryMax}
                  onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
                />
              </div>
              <div className="mt-2">
                <input 
                  type="range" 
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider" 
                  min="0" 
                  max="200000" 
                  value={filters.salaryRange || 80000}
                  onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                />
              </div>
            </div>

            {/* Experience Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Experience Level</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="experience" 
                    className="text-primary focus:ring-primary border-neutral-300"
                    checked={filters.experience === 'entry'}
                    onChange={() => handleFilterChange('experience', 'entry')}
                  />
                  <span className="ml-2 text-sm text-neutral-700">Entry Level (0-2 years)</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="experience" 
                    className="text-primary focus:ring-primary border-neutral-300"
                    checked={filters.experience === 'mid'}
                    onChange={() => handleFilterChange('experience', 'mid')}
                  />
                  <span className="ml-2 text-sm text-neutral-700">Mid Level (3-5 years)</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="experience" 
                    className="text-primary focus:ring-primary border-neutral-300"
                    checked={filters.experience === 'senior'}
                    onChange={() => handleFilterChange('experience', 'senior')}
                  />
                  <span className="ml-2 text-sm text-neutral-700">Senior Level (6+ years)</span>
                </label>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Skills</label>
              <div className="relative mb-3">
                <input 
                  type="text" 
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="Add skills..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSkillAdd(e.target.value)
                      e.target.value = ''
                    }
                  }}
                />
                <i className="fa-solid fa-plus absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.skills.map((skill, index) => (
                  <span key={index} className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center">
                    {skill}
                    <i 
                      className="fa-solid fa-times ml-2 cursor-pointer"
                      onClick={() => handleSkillRemove(skill)}
                    ></i>
                  </span>
                ))}
              </div>
            </div>

            {/* Company Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Company Size</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-neutral-300 text-primary focus:ring-primary"
                    checked={filters.companySize.includes('startup')}
                    onChange={(e) => {
                      const newSize = e.target.checked 
                        ? [...filters.companySize, 'startup']
                        : filters.companySize.filter(size => size !== 'startup')
                      handleFilterChange('companySize', newSize)
                    }}
                  />
                  <span className="ml-2 text-sm text-neutral-700">Startup (1-50)</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-neutral-300 text-primary focus:ring-primary"
                    checked={filters.companySize.includes('medium')}
                    onChange={(e) => {
                      const newSize = e.target.checked 
                        ? [...filters.companySize, 'medium']
                        : filters.companySize.filter(size => size !== 'medium')
                      handleFilterChange('companySize', newSize)
                    }}
                  />
                  <span className="ml-2 text-sm text-neutral-700">Medium (51-500)</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-neutral-300 text-primary focus:ring-primary"
                    checked={filters.companySize.includes('large')}
                    onChange={(e) => {
                      const newSize = e.target.checked 
                        ? [...filters.companySize, 'large']
                        : filters.companySize.filter(size => size !== 'large')
                      handleFilterChange('companySize', newSize)
                    }}
                  />
                  <span className="ml-2 text-sm text-neutral-700">Large (500+)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="space-y-3">
            <button className="w-full bg-primary text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-600 transition">
              Apply Filters
            </button>
            <button 
              className="w-full text-neutral-600 py-2.5 px-4 rounded-lg font-medium hover:text-neutral-900 transition"
              onClick={() => setFilters({
                location: '',
                salaryMin: '',
                salaryMax: '',
                experience: 'mid',
                skills: [],
                companySize: [],
                remote: false,
                hybrid: false,
                onsite: false
              })}
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Job Matches</h1>
                <p className="text-neutral-600">Personalized opportunities based on your profile and preferences</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-white rounded-lg border border-neutral-200 px-4 py-2">
                  <i className="fa-solid fa-sort mr-2 text-neutral-400"></i>
                  <select className="border-none focus:ring-0 text-sm">
                    <option>Best Match</option>
                    <option>Newest First</option>
                    <option>Highest Salary</option>
                    <option>Company Rating</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition">
                    <i className="fa-solid fa-th-large text-neutral-600"></i>
                  </button>
                  <button className="p-2 bg-primary text-white border border-primary rounded-lg">
                    <i className="fa-solid fa-list text-white"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">247</div>
                  <div className="text-sm text-neutral-600">Total Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary mb-1">18</div>
                  <div className="text-sm text-neutral-600">New This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500 mb-1">12</div>
                  <div className="text-sm text-neutral-600">Applied</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">5</div>
                  <div className="text-sm text-neutral-600">Interviews</div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-sm font-medium text-neutral-700">Active Filters:</span>
              {filters.remote && (
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                  Remote OK
                  <i className="fa-solid fa-times ml-2 cursor-pointer" onClick={() => handleFilterChange('remote', false)}></i>
                </div>
              )}
              {filters.salaryMin && filters.salaryMax && (
                <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm flex items-center">
                  ${filters.salaryMin} - ${filters.salaryMax}
                  <i className="fa-solid fa-times ml-2 cursor-pointer" onClick={() => {
                    handleFilterChange('salaryMin', '')
                    handleFilterChange('salaryMax', '')
                  }}></i>
                </div>
              )}
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center">
                {filters.experience === 'mid' ? 'Mid Level' : filters.experience === 'senior' ? 'Senior Level' : 'Entry Level'}
                <i className="fa-solid fa-times ml-2 cursor-pointer" onClick={() => handleFilterChange('experience', 'mid')}></i>
              </div>
              <button className="text-sm text-neutral-500 hover:text-neutral-700 underline">Clear all</button>
            </div>
          </div>

          {/* Job Matches List */}
          <div className="space-y-6">
            {jobMatches.map((job) => (
              <div 
                key={job.id} 
                className={`${job.isPremium 
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-warning/30' 
                  : 'bg-white border border-neutral-200'
                } rounded-xl p-6 relative hover:shadow-lg transition-all`}
              >
                {job.isPremium && (
                  <div className="absolute -top-3 left-6 bg-warning text-white px-3 py-1 rounded-full text-sm font-medium">
                    <i className="fa-solid fa-crown mr-1"></i>
                    Premium Match
                  </div>
                )}
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <img className="w-12 h-12 rounded-lg object-cover" src={job.logo} alt={`${job.company} logo`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-1">{job.title}</h3>
                        <p className="text-lg font-semibold text-neutral-700 mb-2">{job.company}</p>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-3">
                          <span className="flex items-center">
                            <i className="fa-solid fa-map-marker-alt mr-1"></i>
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <i className="fa-solid fa-clock mr-1"></i>
                            Posted {job.posted}
                          </span>
                          <span className="flex items-center">
                            <i className="fa-solid fa-building mr-1"></i>
                            {job.companyType}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getWorkTypeColor(job.workType)}`}>
                            {job.workType}
                          </span>
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            {job.salary}
                          </span>
                          {job.benefits.map((benefit, index) => (
                            <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`rounded-full w-16 h-16 flex items-center justify-center mb-2 ${getMatchScoreColor(job.matchScore)}`}>
                          <span className="text-white font-bold text-lg">{job.matchScore}</span>
                        </div>
                        <div className="text-sm text-neutral-600">Match Score</div>
                      </div>
                    </div>
                    
                    <p className="text-neutral-700 mb-4 leading-relaxed">
                      {job.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className="text-sm font-medium text-neutral-700 mb-2">Required Skills:</div>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span key={index} className="bg-primary text-white px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button 
                          className="text-neutral-500 hover:text-neutral-700 transition"
                          onClick={() => toggleSaveJob(job.id)}
                        >
                          <i className={`${savedJobs.has(job.id) ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'} mr-1`}></i>
                          {savedJobs.has(job.id) ? 'Saved' : 'Save'}
                        </button>
                        <button className="text-neutral-500 hover:text-neutral-700 transition">
                          <i className="fa-solid fa-share mr-1"></i>
                          Share
                        </button>
                        <button className="text-neutral-500 hover:text-neutral-700 transition">
                          <i className="fa-solid fa-eye-slash mr-1"></i>
                          Hide
                        </button>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button 
                          className="border border-neutral-300 text-neutral-700 px-6 py-2 rounded-lg font-medium hover:bg-neutral-50 transition"
                          onClick={() => navigate(`/job-details/${job.id}`)}
                        >
                          View Details
                        </button>
                        <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition flex items-center">
                          <i className="fa-solid fa-paper-plane mr-2"></i>
                          {job.isPremium ? 'Quick Apply' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Load More Section */}
            <div className="text-center py-8">
              <button className="bg-white border border-neutral-300 text-neutral-700 px-8 py-3 rounded-lg font-medium hover:bg-neutral-50 transition flex items-center mx-auto">
                <i className="fa-solid fa-plus mr-2"></i>
                Load More Matches
              </button>
              <p className="text-sm text-neutral-500 mt-3">Showing {jobMatches.length} of 247 matches</p>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Match Insights */}
        <aside className="w-80 bg-white border-l border-neutral-200 p-6 overflow-y-auto">
          {/* Match Explanation */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Why This Match?</h3>
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/10">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Skills Alignment</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-neutral-200 rounded-full h-2 mr-2">
                      <div className="bg-success h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-success">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Experience Match</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-neutral-200 rounded-full h-2 mr-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-primary">88%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Salary Range</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-neutral-200 rounded-full h-2 mr-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-secondary">95%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Location Fit</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-neutral-200 rounded-full h-2 mr-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-orange-500">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Career Insights */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Career Insights</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-lightbulb text-white text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-1">Skill Gap Analysis</h4>
                    <p className="text-sm text-neutral-600">Consider learning GraphQL to increase your match score by 8%</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-chart-line text-white text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-1">Market Trend</h4>
                    <p className="text-sm text-neutral-600">React developers in your area see 15% salary growth annually</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Jobs */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recently Saved</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <img className="w-8 h-8 rounded object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/c73833ea5f-fecf083748cfdcde108f.png" alt="tech startup logo minimal design" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-neutral-900">React Developer</div>
                  <div className="text-xs text-neutral-600">TechStart Inc.</div>
                </div>
                <i className="fa-solid fa-heart text-red-500"></i>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <img className="w-8 h-8 rounded object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/afce614007-577c228ec7dfe3991da4.png" alt="software company logo blue and white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-neutral-900">Frontend Engineer</div>
                  <div className="text-xs text-neutral-600">CodeCraft</div>
                </div>
                <i className="fa-solid fa-heart text-red-500"></i>
              </div>
            </div>
          </div>

          {/* Application Status */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Application Status</h3>
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-neutral-900">Senior Developer</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Under Review</span>
                </div>
                <div className="text-xs text-neutral-600">DataFlow Corp • Applied 3 days ago</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-neutral-900">Full Stack Dev</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Interview</span>
                </div>
                <div className="text-xs text-neutral-600">WebSolutions • Interview tomorrow</div>
              </div>
            </div>
          </div>

          {/* Job Alerts */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Job Alerts</h3>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <i className="fa-solid fa-bell text-primary"></i>
                <span className="font-medium text-neutral-900">Get notified</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">Receive alerts when new jobs matching your criteria are posted.</p>
              <button className="w-full bg-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition">
                Set Up Alerts
              </button>
            </div>
          </div>

          {/* Profile Completion */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Profile Strength</h3>
            <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-xl p-4 border border-secondary/10">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-neutral-900">85% Complete</span>
                <span className="text-sm text-secondary font-medium">Good</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-3 mb-4">
                <div className="bg-gradient-to-r from-secondary to-primary h-3 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-neutral-600">
                  <i className="fa-solid fa-check text-success mr-2"></i>
                  Portfolio links added
                </div>
                <div className="flex items-center text-neutral-600">
                  <i className="fa-solid fa-check text-success mr-2"></i>
                  Skills assessment completed
                </div>
                <div className="flex items-center text-neutral-600">
                  <i className="fa-solid fa-times text-error mr-2"></i>
                  Add work preferences
                </div>
              </div>
              <button 
                className="w-full bg-secondary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-600 transition mt-3"
                onClick={() => navigate('/create-profile')}
              >
                Complete Profile
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col space-y-3">
          <button className="bg-secondary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110">
            <i className="fa-solid fa-filter text-lg"></i>
          </button>
          <button className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110">
            <i className="fa-solid fa-comments text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default JobMatches
