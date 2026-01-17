import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'
import { api } from '../utils/api'
import { useAuth } from '../hooks/useAuth'

const EmployerJobDetails = () => {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingMatchId, setUpdatingMatchId] = useState(null)
  const [toast, setToast] = useState(null)
  const [isRunningMatch, setIsRunningMatch] = useState(false)

  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.email?.split('@')[0] || 'Employer'
  const userEmail = user?.email || ''
  const userInitial = (user?.firstName?.[0] || user?.email?.[0] || 'E').toUpperCase()

  useEffect(() => {
    const loadJob = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const jobData = await api.getJob(jobId)
        setJob(jobData)
        const matchData = await api.getJobMatches(jobId)
        setMatches(matchData || [])
      } catch (err) {
        setError(err.message || 'Failed to load job details.')
      } finally {
        setIsLoading(false)
      }
    }

    if (jobId) {
      loadJob()
    }
  }, [jobId])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const handlePublish = async () => {
    if (!job) return
    setError(null)
    try {
      const updated = await api.publishJob(job.id)
      setJob(updated)
    } catch (err) {
      setError(err.message || 'Failed to publish job.')
    }
  }

  const handleRunMatching = async () => {
    if (!job) return
    setIsRunningMatch(true)
    setError(null)
    try {
      await api.runJobMatching(job.id)
      setToast({
        type: 'success',
        message: 'AI matching started. Refresh in a moment for new results.',
      })
      setTimeout(async () => {
        const matchData = await api.getJobMatches(job.id)
        setMatches(matchData || [])
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to run AI matching.')
    } finally {
      setIsRunningMatch(false)
    }
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

  const handleNextAction = (actionLabel, match) => {
    const candidateName = match?.candidate
      ? `${match.candidate.firstName || ''} ${match.candidate.lastName || ''}`.trim() || 'Candidate'
      : 'Candidate'
    setToast({
      type: 'success',
      message: `${actionLabel} queued for ${candidateName}.`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/30 via-white to-indigo-50/20 flex flex-col">
      <DashboardHeader
        userName={userName}
        userEmail={userEmail}
        userInitial={userInitial}
        onProfile={() => navigate('/employer-onboarding')}
        onLogout={() => navigate('/')}
        breadcrumbs={[
          { label: 'Employer Dashboard', href: '/employer-dashboard' },
          { label: 'Job Details', href: `/employer-jobs/${jobId}` },
        ]}
        title=""
        subtitle=""
      />

      <div className="flex flex-1">
        <DashboardSidebar
          title="Employer"
          collapsed={false}
          onToggleCollapse={() => {}}
          activeView="jobs"
          menuItems={[
            { id: 'jobs', label: 'Jobs', icon: 'fa-solid fa-briefcase', onClick: () => navigate('/employer-dashboard') },
            { id: 'matches', label: 'AI Shortlist', icon: 'fa-solid fa-user-check', onClick: () => navigate('/employer-dashboard') },
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

            {isLoading ? (
              <div className="text-xs text-neutral-600">Loading job details...</div>
            ) : job ? (
              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-neutral-900">{job.title}</h2>
                      <div className="text-xs text-neutral-500 mt-1">{job.status}</div>
                      <div className="text-xs text-neutral-600 mt-2">
                        {job.location || 'Location not set'} · {job.workFormat || 'Work format not set'}
                      </div>
                      {job.salaryRange && (
                        <div className="text-xs text-neutral-600 mt-1">Salary: {job.salaryRange}</div>
                      )}
                    </div>
                    {job.status !== 'PUBLISHED' && (
                      <button
                        onClick={handlePublish}
                        className="px-3 py-2 text-xs bg-indigo-50 text-primary rounded-lg hover:bg-indigo-100 transition"
                      >
                        Publish & Match
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Job Description</h3>
                  <p className="text-xs text-neutral-600 whitespace-pre-wrap">
                    {job.descriptionRaw}
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-neutral-900">AI Shortlist</h3>
                    <button
                      onClick={handleRunMatching}
                      disabled={isRunningMatch}
                      className="px-3 py-2 text-xs bg-indigo-50 text-primary rounded-lg hover:bg-indigo-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isRunningMatch ? 'Running...' : 'Run AI Matching'}
                    </button>
                  </div>
                  {matches.length ? (
                    <div className="space-y-3">
                      {matches.map((match) => (
                        <div key={match.id} className="border border-neutral-200 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-neutral-900">
                              {match.candidate?.firstName || 'Candidate'} {match.candidate?.lastName || ''}
                            </div>
                            <div className="text-xs text-neutral-500">{match.candidate?.email}</div>
                            <div className="text-xs text-neutral-600 mt-1">{match.summary}</div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full ${getMatchStatusStyles(match.status)}`}>
                              {normalizeStatus(match.status).toLowerCase()}
                            </span>
                            <div className="text-xs font-semibold text-indigo-600 mt-1">{match.matchScore}% Fit</div>
                            <div className="flex items-center gap-2 mt-2 justify-end">
                              <button
                                onClick={() => handleUpdateMatchStatus(match.id, 'SHORTLISTED')}
                                disabled={updatingMatchId === match.id}
                                className="px-2.5 py-1 text-[10px] bg-indigo-50 text-primary rounded-lg hover:bg-indigo-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                Shortlist
                              </button>
                              <button
                                onClick={() => handleUpdateMatchStatus(match.id, 'REJECTED')}
                                disabled={updatingMatchId === match.id}
                                className="px-2.5 py-1 text-[10px] border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                Reject
                              </button>
                            </div>
                            {normalizeStatus(match.status) === 'SHORTLISTED' && (
                              <div className="flex items-center gap-1.5 mt-2 justify-end">
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
                  ) : (
                    <div className="text-xs text-neutral-500">No matches yet. Publish the job to generate matches.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-xs text-neutral-500">Job not found.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default EmployerJobDetails
