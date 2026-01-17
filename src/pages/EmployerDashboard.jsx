import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'
import { api } from '../utils/api'
import { useAuth } from '../hooks/useAuth'

const EmployerDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeView, setActiveView] = useState('overview')
  const [jobs, setJobs] = useState([])
  const [selectedJobId, setSelectedJobId] = useState('')
  const [matches, setMatches] = useState([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(false)
  const [isLoadingMatches, setIsLoadingMatches] = useState(false)
  const [isRunningMatch, setIsRunningMatch] = useState(false)
  const [matchFilter, setMatchFilter] = useState('ALL')
  const [updatingMatchId, setUpdatingMatchId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    descriptionRaw: '',
    department: '',
    location: '',
    workFormat: '',
    employmentType: '',
    salaryRange: '',
  })
  const [error, setError] = useState(null)
  const [detailMatch, setDetailMatch] = useState(null)
  const [toast, setToast] = useState(null)

  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.email?.split('@')[0] || 'Employer'
  const userEmail = user?.email || ''
  const userInitial = (user?.firstName?.[0] || user?.email?.[0] || 'E').toUpperCase()

  const loadJobs = async () => {
    setIsLoadingJobs(true)
    try {
      const data = await api.listJobs()
      setJobs(data || [])
      if (data?.length && !selectedJobId) {
        setSelectedJobId(data[0].id)
      }
    } catch (err) {
      setError(err.message || 'Failed to load jobs.')
    } finally {
      setIsLoadingJobs(false)
    }
  }

  const loadMatches = async (jobId) => {
    if (!jobId) return
    setIsLoadingMatches(true)
    try {
      const data = await api.getJobMatches(jobId)
      setMatches(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load matches.')
    } finally {
      setIsLoadingMatches(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  useEffect(() => {
    if ((activeView === 'matches' || activeView === 'overview') && selectedJobId) {
      loadMatches(selectedJobId)
    }
  }, [activeView, selectedJobId])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateJob = async (e) => {
    e.preventDefault()
    setError(null)
    if (!formData.title.trim() || !formData.descriptionRaw.trim()) {
      setError('Job title and description are required.')
      return
    }
    try {
      const job = await api.createJob({
        title: formData.title.trim(),
        descriptionRaw: formData.descriptionRaw.trim(),
        department: formData.department.trim() || undefined,
        location: formData.location.trim() || undefined,
        workFormat: formData.workFormat.trim() || undefined,
        employmentType: formData.employmentType.trim() || undefined,
        salaryRange: formData.salaryRange.trim() || undefined,
      })
      setJobs((prev) => [job, ...prev])
      setSelectedJobId(job.id)
      setToast({
        type: 'success',
        message: 'Job created successfully. Review and publish when you are ready to start matching.',
      })
      setFormData({
        title: '',
        descriptionRaw: '',
        department: '',
        location: '',
        workFormat: '',
        employmentType: '',
        salaryRange: '',
      })
    } catch (err) {
      setError(err.message || 'Failed to create job.')
    }
  }

  const handlePublish = async (jobId) => {
    setError(null)
    try {
      const updated = await api.publishJob(jobId)
      setJobs((prev) => prev.map((job) => (job.id === jobId ? updated : job)))
    } catch (err) {
      setError(err.message || 'Failed to publish job.')
    }
  }

  const handleUpdateMatchStatus = async (matchId, status) => {
    setError(null)
    setUpdatingMatchId(matchId)
    try {
      const updated = await api.updateMatchStatus(matchId, status)
      setMatches((prev) =>
        prev.map((match) =>
          match.id === matchId
            ? { ...match, status: updated?.status || status }
            : match,
        ),
      )
      setDetailMatch((prev) =>
        prev && prev.id === matchId ? { ...prev, status: updated?.status || status } : prev,
      )
      setToast({
        type: 'success',
        message: status === 'SHORTLISTED' ? 'Candidate shortlisted.' : 'Candidate rejected.',
      })
    } catch (err) {
      setError(err.message || 'Failed to update match status.')
    } finally {
      setUpdatingMatchId(null)
    }
  }

  const handleRunMatching = async (jobId) => {
    if (!jobId) return
    setIsRunningMatch(true)
    setError(null)
    try {
      await api.runJobMatching(jobId)
      setToast({
        type: 'success',
        message: 'AI matching started. Refresh in a moment for new results.',
      })
      setTimeout(() => loadMatches(jobId), 1500)
    } catch (err) {
      setError(err.message || 'Failed to run AI matching.')
    } finally {
      setIsRunningMatch(false)
    }
  }

  const handleNextAction = (actionLabel, match) => {
    const candidateName = match?.candidate
      ? `${match.candidate.firstName || ''} ${match.candidate.lastName || ''}`.trim() || 'Candidate'
      : 'Candidate'
    setToast({
      type: 'success',
      message: `${actionLabel} queued for ${candidateName}.`,
    })
  }

  const normalizeStatus = (status) => (status || 'NEW').toUpperCase()
  const getMatchStatusStyles = (status) => {
    switch (normalizeStatus(status)) {
      case 'SHORTLISTED':
        return 'bg-green-100 text-green-700 border border-green-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-700 border border-red-200'
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200'
    }
  }
  const filteredMatches = matches.filter((match) => {
    if (matchFilter === 'ALL') return true
    return normalizeStatus(match.status) === matchFilter
  })
  const matchCounts = matches.reduce(
    (acc, match) => {
      const status = normalizeStatus(match.status)
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    { NEW: 0, SHORTLISTED: 0, REJECTED: 0 },
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/30 via-white to-indigo-50/20 flex flex-col">
      <DashboardHeader
        userName={userName}
        userEmail={userEmail}
        userInitial={userInitial}
        onProfile={() => navigate('/employer-onboarding')}
        onLogout={() => navigate('/')}
        breadcrumbs={[{ label: 'Employer Dashboard', href: '/employer-dashboard' }]}
        title=""
        subtitle=""
      />

      <div className="flex flex-1">
        <DashboardSidebar
          title="Employer"
          collapsed={false}
          onToggleCollapse={() => {}}
          activeView={activeView}
          menuItems={[
            { id: 'overview', label: 'Overview', icon: 'fa-solid fa-chart-line', onClick: () => setActiveView('overview') },
            { id: 'jobs', label: 'Jobs', icon: 'fa-solid fa-briefcase', onClick: () => setActiveView('jobs') },
            { id: 'create-job', label: 'Create Job', icon: 'fa-solid fa-plus', onClick: () => setActiveView('create-job') },
            { id: 'matches', label: 'AI Shortlist', icon: 'fa-solid fa-user-check', onClick: () => setActiveView('matches') },
          ]}
          quickFilters={[
            { label: 'Onboarding', icon: 'fa-solid fa-building', onClick: () => navigate('/employer-onboarding') },
          ]}
        />

        <main className="flex-1 pr-11 lg:pr-14">
          <div className="px-8 py-4">
            {error && (
              <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            {toast && (
              <div className="mb-4 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                {toast.message}
              </div>
            )}

            {activeView === 'overview' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Jobs', value: jobs.length, icon: 'fa-briefcase' },
                    { label: 'Published', value: jobs.filter((job) => job.status === 'PUBLISHED').length, icon: 'fa-check-circle' },
                    { label: 'Drafts', value: jobs.filter((job) => job.status !== 'PUBLISHED').length, icon: 'fa-pen-to-square' },
                    { label: 'Matches (Selected)', value: matches.length, icon: 'fa-user-check' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-indigo-200/50 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                          <i className={`fa-solid ${stat.icon} text-white text-sm`}></i>
                        </div>
                        <span className="text-xs text-neutral-500">{stat.label}</span>
                      </div>
                      <div className="text-xl font-bold text-neutral-900">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-neutral-900">Recent Jobs</h3>
                    <button
                      onClick={() => setActiveView('create-job')}
                      className="text-xs text-primary hover:underline"
                    >
                      Create Job
                    </button>
                  </div>
                  {jobs.length ? (
                    <div className="space-y-3">
                      {jobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="border border-neutral-200 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-neutral-900">{job.title}</div>
                            <div className="text-xs text-neutral-500">{job.status}</div>
                          </div>
                          <button
                            onClick={() => navigate(`/employer-jobs/${job.id}`)}
                            className="text-xs text-primary hover:underline"
                          >
                            View Details
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-500">No jobs created yet.</div>
                  )}
                </div>
              </div>
            ) : activeView === 'jobs' ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">Your Jobs</h3>
                    <p className="text-xs text-neutral-500">Track status, publish, and view matches</p>
                  </div>
                  <button
                    onClick={() => setActiveView('create-job')}
                    className="px-3 py-1.5 text-xs bg-indigo-50 text-primary rounded-lg hover:bg-indigo-100 transition"
                  >
                    + Create Job
                  </button>
                </div>

                {isLoadingJobs ? (
                  <div className="text-xs text-neutral-600">Loading jobs...</div>
                ) : jobs.length ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {jobs.map((job) => {
                      const isPublished = job.status === 'PUBLISHED'
                      return (
                        <div
                          key={job.id}
                          className="group relative bg-white/90 border border-indigo-200/50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                          <div className="relative">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-neutral-900">{job.title}</div>
                                <div className="text-xs text-neutral-500 mt-1">
                                  {job.location || 'Location not set'} · {job.workFormat || 'Work format not set'}
                                </div>
                              </div>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                  isPublished
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {isPublished ? 'Published' : 'Draft'}
                              </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <button
                                onClick={() => navigate(`/employer-jobs/${job.id}`)}
                                className="text-xs text-primary hover:underline"
                              >
                                View Details
                              </button>
                              {!isPublished && (
                                <button
                                  onClick={() => handlePublish(job.id)}
                                  className="px-3 py-1.5 text-xs bg-indigo-50 text-primary rounded-lg hover:bg-indigo-100 transition"
                                >
                                  Publish & Match
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-neutral-500">No jobs created yet.</div>
                )}
              </div>
            ) : activeView === 'create-job' ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Create Job</h3>
                <form onSubmit={handleCreateJob} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Title *</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Senior Backend Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Job Description *</label>
                    <textarea
                      name="descriptionRaw"
                      value={formData.descriptionRaw}
                      onChange={handleChange}
                      rows={8}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Paste the job description..."
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    <input
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Department"
                    />
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Location"
                    />
                    <select
                      name="workFormat"
                      value={formData.workFormat}
                      onChange={handleChange}
                      className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Work format</option>
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                      <option value="ONSITE">Onsite</option>
                    </select>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Employment type</option>
                      <option value="FULL_TIME">Full-time</option>
                      <option value="PART_TIME">Part-time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERN">Intern</option>
                    </select>
                  </div>
                  <input
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Salary range (optional)"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                  >
                    Create Job
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-neutral-900">AI Shortlist</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                    >
                      <option value="" disabled>Select job</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleRunMatching(selectedJobId)}
                      disabled={!selectedJobId || isRunningMatch}
                      className="px-3 py-2 text-xs bg-indigo-50 text-primary rounded-lg hover:bg-indigo-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isRunningMatch ? 'Running...' : 'Run AI Matching'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'New', value: matchCounts.NEW, status: 'NEW' },
                    { label: 'Shortlisted', value: matchCounts.SHORTLISTED, status: 'SHORTLISTED' },
                    { label: 'Rejected', value: matchCounts.REJECTED, status: 'REJECTED' },
                  ].map((stage) => (
                    <button
                      key={stage.status}
                      onClick={() => setMatchFilter(stage.status)}
                      className={`text-left px-3 py-2 rounded-lg border transition ${
                        matchFilter === stage.status
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-neutral-200 text-neutral-600 hover:border-indigo-200'
                      }`}
                    >
                      <div className="text-xs font-semibold">{stage.label}</div>
                      <div className="text-lg font-bold">{stage.value}</div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {['ALL', 'NEW', 'SHORTLISTED', 'REJECTED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setMatchFilter(status)}
                      className={`px-2.5 py-1 text-[10px] rounded-full border transition ${
                        matchFilter === status
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-indigo-200'
                      }`}
                    >
                      {status === 'ALL' ? 'All' : status.toLowerCase()}
                    </button>
                  ))}
                </div>

                {isLoadingMatches ? (
                  <div className="text-xs text-neutral-600">Loading matches...</div>
                ) : filteredMatches.length ? (
                  <div className="space-y-3">
                    {filteredMatches.map((match) => (
                      <div key={match.id} className="border border-neutral-200 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-neutral-900">
                            {match.candidate?.firstName || 'Candidate'} {match.candidate?.lastName || ''}
                          </div>
                          <div className="text-xs text-neutral-500">{match.candidate?.email}</div>
                          <div className="text-xs text-neutral-600 mt-1">{match.summary}</div>
                        </div>
                        <div className="text-right space-y-1">
                          <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full ${getMatchStatusStyles(match.status)}`}>
                            {normalizeStatus(match.status).toLowerCase()}
                          </span>
                          <div className="text-xs font-semibold text-indigo-600">{match.matchScore}% Fit</div>
                          <button
                            onClick={() => setDetailMatch(match)}
                            className="text-xs text-primary hover:underline"
                          >
                            View Details
                          </button>
                          {normalizeStatus(match.status) === 'SHORTLISTED' && (
                            <div className="flex items-center gap-1.5 justify-end">
                              {['Message', 'Schedule', 'Request Resume'].map((action) => (
                                <button
                                  key={action}
                                  onClick={() => handleNextAction(action, match)}
                                  className="px-2 py-1 text-[10px] border border-neutral-200 rounded-md hover:bg-indigo-50 transition"
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : matches.length ? (
                  <div className="text-xs text-neutral-500">
                    No {matchFilter === 'ALL' ? '' : matchFilter.toLowerCase()}{matchFilter === 'ALL' ? '' : ' '}candidates yet.
                  </div>
                ) : (
                  <div className="text-xs text-neutral-500">No matches yet. Publish a job to generate matches.</div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {detailMatch && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-neutral-900">Candidate Details</h4>
              <button onClick={() => setDetailMatch(null)} className="text-neutral-500 hover:text-neutral-700">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="text-sm font-semibold text-neutral-900 mb-1">
              {detailMatch.candidate?.firstName || 'Candidate'} {detailMatch.candidate?.lastName || ''}
            </div>
            <div className="text-xs text-neutral-500 mb-3">{detailMatch.candidate?.email}</div>
            <div className="text-xs text-neutral-600 mb-2">
              Match Score: <span className="font-semibold text-indigo-600">{detailMatch.matchScore}%</span>
            </div>
            <div className="text-xs text-neutral-600 mb-2">
              Status:{' '}
              <span className={`px-2 py-0.5 rounded-full ${getMatchStatusStyles(detailMatch.status)}`}>
                {normalizeStatus(detailMatch.status).toLowerCase()}
              </span>
            </div>
            <div className="text-xs text-neutral-600 mb-2">
              Matched Skills: {(detailMatch.matchedSkills?.required || []).join(', ') || 'None'}
            </div>
            <div className="text-xs text-neutral-600 mb-4">
              Missing Skills: {(detailMatch.missingSkills?.required || []).join(', ') || 'None'}
            </div>
            {normalizeStatus(detailMatch.status) === 'SHORTLISTED' && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-neutral-700 mb-2">Next Actions</div>
                <div className="flex flex-wrap gap-2">
                  {['Message Candidate', 'Schedule Interview', 'Request Resume', 'Move to Interview'].map((action) => (
                    <button
                      key={action}
                      onClick={() => handleNextAction(action, detailMatch)}
                      className="px-3 py-1.5 text-xs border border-neutral-200 rounded-lg hover:bg-indigo-50 transition"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateMatchStatus(detailMatch.id, 'SHORTLISTED')}
                disabled={updatingMatchId === detailMatch.id}
                className="flex-1 px-3 py-2 text-xs bg-indigo-50 text-primary rounded-lg hover:bg-indigo-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Shortlist
              </button>
              <button
                onClick={() => handleUpdateMatchStatus(detailMatch.id, 'REJECTED')}
                disabled={updatingMatchId === detailMatch.id}
                className="flex-1 px-3 py-2 text-xs border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployerDashboard
