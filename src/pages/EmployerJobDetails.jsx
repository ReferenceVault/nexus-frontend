import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'
import { api } from '../utils/api'
import { useAuth } from '../hooks/useAuth'
import { useLogout } from '../hooks/useLogout'

const EmployerJobDetails = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { jobId, candidateId } = useParams()
  const { user } = useAuth()
  const handleLogout = useLogout('/employer-signup')
  const [job, setJob] = useState(null)
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingMatchId, setUpdatingMatchId] = useState(null)
  const [toast, setToast] = useState(null)
  const [isRunningMatch, setIsRunningMatch] = useState(false)
  const [messageTemplates, setMessageTemplates] = useState([])
  const [messageLogs, setMessageLogs] = useState([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [messageType, setMessageType] = useState('INTERVIEW_REQUEST')
  const [messageSubject, setMessageSubject] = useState('')
  const [messageBody, setMessageBody] = useState('')
  const [messageDetail, setMessageDetail] = useState('')
  const [messageAssessment, setMessageAssessment] = useState('')
  const [messageOtherRoles, setMessageOtherRoles] = useState('')
  const [detailMatch, setDetailMatch] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const candidateIdParam = candidateId || searchParams.get('candidateId')
  const isCandidateView = Boolean(candidateIdParam)

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
    if (!candidateIdParam || !matches.length) return
    const match = matches.find((item) => item.candidateId === candidateIdParam)
    if (match) {
      setSelectedCandidate(match)
      openMessageComposer(match, 'INTERVIEW_REQUEST')
    }
  }, [candidateIdParam, matches])

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


  const handleCloseJob = async () => {
    if (!job) return
    setError(null)
    try {
      const updated = await api.closeJob(job.id)
      setJob(updated)
      setToast({ type: 'success', message: 'Job closed. Candidates will be notified automatically.' })
    } catch (err) {
      setError(err.message || 'Failed to close job.')
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

  const handleClearCandidate = () => {
    setSelectedCandidate(null)
    setDetailMatch(null)
    if (jobId) {
      navigate(`/employer-jobs/${jobId}`)
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

  const getTemplateByType = (type) =>
    messageTemplates.find((template) => template.type === type)

  const buildPreview = (templateText, match) => {
    const candidateName = match?.candidate
      ? `${match.candidate.firstName || ''} ${match.candidate.lastName || ''}`.trim() || 'Candidate'
      : 'Candidate'
    const jobTitle = job?.title || 'the role'
    const companyName = 'Company / HR Team'
    let text = templateText || ''
    const replacements = {
      Candidate: candidateName,
      Role: jobTitle,
      Company: companyName,
      'Company / HR Team': companyName,
      Detail: messageDetail || 'the requested detail',
      Assessment: messageAssessment || 'the assessment',
      OtherRoles: messageOtherRoles || 'other roles',
    }
    Object.entries(replacements).forEach(([key, value]) => {
      text = text.replaceAll(`[${key}]`, value)
    })
    return text
  }

  const openMessageComposer = async (match, type) => {
    setDetailMatch(match)
    setMessageType(type)
    if (!messageTemplates.length) {
      setIsLoadingTemplates(true)
      try {
        const templates = await api.listMessageTemplates()
        setMessageTemplates(templates || [])
      } finally {
        setIsLoadingTemplates(false)
      }
    }
    if (jobId && match?.candidateId) {
      setIsLoadingLogs(true)
      try {
        const logs = await api.listMessageLogs(jobId, match.candidateId)
        setMessageLogs(logs || [])
      } catch (err) {
        setMessageLogs([])
      } finally {
        setIsLoadingLogs(false)
      }
    }
  }

  useEffect(() => {
    if (!detailMatch) return
    const template = getTemplateByType(messageType)
    setMessageSubject(buildPreview(template?.subject || '', detailMatch))
    setMessageBody(buildPreview(template?.body || '', detailMatch))
  }, [
    messageType,
    messageTemplates,
    detailMatch,
    messageDetail,
    messageAssessment,
    messageOtherRoles,
  ])

  const handleSendMessage = async () => {
    if (!detailMatch || !jobId) return
    setIsSendingMessage(true)
    setError(null)
    try {
      await api.sendMessage({
        jobId,
        candidateId: detailMatch.candidateId,
        type: messageType,
        subject: messageSubject,
        body: messageBody,
        placeholders: {
          Detail: messageDetail,
          Assessment: messageAssessment,
          OtherRoles: messageOtherRoles,
        },
      })
      setToast({
        type: 'success',
        message: 'Message queued successfully.',
      })
      const logs = await api.listMessageLogs(jobId, detailMatch.candidateId)
      setMessageLogs(logs || [])
    } catch (err) {
      setError(err.message || 'Failed to send message.')
    } finally {
      setIsSendingMessage(false)
    }
  }

  const handleCloseDetail = () => {
    setDetailMatch(null)
    setMessageLogs([])
    setMessageSubject('')
    setMessageBody('')
    setMessageDetail('')
    setMessageAssessment('')
    setMessageOtherRoles('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/30 via-white to-indigo-50/20 flex flex-col">
      <DashboardHeader
        userName={userName}
        userEmail={userEmail}
        userInitial={userInitial}
        onProfile={() => navigate('/employer-onboarding')}
        onLogout={handleLogout}
        breadcrumbs={[
          { label: 'Employer Dashboard', href: '/employer-dashboard' },
          { label: 'AI Shortlist', href: '/employer-dashboard?view=matches' },
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
          activeView={isCandidateView ? 'matches' : 'jobs'}
          menuItems={[
            { id: 'jobs', label: 'Jobs', icon: 'fa-solid fa-briefcase', onClick: () => navigate('/employer-dashboard') },
            { id: 'matches', label: 'AI Shortlist', icon: 'fa-solid fa-user-check', onClick: () => navigate('/employer-dashboard?view=matches') },
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
                {selectedCandidate && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Candidate Details</h3>
                        <div className="text-xs text-neutral-500 mt-1">
                          {selectedCandidate.candidate?.firstName || 'Candidate'} {selectedCandidate.candidate?.lastName || ''} · {selectedCandidate.candidate?.email}
                        </div>
                        <div className="text-xs text-neutral-600 mt-2">
                          Match Score: <span className="font-semibold text-indigo-600">{selectedCandidate.matchScore}%</span>
                        </div>
                        <div className="text-xs text-neutral-600 mt-1">
                          Status:{' '}
                          <span className={`px-2 py-0.5 rounded-full ${getMatchStatusStyles(selectedCandidate.status)}`}>
                            {normalizeStatus(selectedCandidate.status).toLowerCase()}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-600 mt-2">
                          Matched Skills: {(selectedCandidate.matchedSkills?.required || []).join(', ') || 'None'}
                        </div>
                        <div className="text-xs text-neutral-600 mt-1">
                          Missing Skills: {(selectedCandidate.missingSkills?.required || []).join(', ') || 'None'}
                        </div>
                        {selectedCandidate.summary && (
                          <div className="text-xs text-neutral-500 mt-1">{selectedCandidate.summary}</div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={handleClearCandidate}
                          className="px-3 py-1.5 text-xs border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition"
                        >
                          Back to Shortlist
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!isCandidateView && (
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
                      <div className="flex items-center gap-2">
                        {job.status !== 'PUBLISHED' && (
                          <button
                            onClick={handlePublish}
                            className="px-3 py-2 text-xs bg-indigo-50 text-primary rounded-lg hover:bg-indigo-100 transition"
                          >
                            Publish & Match
                          </button>
                        )}
                        {job.status === 'PUBLISHED' && (
                          <button
                            onClick={handleCloseJob}
                            className="px-3 py-2 text-xs border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition"
                          >
                            Close Job
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {isCandidateView && selectedCandidate && (
                  <>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                      <div className="text-xs font-semibold text-neutral-700 mb-2">Next Best Actions</div>
                      <div className="flex flex-wrap gap-2">
                        {['Message Candidate', 'Schedule Interview', 'Request Resume', 'Move to Interview', 'Status On Hold'].map((action) => (
                          <button
                            key={action}
                            onClick={() => handleNextAction(action, selectedCandidate)}
                            className="px-3 py-1.5 text-xs border border-neutral-200 rounded-lg hover:bg-indigo-50 transition"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                      <div className="text-xs font-semibold text-neutral-700 mb-2">Send Message</div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {[
                          { label: 'Interview Request', value: 'INTERVIEW_REQUEST' },
                          { label: 'Additional Info', value: 'ADDITIONAL_INFO_REQUEST' },
                          { label: 'Assessment Request', value: 'ASSESSMENT_REQUEST' },
                          { label: 'Status On Hold', value: 'STATUS_ON_HOLD' },
                          { label: 'Polite Rejection', value: 'POLITE_REJECTION' },
                          { label: 'Rejection + Redirect', value: 'REJECTION_REDIRECT' },
                        ].map((item) => (
                          <button
                            key={item.value}
                            onClick={() => setMessageType(item.value)}
                            className={`px-2.5 py-1 text-[10px] rounded-full border transition ${
                              messageType === item.value
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-neutral-600 border-neutral-200 hover:border-indigo-200'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                      {isLoadingTemplates ? (
                        <div className="text-xs text-neutral-500 mb-2">Loading templates...</div>
                      ) : null}
                      {(messageType === 'ADDITIONAL_INFO_REQUEST' || messageType === 'ASSESSMENT_REQUEST' || messageType === 'REJECTION_REDIRECT') && (
                        <div className="grid md:grid-cols-3 gap-2 mb-3">
                          {messageType === 'ADDITIONAL_INFO_REQUEST' && (
                            <input
                              value={messageDetail}
                              onChange={(e) => setMessageDetail(e.target.value)}
                              className="px-2.5 py-1.5 text-xs border border-neutral-200 rounded-lg"
                              placeholder="Specific detail"
                            />
                          )}
                          {messageType === 'ASSESSMENT_REQUEST' && (
                            <input
                              value={messageAssessment}
                              onChange={(e) => setMessageAssessment(e.target.value)}
                              className="px-2.5 py-1.5 text-xs border border-neutral-200 rounded-lg"
                              placeholder="Assessment details"
                            />
                          )}
                          {messageType === 'REJECTION_REDIRECT' && (
                            <input
                              value={messageOtherRoles}
                              onChange={(e) => setMessageOtherRoles(e.target.value)}
                              className="px-2.5 py-1.5 text-xs border border-neutral-200 rounded-lg"
                              placeholder="Other roles"
                            />
                          )}
                        </div>
                      )}
                      <input
                        value={messageSubject}
                        onChange={(e) => setMessageSubject(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-neutral-200 rounded-lg mb-2"
                        placeholder="Subject"
                      />
                      <textarea
                        value={messageBody}
                        onChange={(e) => setMessageBody(e.target.value)}
                        rows={6}
                        className="w-full px-2.5 py-2 text-xs border border-neutral-200 rounded-lg"
                        placeholder="Message body"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={handleSendMessage}
                          disabled={isSendingMessage}
                          className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isSendingMessage ? 'Sending...' : 'Send Message'}
                        </button>
                        <span className="text-[10px] text-neutral-500">Messages are queued and sent in background.</span>
                      </div>
                      <div className="mt-3">
                        <div className="text-[10px] font-semibold text-neutral-600 mb-1">Recent Messages</div>
                        {isLoadingLogs ? (
                          <div className="text-[10px] text-neutral-500">Loading logs...</div>
                        ) : messageLogs.length ? (
                          <div className="space-y-1">
                            {messageLogs.slice(0, 4).map((log) => (
                              <div key={log.id} className="text-[10px] text-neutral-600">
                                {log.type} · {log.status} · {new Date(log.createdAt).toLocaleDateString()}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[10px] text-neutral-500">No messages yet.</div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateMatchStatus(selectedCandidate.id, 'SHORTLISTED')}
                        disabled={updatingMatchId === selectedCandidate.id}
                        className="flex-1 px-3 py-2 text-xs bg-indigo-50 text-primary rounded-lg hover:bg-indigo-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleUpdateMatchStatus(selectedCandidate.id, 'REJECTED')}
                        disabled={updatingMatchId === selectedCandidate.id}
                        className="flex-1 px-3 py-2 text-xs border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        Reject
                      </button>
                    </div>
                  </>
                )}

                {!isCandidateView && (
                  <>
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
                                  <button
                                    onClick={() => openMessageComposer(match, 'INTERVIEW_REQUEST')}
                                    className="px-2.5 py-1 text-[10px] border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition"
                                  >
                                    Send Message
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
                  </>
                )}
              </div>
            ) : (
              <div className="text-xs text-neutral-500">Job not found.</div>
            )}
          </div>
        </main>
      </div>

      {detailMatch && !isCandidateView && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-neutral-900">Send Message</h4>
              <button onClick={handleCloseDetail} className="text-neutral-500 hover:text-neutral-700">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="text-xs text-neutral-600 mb-3">
              {detailMatch.candidate?.firstName || 'Candidate'} {detailMatch.candidate?.lastName || ''} · {detailMatch.candidate?.email}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: 'Interview Request', value: 'INTERVIEW_REQUEST' },
                { label: 'Additional Info', value: 'ADDITIONAL_INFO_REQUEST' },
                { label: 'Assessment Request', value: 'ASSESSMENT_REQUEST' },
                { label: 'Status On Hold', value: 'STATUS_ON_HOLD' },
                { label: 'Polite Rejection', value: 'POLITE_REJECTION' },
                { label: 'Rejection + Redirect', value: 'REJECTION_REDIRECT' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setMessageType(item.value)}
                  className={`px-2.5 py-1 text-[10px] rounded-full border transition ${
                    messageType === item.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-indigo-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {isLoadingTemplates ? (
              <div className="text-xs text-neutral-500 mb-2">Loading templates...</div>
            ) : null}
            {(messageType === 'ADDITIONAL_INFO_REQUEST' || messageType === 'ASSESSMENT_REQUEST' || messageType === 'REJECTION_REDIRECT') && (
              <div className="grid md:grid-cols-3 gap-2 mb-3">
                {messageType === 'ADDITIONAL_INFO_REQUEST' && (
                  <input
                    value={messageDetail}
                    onChange={(e) => setMessageDetail(e.target.value)}
                    className="px-2.5 py-1.5 text-xs border border-neutral-200 rounded-lg"
                    placeholder="Specific detail"
                  />
                )}
                {messageType === 'ASSESSMENT_REQUEST' && (
                  <input
                    value={messageAssessment}
                    onChange={(e) => setMessageAssessment(e.target.value)}
                    className="px-2.5 py-1.5 text-xs border border-neutral-200 rounded-lg"
                    placeholder="Assessment details"
                  />
                )}
                {messageType === 'REJECTION_REDIRECT' && (
                  <input
                    value={messageOtherRoles}
                    onChange={(e) => setMessageOtherRoles(e.target.value)}
                    className="px-2.5 py-1.5 text-xs border border-neutral-200 rounded-lg"
                    placeholder="Other roles"
                  />
                )}
              </div>
            )}
            <input
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-200 rounded-lg mb-2"
              placeholder="Subject"
            />
            <textarea
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              rows={6}
              className="w-full px-2.5 py-2 text-xs border border-neutral-200 rounded-lg"
              placeholder="Message body"
            />
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={handleSendMessage}
                disabled={isSendingMessage}
                className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSendingMessage ? 'Sending...' : 'Send Message'}
              </button>
              <span className="text-[10px] text-neutral-500">Messages are queued and sent in background.</span>
            </div>
            <div className="mt-3">
              <div className="text-[10px] font-semibold text-neutral-600 mb-1">Recent Messages</div>
              {isLoadingLogs ? (
                <div className="text-[10px] text-neutral-500">Loading logs...</div>
              ) : messageLogs.length ? (
                <div className="space-y-1">
                  {messageLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="text-[10px] text-neutral-600">
                      {log.type} · {log.status} · {new Date(log.createdAt).toLocaleDateString()}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[10px] text-neutral-500">No messages yet.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployerJobDetails
