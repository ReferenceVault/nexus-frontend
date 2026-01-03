import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { wsClient } from '../utils/websocket'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../hooks/useAuth'

const AnalysisStatus = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { accessToken, isAuthenticated } = useAuth()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate('/signin', { replace: true })
      return
    }

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
        
        // If completed, don't auto-redirect - let user click button
        // Status will be updated and button will appear
      }
    })

    // Fetch initial status only once
    const fetchStatus = async () => {
      try {
        setLoading(true)
        const status = await api.getAnalysisStatus(id)
        setAnalysis(status)

        // If already completed, don't auto-redirect - let user click button
        // Button will be shown in UI
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <LoadingSpinner text="Loading analysis status..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white text-neutral-900 min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <ErrorMessage message={error} />
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
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 min-h-screen text-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Profile Complete Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                <i className="fa-solid fa-check text-white text-4xl"></i>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Profile Complete!</h1>
            <p className="text-xl text-gray-300 mb-8">
              Your onboarding is complete and AI feedback is on the way
            </p>
            
            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className={`text-3xl font-bold mb-2 ${analysis.status === 'COMPLETED' ? 'text-green-400' : ''}`}>
                  {getEstimatedTime()}
                </div>
                <div className="text-gray-300">
                  {analysis.status === 'COMPLETED' ? 'Analysis Complete' : 'Time to Complete'}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold mb-2">{analysis.progress}%</div>
                <div className="text-gray-300">Profile Completeness</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold mb-2">{getCandidateQuality()}</div>
                <div className="text-gray-300">Candidate Quality</div>
              </div>
            </div>

            <button
              onClick={() => navigate('/user-dashboard')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition flex items-center gap-2 mx-auto"
            >
              View Your Dashboard
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          {/* Main Analysis Panel */}
          <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-xl p-8 mb-8 border border-purple-500/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <i className="fa-solid fa-robot mr-3"></i>
                AI Analysis in Progress
              </h2>
              <span className="text-sm text-gray-300 flex items-center gap-2">
                {analysis.status !== 'COMPLETED' && analysis.status !== 'FAILED' && (
                  <>
                    Processing...
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  </>
                )}
              </span>
            </div>
            <p className="text-gray-300 mb-8">
              Our AI is analyzing your profile and preparing personalized feedback
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Resume Analysis */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center">
                    <i className="fa-solid fa-file-lines mr-2"></i>
                    Resume Analysis
                  </h3>
                  <span className="text-sm text-gray-300 flex items-center gap-2">
                    {analysis.status === 'RESUME_PARSING' || analysis.status === 'RESUME_ANALYZING' ? (
                      <>
                        Processing...
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      </>
                    ) : analysis.progress >= 40 ? (
                      'Completed'
                    ) : (
                      'Pending'
                    )}
                  </span>
                </div>
                <ul className="space-y-3">
                  {resumeSteps.map((step, index) => (
                    <li key={index} className="flex items-center">
                      {step.completed ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                          <i className="fa-solid fa-check text-white text-xs"></i>
                        </div>
                      ) : step.inProgress ? (
                        <i className="fa-solid fa-spinner fa-spin text-indigo-400 mr-3"></i>
                      ) : (
                        <i className="fa-solid fa-circle text-gray-500 mr-3"></i>
                      )}
                      <span className={step.completed ? 'text-green-400' : step.inProgress ? 'text-indigo-400' : 'text-gray-400'}>
                        {step.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-sm text-gray-300">
                  {analysis.status === 'RESUME_PARSING' || analysis.status === 'RESUME_ANALYZING' 
                    ? 'Estimated completion: ~1 min'
                    : analysis.progress >= 40 
                    ? 'Completed'
                    : 'Estimated completion: ~1 min'}
                </div>
              </div>

              {/* Video Analysis */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center">
                    <i className="fa-solid fa-video mr-2"></i>
                    Video Analysis
                  </h3>
                  <span className="text-sm text-gray-300 flex items-center gap-2">
                    {analysis.status === 'VIDEO_TRANSCRIBING' || analysis.status === 'VIDEO_ANALYZING' || analysis.status === 'GENERATING_REPORT' ? (
                      <>
                        Processing...
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      </>
                    ) : analysis.progress >= 50 ? (
                      'Completed'
                    ) : (
                      'Pending'
                    )}
                  </span>
                </div>
                <ul className="space-y-3">
                  {videoSteps.map((step, index) => (
                    <li key={index} className="flex items-center">
                      {step.completed ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                          <i className="fa-solid fa-check text-white text-xs"></i>
                        </div>
                      ) : step.inProgress ? (
                        <i className="fa-solid fa-spinner fa-spin text-indigo-400 mr-3"></i>
                      ) : (
                        <i className="fa-solid fa-circle text-gray-500 mr-3"></i>
                      )}
                      <span className={step.completed ? 'text-green-400' : step.inProgress ? 'text-indigo-400' : 'text-gray-400'}>
                        {step.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-sm text-gray-300">
                  {analysis.status === 'VIDEO_TRANSCRIBING' || analysis.status === 'VIDEO_ANALYZING' || analysis.status === 'GENERATING_REPORT'
                    ? 'Estimated completion: ~3 mins'
                    : analysis.progress >= 80 
                    ? 'Completed'
                    : 'Estimated completion: ~3 mins'}
                </div>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Overall Progress</span>
                <span className="text-sm">{analysis.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-300 mt-2">
                {analysis.status === 'COMPLETED' 
                  ? 'Analysis complete!'
                  : `Your AI feedback will be ready in approximately ${getEstimatedTime()} minutes`}
              </p>
            </div>

            {/* View Full Report Button - Show when completed */}
            {analysis.status === 'COMPLETED' && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <button
                  onClick={() => navigate(`/assessments/${id}`)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <i className="fa-solid fa-chart-line"></i>
                  View Full Assessment Report
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            )}
          </div>

          {analysis.status === 'FAILED' && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-8">
              <p className="text-red-200">
                Analysis failed: {analysis.errorMessage || 'Unknown error'}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AnalysisStatus

