import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { wsClient } from '../utils/websocket'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import Footer from '../components/Footer'
import SocialSidebar from '../components/SocialSidebar'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'
import { useAuth } from '../hooks/useAuth'
import { getCandidateMenuItems, getCandidateQuickActions } from '../utils/candidateSidebar'

const AnalysisStatus = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { accessToken, isAuthenticated, user, logout } = useAuth()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [resumes, setResumes] = useState([])
  const [videos, setVideos] = useState([])

  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''
  const userInitial = (user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate('/signin', { replace: true })
      return
    }

    // Fetch resumes and videos
    const fetchUserData = async () => {
      try {
        const userResumes = await api.getUserResumes()
        setResumes(userResumes || [])
      } catch (error) {
        console.error('Error fetching resumes:', error)
      }

      try {
        const userVideos = await api.getUserVideos()
        setVideos(userVideos || [])
      } catch (error) {
        console.error('Error fetching videos:', error)
      }
    }

    fetchUserData()

    // Connect WebSocket
    wsClient.connect()

    // Subscribe to progress updates via WebSocket
    const unsubscribe = wsClient.on('analysis:progress', (data) => {
      if (data.analysisRequestId === id) {
        setAnalysis(prev => ({
          ...prev,
          status: data.status,
          progress: data.progress,
        }))
      }
    })

    // Fetch initial status only once
    const fetchStatus = async () => {
      try {
        setLoading(true)
        const status = await api.getAnalysisStatus(id)
        setAnalysis(status)
      } catch (err) {
        setError(err.message || 'Failed to load analysis status')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()

    return () => {
      unsubscribe()
    }
  }, [id, isAuthenticated, accessToken, navigate])

  const handleLogout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      logout()
      navigate('/')
    }
  }

  const getStatusMessage = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Initializing analysis...'
      case 'RESUME_PARSING':
        return 'Parsing resume document...'
      case 'RESUME_ANALYZING':
        return 'Analyzing resume content...'
      case 'VIDEO_TRANSCRIBING':
        return 'Transcribing video...'
      case 'VIDEO_ANALYZING':
        return 'Analyzing video presentation...'
      case 'GENERATING_REPORT':
        return 'Generating final report...'
      case 'COMPLETED':
        return 'Analysis complete!'
      case 'FAILED':
        return 'Analysis failed'
      default:
        return 'Processing...'
    }
  }

  const getResumeSteps = () => {
    if (!analysis) return []
    
    const status = analysis.status

    return [
      {
        label: 'Document parsed successfully',
        completed: status !== 'PENDING' && status !== 'RESUME_PARSING',
        inProgress: status === 'RESUME_PARSING',
      },
      {
        label: 'Skills extracted and categorized',
        completed: status === 'VIDEO_TRANSCRIBING' || status === 'VIDEO_ANALYZING' || status === 'GENERATING_REPORT' || status === 'COMPLETED',
        inProgress: status === 'RESUME_ANALYZING',
      },
      {
        label: 'Analyzing content quality and impact',
        completed: status === 'VIDEO_TRANSCRIBING' || status === 'VIDEO_ANALYZING' || status === 'GENERATING_REPORT' || status === 'COMPLETED',
        inProgress: status === 'RESUME_ANALYZING',
      },
      {
        label: 'Generating improvement suggestions',
        completed: status === 'VIDEO_TRANSCRIBING' || status === 'VIDEO_ANALYZING' || status === 'GENERATING_REPORT' || status === 'COMPLETED',
        inProgress: status === 'RESUME_ANALYZING',
      },
    ]
  }

  const getVideoSteps = () => {
    if (!analysis) return []
    
    const status = analysis.status

    return [
      {
        label: 'Video uploaded and transcribed',
        completed: status === 'VIDEO_ANALYZING' || status === 'GENERATING_REPORT' || status === 'COMPLETED',
        inProgress: status === 'VIDEO_TRANSCRIBING',
      },
      {
        label: 'Analyzing communication clarity',
        completed: status === 'GENERATING_REPORT' || status === 'COMPLETED',
        inProgress: status === 'VIDEO_ANALYZING',
      },
      {
        label: 'Evaluating presentation quality',
        completed: status === 'GENERATING_REPORT' || status === 'COMPLETED',
        inProgress: status === 'VIDEO_ANALYZING',
      },
      {
        label: 'Generating personalized tips',
        completed: status === 'COMPLETED',
        inProgress: status === 'GENERATING_REPORT',
      },
    ]
  }

  if (loading && !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50/30 via-white to-indigo-50/20 flex items-center justify-center">
        <LoadingSpinner text="Loading analysis status..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50/30 via-white to-indigo-50/20 flex flex-col">
        <DashboardHeader
          userName={userName}
          userEmail={userEmail}
          userInitial={userInitial}
          onProfile={() => navigate('/user-dashboard')}
          onLogout={handleLogout}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Analysis Status' }
          ]}
          title=""
          subtitle=""
        />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <ErrorMessage message={error} />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  // Calculate dynamic values
  const resumeSteps = getResumeSteps()
  const videoSteps = getVideoSteps()
  
  // Calculate estimated time remaining (in minutes)
  const getEstimatedTime = () => {
    if (analysis.status === 'COMPLETED') return 'Results ready'
    if (analysis.progress >= 90) return 'Less than 1 min'
    if (analysis.progress >= 75) return '1–2 min'
    if (analysis.progress >= 50) return '2–3 min'
    if (analysis.progress >= 25) return '3–4 min'
    return '4+ min'
  }  

  // Calculate candidate quality percentile based on progress
  const getCandidateQuality = () => {
    if (analysis.progress >= 90) return 'Top 10%'
    if (analysis.progress >= 75) return 'Top 15%'
    if (analysis.progress >= 50) return 'Top 25%'
    if (analysis.progress >= 25) return 'Top 50%'
    return 'Analyzing...'
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
          { label: 'Analysis Status' }
        ]}
          title=""
          subtitle=""
      />

      <div className="flex flex-1">
        <DashboardSidebar
          title="Workspace"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeView="assessments"
          menuItems={getCandidateMenuItems({
            navigate,
            resumeCount: resumes.length,
            videoCount: videos.length,
          })}
          quickFilters={getCandidateQuickActions(navigate)}
        />

        <main className="flex-1 pr-11 lg:pr-14">
          <section className="px-8 py-4">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-4">
                <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mb-0.5">Analysis Status</h1>
                <p className="text-xs text-neutral-600">Track your profile analysis progress</p>
              </div>

              {/* Profile Complete Section */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                    <i className="fa-solid fa-check text-white text-2xl"></i>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-neutral-900">Profile Complete!</h2>
                <p className="text-sm text-neutral-600 mb-4">
                  Your onboarding is complete and AI feedback is on the way
                </p>
                
                {/* Progress Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 p-4 text-center shadow-md">
                    <div className={`text-2xl font-bold mb-1 ${analysis.status === 'COMPLETED' ? 'text-green-600' : 'text-neutral-900'}`}>
                      {getEstimatedTime()}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {analysis.status === 'COMPLETED' ? 'Analysis Complete' : 'Time to Complete'}
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 p-4 text-center shadow-md">
                    <div className="text-2xl font-bold mb-1 text-neutral-900">{analysis.progress}%</div>
                    <div className="text-xs text-neutral-600">Profile Completeness</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 p-4 text-center shadow-md">
                    <div className="text-2xl font-bold mb-1 text-neutral-900">{getCandidateQuality()}</div>
                    <div className="text-xs text-neutral-600">Candidate Quality</div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/user-dashboard')}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg text-sm font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                >
                  View Your Dashboard
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </div>

              {/* Main Analysis Panel */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold flex items-center text-neutral-900">
                    <i className="fa-solid fa-robot mr-2 text-primary text-sm"></i>
                    AI Analysis in Progress
                  </h2>
                  <span className="text-xs text-neutral-600 flex items-center gap-1.5">
                    {analysis.status !== 'COMPLETED' && analysis.status !== 'FAILED' && (
                      <>
                        Processing...
                        <i className="fa-solid fa-spinner fa-spin text-primary text-xs"></i>
                      </>
                    )}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mb-4">
                  Our AI is analyzing your profile and preparing personalized feedback
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Resume Analysis */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold flex items-center text-neutral-900">
                        <i className="fa-solid fa-file-lines mr-2 text-primary text-xs"></i>
                        Resume Analysis
                      </h3>
                      <span className="text-xs text-neutral-600 flex items-center gap-1.5">
                        {analysis.status === 'RESUME_PARSING' || analysis.status === 'RESUME_ANALYZING' ? (
                          <>
                            Processing...
                            <i className="fa-solid fa-spinner fa-spin text-primary text-xs"></i>
                          </>
                        ) : analysis.progress >= 40 ? (
                          <span className="text-green-600">Completed</span>
                        ) : (
                          'Pending'
                        )}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {resumeSteps.map((step, index) => (
                        <li key={index} className="flex items-center">
                          {step.completed ? (
                            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mr-2">
                              <i className="fa-solid fa-check text-white text-[10px]"></i>
                            </div>
                          ) : step.inProgress ? (
                            <i className="fa-solid fa-spinner fa-spin text-primary mr-2 text-xs"></i>
                          ) : (
                            <i className="fa-solid fa-circle text-neutral-300 mr-2 text-xs"></i>
                          )}
                          <span className={`text-xs ${step.completed ? 'text-green-600' : step.inProgress ? 'text-primary' : 'text-neutral-500'}`}>
                            {step.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 text-xs text-neutral-600">
                      {analysis.status === 'RESUME_PARSING' || analysis.status === 'RESUME_ANALYZING' 
                        ? 'Estimated completion: ~1 min'
                        : analysis.progress >= 40 
                        ? 'Completed'
                        : 'Estimated completion: ~1 min'}
                    </div>
                  </div>

                  {/* Video Analysis */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold flex items-center text-neutral-900">
                        <i className="fa-solid fa-video mr-2 text-primary text-xs"></i>
                        Video Analysis
                      </h3>
                      <span className="text-xs text-neutral-600 flex items-center gap-1.5">
                        {analysis.status === 'VIDEO_TRANSCRIBING' || analysis.status === 'VIDEO_ANALYZING' || analysis.status === 'GENERATING_REPORT' ? (
                          <>
                            Processing...
                            <i className="fa-solid fa-spinner fa-spin text-primary text-xs"></i>
                          </>
                        ) : analysis.progress >= 50 ? (
                          <span className="text-green-600">Completed</span>
                        ) : (
                          'Pending'
                        )}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {videoSteps.map((step, index) => (
                        <li key={index} className="flex items-center">
                          {step.completed ? (
                            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mr-2">
                              <i className="fa-solid fa-check text-white text-[10px]"></i>
                            </div>
                          ) : step.inProgress ? (
                            <i className="fa-solid fa-spinner fa-spin text-primary mr-2 text-xs"></i>
                          ) : (
                            <i className="fa-solid fa-circle text-neutral-300 mr-2 text-xs"></i>
                          )}
                          <span className={`text-xs ${step.completed ? 'text-green-600' : step.inProgress ? 'text-primary' : 'text-neutral-500'}`}>
                            {step.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 text-xs text-neutral-600">
                      {analysis.status === 'VIDEO_TRANSCRIBING' || analysis.status === 'VIDEO_ANALYZING' || analysis.status === 'GENERATING_REPORT'
                        ? 'Estimated completion: ~3 mins'
                        : analysis.progress >= 80 
                        ? 'Completed'
                        : 'Estimated completion: ~3 mins'}
                    </div>
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="mt-4 pt-4 border-t border-indigo-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-neutral-900">Overall Progress</span>
                    <span className="text-xs text-neutral-600">{analysis.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1.5">
                    {analysis.status === 'COMPLETED' 
                      ? 'Analysis complete!'
                      : `Your AI feedback will be ready in approximately ${getEstimatedTime()} minutes`}
                  </p>
                </div>

                {/* View Full Report Button - Show when completed */}
                {analysis.status === 'COMPLETED' && (
                  <div className="mt-4 pt-4 border-t border-indigo-200">
                    <button
                      onClick={() => navigate(`/assessments/${id}`)}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <i className="fa-solid fa-chart-line text-xs"></i>
                      View Full Assessment Report
                      <i className="fa-solid fa-arrow-right text-xs"></i>
                    </button>
                  </div>
                )}
              </div>

              {analysis.status === 'FAILED' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-red-700">
                    Analysis failed: {analysis.errorMessage || 'Unknown error'}
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default AnalysisStatus
