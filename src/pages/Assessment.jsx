import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { api } from '../utils/api'
import { useAuth } from '../hooks/useAuth'

const Assessment = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { accessToken, isAuthenticated } = useAuth()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasResume, setHasResume] = useState(false)
  const [checkingResume, setCheckingResume] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate('/signin', { replace: true })
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        setCheckingResume(true)

        // First, check if user has uploaded a resume
        let userHasResume = false
        try {
          const resumes = await api.getUserResumes()
          userHasResume = resumes && resumes.length > 0
          setHasResume(userHasResume)
        } catch (resumeErr) {
          console.error('Error checking resumes:', resumeErr)
          setHasResume(false)
          userHasResume = false
        } finally {
          setCheckingResume(false)
        }

        // If no resume, don't try to fetch analysis
        if (!userHasResume) {
          setLoading(false)
          return
        }

        // Fetch analysis
        let analysisData
        try {
          if (id) {
            // Fetch specific analysis by ID
            analysisData = await api.getAnalysisResults(id)
          } else {
            // Fetch latest analysis
            analysisData = await api.getLatestAnalysis()
          }
        } catch (analysisErr) {
          // If analysis not found, that's okay - show blank state
          console.log('No analysis found:', analysisErr)
          setLoading(false)
          return
        }

        if (!analysisData) {
          // No analysis found, but user has resume - this is okay, show blank state
          setLoading(false)
          return
        }

        if (analysisData.status !== 'COMPLETED') {
          // Redirect to status page if not completed
          navigate(`/analysis/${analysisData.id}`, { replace: true })
          return
        }

        setAnalysis(analysisData)
      } catch (err) {
        console.error('Error fetching data:', err)
        // Don't set error if it's just "no analysis found" - show blank state instead
        if (err.message && !err.message.includes('not found')) {
          setError(err.message || 'Failed to load analysis results')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, isAuthenticated, accessToken, navigate])

  if (loading || checkingResume) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading analysis results..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white min-h-screen">
        <Header activeNav="Assessments" />
        <div className="container mx-auto px-4 py-16">
          <ErrorMessage message={error} />
        </div>
        <Footer />
      </div>
    )
  }

  // Show blank state if no resume or no analysis
  if (!hasResume || !analysis || !analysis.overallReport) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white min-h-screen flex flex-col">
        <Header activeNav="Assessments" />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              {/* Icon */}
              <div className="mx-auto mb-8 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 flex items-center justify-center shadow-xl">
                <i className="fa-solid fa-file-circle-question text-5xl text-indigo-300"></i>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {!hasResume ? 'No Resume Uploaded Yet' : 'No Analysis Available'}
              </h1>

              {/* Description */}
              <p className="text-lg text-slate-300 mb-8 max-w-lg mx-auto">
                {!hasResume 
                  ? "You haven't uploaded your resume yet. Complete the onboarding process to get AI-powered feedback on your resume and video introduction."
                  : "Your analysis results aren't ready yet. Complete the onboarding process to generate your personalized AI feedback."}
              </p>

              {/* Features List */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8 text-left">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-sparkles text-indigo-400"></i>
                  What You'll Get:
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <i className="fa-solid fa-check-circle text-emerald-400 mt-1"></i>
                    <div>
                      <div className="text-white font-medium">Resume Analysis</div>
                      <div className="text-sm text-slate-400">Get detailed feedback on your resume quality, formatting, and content</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fa-solid fa-check-circle text-emerald-400 mt-1"></i>
                    <div>
                      <div className="text-white font-medium">Video Introduction Review</div>
                      <div className="text-sm text-slate-400">AI-powered analysis of your presentation and communication skills</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fa-solid fa-check-circle text-emerald-400 mt-1"></i>
                    <div>
                      <div className="text-white font-medium">Personalized Recommendations</div>
                      <div className="text-sm text-slate-400">Actionable tips to improve your profile and stand out to employers</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fa-solid fa-check-circle text-emerald-400 mt-1"></i>
                    <div>
                      <div className="text-white font-medium">Skills Gap Analysis</div>
                      <div className="text-sm text-slate-400">Discover which skills to add to boost your market value</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => navigate('/onboarding')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
              >
                <i className="fa-solid fa-rocket"></i>
                <span>Start Onboarding</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>

              {/* Help Text */}
              <p className="mt-6 text-sm text-slate-400">
                Takes less than 5 minutes to complete
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const overallReport = analysis.overallReport || {}
  const resumeAnalysis = analysis.resumeAnalysis || {}
  const videoAnalysis = analysis.videoAnalysis || {}
  const skillsGap = overallReport.skillsGapAnalysis || {}
  const keyRecommendations = overallReport.keyRecommendations || []
  const strengthsAndImprovements = overallReport.strengthsAndImprovements || []

  const overallScore = analysis.overallScore || overallReport.overallScore || 0
  const resumeScore = overallReport.resumeScore || resumeAnalysis.overallScore || 0
  const videoScore = overallReport.videoScore || videoAnalysis.overallScore || 0
  const percentile = overallReport.percentile || 'top 25%'

  const resumeBreakdown = resumeAnalysis.breakdown || {}
  const videoBreakdown = videoAnalysis.breakdown || {}

  const strongSkills = skillsGap.strongSkills || []
  const recommendedSkills = skillsGap.recommendedSkills || []

  // Filter and get 2 strengths and 2 improvements
  const strengths = strengthsAndImprovements.filter(item => 
    item.type === 'Strength' || item.type === 'strength'
  ).slice(0, 2)
  const improvements = strengthsAndImprovements.filter(item => 
    item.type === 'Improvement' || item.type === 'improvement'
  ).slice(0, 2)

  // Get color for recommendation priority
  const getRecommendationColor = (priority, index) => {
    if (priority === 'high') return 'yellow'
    if (priority === 'medium') return 'blue'
    return 'emerald'
  }

  // Get icon for strength/improvement type
  const getStrengthIcon = (type) => {
    const normalizedType = type?.toLowerCase()
    if (normalizedType === 'strength') return 'fa-check-circle'
    if (normalizedType === 'improvement') return 'fa-triangle-exclamation'
    return 'fa-lightbulb'
  }

  // Get color for strength/improvement type
  const getStrengthColor = (type) => {
    const normalizedType = type?.toLowerCase()
    if (normalizedType === 'strength') return 'emerald'
    if (normalizedType === 'improvement') return 'yellow'
    return 'blue'
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white min-h-screen flex flex-col">
      <Header userMode activeNav="Assessments" />

      <main className="flex-1">
        <section className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-9">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">AI Feedback Results</h1>
                  <p className="text-xs text-slate-300">Your personalized analysis and recommendations are ready</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white/20 transition flex items-center gap-1.5">
                    <i className="fa-solid fa-download text-xs"></i>
                    Export Report
                  </button>
                  <button className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white/20 transition flex items-center gap-1.5">
                    <i className="fa-solid fa-share text-xs"></i>
                    Share Results
                  </button>
                </div>
              </div>
            </div>

            {/* Overall Analysis Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-robot text-xl text-white"></i>
                <div>
                  <h2 className="text-xl font-bold text-white">AI Analysis Complete</h2>
                  <p className="text-xs text-slate-300">Your profile has been thoroughly analyzed by our advanced AI system</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 items-center">
                {/* Resume Quality Tile */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fa-solid fa-file-lines text-indigo-300 text-lg"></i>
                    <div className="text-xs text-slate-300">Resume Quality</div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{resumeScore}</div>
                  <div className="w-full h-2 bg-white/20 rounded-full">
                    <div className="h-2 bg-indigo-400 rounded-full" style={{ width: `${resumeScore}%` }}></div>
                  </div>
                </div>
                {/* Video Presentation Tile */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fa-solid fa-video text-purple-300 text-lg"></i>
                    <div className="text-xs text-slate-300">Video Presentation</div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{videoScore}</div>
                  <div className="w-full h-2 bg-white/20 rounded-full">
                    <div className="h-2 bg-purple-400 rounded-full" style={{ width: `${videoScore}%` }}></div>
                  </div>
                </div>
                {/* Overall Score Circle */}
                <div className="text-center">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center mx-auto mb-2 shadow-xl">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white">{overallScore}</div>
                      <div className="text-xs text-indigo-100">Overall Score</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300">You're in the {percentile} of candidates</div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis Cards */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Resume Analysis Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-file-lines text-indigo-300 text-base"></i>
                    <div>
                      <h3 className="text-base font-bold text-white">Resume Analysis</h3>
                      <p className="text-[10px] text-slate-400">Comprehensive document review</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-300">{resumeScore}</div>
                    <div className="text-[10px] text-slate-400">out of 100</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-file-text text-indigo-300 text-xs"></i>
                        <span className="text-slate-300">Content Quality</span>
                      </div>
                      <span className="text-white font-semibold">{resumeBreakdown.contentQuality || 0}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full">
                      <div className="h-1.5 bg-indigo-400 rounded-full" style={{ width: `${resumeBreakdown.contentQuality || 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-palette text-indigo-300 text-xs"></i>
                        <span className="text-slate-300">Format & Design</span>
                      </div>
                      <span className="text-white font-semibold">{resumeBreakdown.formatDesign || 0}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full">
                      <div className="h-1.5 bg-indigo-400 rounded-full" style={{ width: `${resumeBreakdown.formatDesign || 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-key text-indigo-300 text-xs"></i>
                        <span className="text-slate-300">Keyword Optimization</span>
                      </div>
                      <span className="text-white font-semibold">{resumeBreakdown.keywordOptimization || 0}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full">
                      <div className="h-1.5 bg-indigo-400 rounded-full" style={{ width: `${resumeBreakdown.keywordOptimization || 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-bullseye text-indigo-300 text-xs"></i>
                        <span className="text-slate-300">Impact Statements</span>
                      </div>
                      <span className="text-white font-semibold">{resumeBreakdown.impactStatements || 0}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full">
                      <div className="h-1.5 bg-indigo-400 rounded-full" style={{ width: `${resumeBreakdown.impactStatements || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Analysis Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-video text-indigo-300 text-base"></i>
                    <div>
                      <h3 className="text-base font-bold text-white">Video Analysis</h3>
                      <p className="text-[10px] text-slate-400">Presentation & communication review</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-300">{videoScore}</div>
                    <div className="text-[10px] text-slate-400">out of 100</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-microphone text-indigo-300 text-xs"></i>
                        <span className="text-slate-300">Speech Clarity</span>
                      </div>
                      <span className="text-white font-semibold">{videoBreakdown.speechClarity || 0}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full">
                      <div className="h-1.5 bg-indigo-400 rounded-full" style={{ width: `${videoBreakdown.speechClarity || 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-user-tie text-indigo-300 text-xs"></i>
                        <span className="text-slate-300">Professional Presence</span>
                      </div>
                      <span className="text-white font-semibold">{videoBreakdown.professionalPresence || 0}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full">
                      <div className="h-1.5 bg-indigo-400 rounded-full" style={{ width: `${videoBreakdown.professionalPresence || 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-check-circle text-indigo-300 text-xs"></i>
                        <span className="text-slate-300">Content Relevance</span>
                      </div>
                      <span className="text-white font-semibold">{videoBreakdown.contentRelevance || 0}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full">
                      <div className="h-1.5 bg-indigo-400 rounded-full" style={{ width: `${videoBreakdown.contentRelevance || 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-cog text-indigo-300 text-xs"></i>
                        <span className="text-slate-300">Technical Quality</span>
                      </div>
                      <span className="text-white font-semibold">{videoBreakdown.technicalQuality || 0}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full">
                      <div className="h-1.5 bg-indigo-400 rounded-full" style={{ width: `${videoBreakdown.technicalQuality || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Key Recommendations Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <i className="fa-solid fa-lightbulb text-yellow-400 text-base"></i>
                  <h3 className="text-base font-bold text-white">Key Recommendations</h3>
                </div>
                <div className="space-y-3 mb-4">
                  {keyRecommendations.slice(0, 4).map((rec, index) => {
                    const color = getRecommendationColor(rec.priority, index)
                    const colorClasses = {
                      yellow: 'bg-yellow-500/20 border-yellow-500/30',
                      blue: 'bg-blue-500/20 border-blue-500/30',
                      emerald: 'bg-emerald-500/20 border-emerald-500/30',
                    }
                    const textColors = {
                      yellow: 'text-yellow-400',
                      blue: 'text-blue-400',
                      emerald: 'text-emerald-400',
                    }
                    return (
                      <div key={index} className={`${colorClasses[color]} border rounded-lg p-3`}>
                        <div className="flex items-start gap-2">
                          <span className={`${textColors[color]} font-bold text-base`}>{index + 1}.</span>
                          <div>
                            <div className="font-semibold text-white mb-0.5 text-sm">{rec.type || rec.title || 'Recommendation'}</div>
                            <div className="text-xs text-slate-300">{rec.message || rec.description || ''}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {keyRecommendations.length === 0 && (
                    <div className="text-xs text-slate-400 text-center py-4">No recommendations available</div>
                  )}
                </div>
                <button className="w-full px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-1.5">
                  <i className="fa-solid fa-eye text-xs"></i>
                  View Detailed Analysis
                </button>
              </div>

              {/* Strengths & Improvements Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <i className="fa-solid fa-star text-yellow-400 text-base"></i>
                  <h3 className="text-base font-bold text-white">Strengths & Improvements</h3>
                </div>
                <div className="space-y-3 mb-4">
                  {/* Strengths */}
                  {strengths.map((item, index) => {
                    const color = 'emerald'
                    const colorClasses = {
                      emerald: 'bg-emerald-500/20 border-emerald-500/30',
                    }
                    const textColors = {
                      emerald: 'text-emerald-400',
                    }
                    return (
                      <div key={`strength-${index}`} className={`${colorClasses[color]} border rounded-lg p-3`}>
                        <div className="flex items-start gap-2">
                          <i className={`fa-solid fa-check-circle ${textColors[color]} mt-0.5 text-xs`}></i>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-semibold text-white text-sm">{item.category || 'Strength'}</div>
                              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/50">
                                Strength
                              </span>
                            </div>
                            <div className="text-xs text-slate-300">{item.message || ''}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Improvements */}
                  {improvements.map((item, index) => {
                    const color = 'yellow'
                    const colorClasses = {
                      yellow: 'bg-yellow-500/20 border-yellow-500/30',
                    }
                    const textColors = {
                      yellow: 'text-yellow-400',
                    }
                    return (
                      <div key={`improvement-${index}`} className={`${colorClasses[color]} border rounded-lg p-3`}>
                        <div className="flex items-start gap-2">
                          <i className={`fa-solid fa-triangle-exclamation ${textColors[color]} mt-0.5 text-xs`}></i>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-semibold text-white text-sm">{item.category || 'Improvement'}</div>
                              <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/30 text-yellow-300 border border-yellow-500/50">
                                Improvement
                              </span>
                            </div>
                            <div className="text-xs text-slate-300">{item.message || ''}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {strengths.length === 0 && improvements.length === 0 && (
                    <div className="text-xs text-slate-400 text-center py-4">No strengths or improvements available</div>
                  )}
                </div>
                <button className="w-full px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-1.5">
                  <i className="fa-solid fa-play text-xs"></i>
                  Watch Analysis Highlights
                </button>
              </div>
            </div>

            {/* Skills Gap Analysis Section */}
            {skillsGap && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Skills Gap Analysis</h3>
                    <p className="text-xs text-slate-400">How your skills match with current market demands</p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-3 py-1.5">
                    <i className="fa-solid fa-check text-emerald-400 text-xs"></i>
                    <span className="text-emerald-300 font-semibold text-xs">{skillsGap.matchPercentage || 0}% Match</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-semibold text-white mb-3">Your Strong Skills</div>
                      <div className="space-y-3">
                        {strongSkills.slice(0, 4).map((skill, index) => {
                          // Determine color based on marketDemandLevel
                          const getDemandColor = (level) => {
                            switch (level) {
                              case 'very_high': return { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' }
                              case 'high': return { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' }
                              case 'medium': return { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' }
                              case 'growing': return { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' }
                              case 'emerging': return { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30' }
                              default: return { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/30' }
                            }
                          }
                          const demandColor = getDemandColor(skill.marketDemandLevel)
                          const demandLabel = skill.marketDemandLevel 
                            ? skill.marketDemandLevel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                            : 'Medium demand'
                          const abbreviation = skill.skill?.substring(0, 2).toUpperCase() || 'SK'
                          const categoryLabel = skill.skillCategory 
                            ? skill.skillCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                            : ''
                          return (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                              <div className={`w-10 h-10 rounded-full ${demandColor.bg} flex items-center justify-center border ${demandColor.border}`}>
                                <span className={`font-bold text-xs ${demandColor.text}`}>{abbreviation}</span>
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-white text-sm">{skill.skill || 'Skill'}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs px-2 py-0.5 rounded ${demandColor.bg} ${demandColor.text} border ${demandColor.border}`}>
                                    {demandLabel}
                                  </span>
                                  {categoryLabel && (
                                    <span className="text-xs text-slate-400">{categoryLabel}</span>
                                  )}
                                </div>
                                <div className={`text-xs ${demandColor.text} font-semibold mt-1`}>{skill.marketFit || 0}% Market fit</div>
                              </div>
                            </div>
                          )
                        })}
                        {strongSkills.length === 0 && (
                          <div className="text-xs text-slate-400 text-center py-4">No strong skills identified</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white mb-3">Recommended Skills to Add</div>
                      <div className="space-y-3">
                        {recommendedSkills.map((skill, index) => {
                          // Determine color based on marketDemandLevel
                          const getDemandColor = (level) => {
                            switch (level) {
                              case 'very_high': return { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' }
                              case 'high': return { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' }
                              case 'growing': return { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' }
                              case 'emerging': return { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30' }
                              case 'stable': return { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/30' }
                              default: return { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/30' }
                            }
                          }
                          const demandColor = getDemandColor(skill.marketDemandLevel)
                          const demandLabel = skill.marketDemandLevel 
                            ? skill.marketDemandLevel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                            : 'Growing demand'
                          const abbreviation = skill.skill?.substring(0, 2).toUpperCase() || 'SK'
                          const categoryLabel = skill.skillCategory 
                            ? skill.skillCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                            : ''
                          return (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                              <div className={`w-10 h-10 rounded-full ${demandColor.bg} flex items-center justify-center border ${demandColor.border}`}>
                                <span className={`font-bold text-xs ${demandColor.text}`}>{abbreviation}</span>
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-white text-sm">{skill.skill || 'Skill'}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs px-2 py-0.5 rounded ${demandColor.bg} ${demandColor.text} border ${demandColor.border}`}>
                                    {demandLabel}
                                  </span>
                                  {categoryLabel && (
                                    <span className="text-xs text-slate-400">{categoryLabel}</span>
                                  )}
                                </div>
                                <div className={`text-xs ${demandColor.text} font-semibold mt-1`}>+{skill.salaryBoost || 0}% Salary boost</div>
                              </div>
                            </div>
                          )
                        })}
                        {recommendedSkills.length === 0 && (
                          <div className="text-xs text-slate-400 text-center py-4">No recommended skills</div>
                        )}
                      </div>
                    </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Assessment
