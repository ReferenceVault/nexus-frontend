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
  const [benchmarks, setBenchmarks] = useState(null)

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

        // Fetch benchmarks
        try {
          const benchmarksData = await api.getBenchmarks()
          setBenchmarks(benchmarksData)
        } catch (benchmarkErr) {
          console.error('Error fetching benchmarks:', benchmarkErr)
          // Set default benchmarks on error
          setBenchmarks({
            industryAverages: {
              resumeQuality: 65,
              videoPresentation: 58,
              technicalSkills: 72,
            },
            totalProfiles: 0,
            industry: 'Software Engineering',
          })
        }
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
  const improvementRoadmap = overallReport.improvementRoadmap || {}
  const marketInsights = overallReport.marketInsights || null
  const hotSkillsAndTrends = overallReport.hotSkillsAndTrends || []

  const overallScore = analysis.overallScore || overallReport.overallScore || 0
  const resumeScore = overallReport.resumeScore || resumeAnalysis.overallScore || 0
  const videoScore = overallReport.videoScore || videoAnalysis.overallScore || 0
  const percentile = overallReport.percentile || 'top 25%'

  const resumeBreakdown = resumeAnalysis.breakdown || {}
  const videoBreakdown = videoAnalysis.breakdown || {}

  const strongSkills = skillsGap.strongSkills || []
  const recommendedSkills = skillsGap.recommendedSkills || []

  // Calculate metrics for benchmarking
  const calculateSkillRelevance = () => {
    if (strongSkills.length === 0) return 0
    const totalMarketFit = strongSkills.reduce((sum, skill) => sum + (skill.marketFit || 0), 0)
    return Math.round(totalMarketFit / strongSkills.length)
  }

  const calculateProfileCompleteness = () => {
    let completeness = 0
    if (analysis.resumeId) completeness += 40
    if (analysis.videoId) completeness += 40
    if (strongSkills.length > 0) completeness += 10
    if (resumeAnalysis && Object.keys(resumeAnalysis).length > 0) completeness += 10
    return completeness
  }

  const calculateTechnicalSkillsScore = () => {
    if (strongSkills.length === 0) return 0
    const totalMarketFit = strongSkills.reduce((sum, skill) => sum + (skill.marketFit || 0), 0)
    return Math.round(totalMarketFit / strongSkills.length)
  }

  const skillRelevance = calculateSkillRelevance()
  const profileCompleteness = calculateProfileCompleteness()
  const technicalSkillsScore = calculateTechnicalSkillsScore()

  // Get benchmark averages (with fallbacks)
  const benchmarkAverages = benchmarks?.industryAverages || {
    resumeQuality: 65,
    videoPresentation: 58,
    technicalSkills: 72,
  }
  const totalProfiles = benchmarks?.totalProfiles || 0
  const industry = benchmarks?.industry || 'Software Engineering'

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

            {/* Industry Benchmarking Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Industry Benchmarking</h2>
                  <p className="text-xs text-slate-300">See how you compare with other professionals in your field</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                  <span className="text-xs font-semibold text-indigo-300">{industry}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Overall Ranking Card */}
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/30 flex items-center justify-center">
                      <i className="fa-solid fa-trophy text-emerald-300 text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-emerald-300 mb-0.5">{percentile}</div>
                      <div className="text-xs text-slate-300">Overall Ranking</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    Among {totalProfiles > 0 ? `${totalProfiles.toLocaleString()}+` : '50,000+'} profiles
                  </div>
                </div>

                {/* Skill Relevance Card */}
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/30 flex items-center justify-center">
                      <i className="fa-solid fa-chart-line text-blue-300 text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-blue-300 mb-0.5">{skillRelevance}%</div>
                      <div className="text-xs text-slate-300">Skill Relevance</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {skillRelevance >= benchmarkAverages.technicalSkills ? 'Above' : 'Below'} industry average
                  </div>
                </div>

                {/* Profile Completeness Card */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/30 flex items-center justify-center">
                      <i className="fa-solid fa-rocket text-purple-300 text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-purple-300 mb-0.5">{profileCompleteness}%</div>
                      <div className="text-xs text-slate-300">Profile Completeness</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {profileCompleteness >= 90 ? 'Excellent' : profileCompleteness >= 70 ? 'Good' : 'Needs improvement'} coverage
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Comparison Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-4 mb-4">
              <h2 className="text-xl font-bold text-white mb-4">Performance Comparison</h2>
              
              <div className="space-y-4">
                {/* Resume Quality */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">Resume Quality</span>
                    <span className="text-sm text-slate-300">
                      {resumeScore} vs {benchmarkAverages.resumeQuality} (avg)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${resumeScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Video Presentation */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">Video Presentation</span>
                    <span className="text-sm text-slate-300">
                      {videoScore} vs {benchmarkAverages.videoPresentation} (avg)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                      style={{ width: `${videoScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Technical Skills */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">Technical Skills</span>
                    <span className="text-sm text-slate-300">
                      {technicalSkillsScore} vs {benchmarkAverages.technicalSkills} (avg)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${technicalSkillsScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Insights & Hot Skills Section */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Market Insights */}
              {marketInsights && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Market Insights</h2>
                      <p className="text-xs text-slate-300">Current trends and opportunities in your field</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg border ${
                      marketInsights.marketStatus === 'Growing Market' 
                        ? 'bg-emerald-500/20 border-emerald-500/30' 
                        : marketInsights.marketStatus === 'Stable Market'
                        ? 'bg-blue-500/20 border-blue-500/30'
                        : 'bg-red-500/20 border-red-500/30'
                    }`}>
                      <span className={`text-xs font-semibold ${
                        marketInsights.marketStatus === 'Growing Market'
                          ? 'text-emerald-300'
                          : marketInsights.marketStatus === 'Stable Market'
                          ? 'text-blue-300'
                          : 'text-red-300'
                      }`}>
                        {marketInsights.marketStatus || 'Market Status'}
                      </span>
                    </div>
                  </div>

                  {marketInsights.salaryInsights && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-white mb-3">Salary Insights</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Your Expected Range</span>
                          <span className="text-emerald-400 font-semibold">
                            {marketInsights.salaryInsights.yourExpectedRange || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Market Average</span>
                          <span className="text-white font-semibold">
                            {marketInsights.salaryInsights.marketAverage || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Top 10%</span>
                          <span className="text-white font-semibold">
                            {marketInsights.salaryInsights.top10Percent || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                          <span className="text-slate-300">Your Profile Strength</span>
                          <span className={`font-semibold ${
                            marketInsights.salaryInsights.yourProfileStrength === 'Above Average'
                              ? 'text-emerald-400'
                              : marketInsights.salaryInsights.yourProfileStrength === 'Average'
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}>
                            {marketInsights.salaryInsights.yourProfileStrength || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {marketInsights.profileStrengthPoints && marketInsights.profileStrengthPoints.length > 0 && (
                    <div className="space-y-2">
                      {marketInsights.profileStrengthPoints.map((point, index) => (
                        <div key={index} className="text-xs text-slate-300 bg-white/5 rounded-lg p-2 border border-white/10">
                          {point}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Hot Skills & Trends */}
              {hotSkillsAndTrends && hotSkillsAndTrends.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-4">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-white mb-1">Hot Skills & Trends</h2>
                    <p className="text-xs text-slate-300">Skills in high demand</p>
                  </div>

                  <div className="space-y-3">
                    {hotSkillsAndTrends.map((skill, index) => (
                      <div key={index} className="bg-white/5 rounded-lg border border-white/10 p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {skill.status === 'Trending' && (
                              <i className="fa-solid fa-fire text-red-400"></i>
                            )}
                            {skill.status === 'Growing' && (
                              <i className="fa-solid fa-cloud text-blue-400"></i>
                            )}
                            {skill.status === 'Stable' && (
                              <i className="fa-solid fa-check-circle text-emerald-400"></i>
                            )}
                            {skill.status === 'Declining' && (
                              <i className="fa-solid fa-arrow-down text-slate-400"></i>
                            )}
                            <h3 className="text-sm font-semibold text-white">{skill.skill || 'Skill'}</h3>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            skill.status === 'Trending'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : skill.status === 'Growing'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : skill.status === 'Stable'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                          }`}>
                            {skill.status || 'N/A'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mb-2">{skill.description || ''}</p>
                        {skill.demandIncrease && (
                          <div className="flex items-center gap-1 text-xs text-emerald-400">
                            <i className="fa-solid fa-arrow-up"></i>
                            <span>+{skill.demandIncrease}% demand increase</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ready to Level Up Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl border border-purple-500/30 shadow-xl p-6 mb-4 relative overflow-hidden">
              {/* Rocket Icon on Right */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block">
                <div className="w-24 h-24 rounded-full bg-purple-300/30 flex items-center justify-center">
                  <i className="fa-solid fa-rocket text-white text-4xl"></i>
                </div>
              </div>

              <div className="relative z-10 max-w-3xl">
                <h2 className="text-3xl font-bold text-white mb-2">Ready to Level Up?</h2>
                <p className="text-white/90 mb-6 text-sm">
                  Follow our personalized roadmap to boost your profile score and land better opportunities.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-white text-sm">Detailed improvement suggestions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-white text-sm">Skill development recommendations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-white text-sm">Market-aligned career guidance</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="bg-white text-purple-600 border border-purple-600 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-50 transition flex items-center gap-2">
                    <i className="fa-solid fa-play text-purple-600"></i>
                    <span>Start Improvement Plan</span>
                  </button>
                  <button className="bg-purple-500 text-white border border-white/30 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-600 transition flex items-center gap-2">
                    <i className="fa-regular fa-calendar text-white"></i>
                    <span>Schedule Coaching Call</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Improvement Roadmap Section */}
            {improvementRoadmap && (improvementRoadmap.highPriority?.length > 0 || improvementRoadmap.mediumPriority?.length > 0 || improvementRoadmap.lowPriority?.length > 0) && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Improvement Roadmap</h2>
                    <p className="text-xs text-slate-300">Prioritized action items to enhance your profile</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                    <span className="text-xs font-semibold text-indigo-300">2-3 weeks</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* High Priority (Week 1) */}
                  <div>
                    <h3 className="text-sm font-bold text-red-400 mb-3">High Priority (Week 1)</h3>
                    <div className="space-y-3">
                      {(improvementRoadmap.highPriority || []).map((item, index) => (
                        <div key={index} className="bg-white/5 rounded-lg border border-red-500/30 p-3">
                          <div className="font-semibold text-white text-sm mb-1">{item.actionTitle || 'Action Item'}</div>
                          <div className="text-xs text-slate-300 mb-2">{item.description || ''}</div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <i className="fa-regular fa-clock"></i>
                              <span>{item.estimatedTime || 'N/A'}</span>
                            </span>
                            {item.estimatedPoints && (
                              <span className="text-emerald-400 font-semibold">
                                +{item.estimatedPoints} points
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {(!improvementRoadmap.highPriority || improvementRoadmap.highPriority.length === 0) && (
                        <div className="text-xs text-slate-400 text-center py-4">No high priority items</div>
                      )}
                    </div>
                  </div>

                  {/* Medium Priority (Week 2) */}
                  <div>
                    <h3 className="text-sm font-bold text-yellow-400 mb-3">Medium Priority (Week 2)</h3>
                    <div className="space-y-3">
                      {(improvementRoadmap.mediumPriority || []).map((item, index) => (
                        <div key={index} className="bg-white/5 rounded-lg border border-yellow-500/30 p-3">
                          <div className="font-semibold text-white text-sm mb-1">{item.actionTitle || 'Action Item'}</div>
                          <div className="text-xs text-slate-300 mb-2">{item.description || ''}</div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <i className="fa-regular fa-clock"></i>
                              <span>{item.estimatedTime || 'N/A'}</span>
                            </span>
                            {item.estimatedPoints && (
                              <span className="text-emerald-400 font-semibold">
                                +{item.estimatedPoints} points
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {(!improvementRoadmap.mediumPriority || improvementRoadmap.mediumPriority.length === 0) && (
                        <div className="text-xs text-slate-400 text-center py-4">No medium priority items</div>
                      )}
                    </div>
                  </div>

                  {/* Low Priority (Week 3) */}
                  <div>
                    <h3 className="text-sm font-bold text-blue-400 mb-3">Low Priority (Week 3)</h3>
                    <div className="space-y-3">
                      {(improvementRoadmap.lowPriority || []).map((item, index) => (
                        <div key={index} className="bg-white/5 rounded-lg border border-blue-500/30 p-3">
                          <div className="font-semibold text-white text-sm mb-1">{item.actionTitle || 'Action Item'}</div>
                          <div className="text-xs text-slate-300 mb-2">{item.description || ''}</div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <i className="fa-regular fa-clock"></i>
                              <span>{item.estimatedTime || 'N/A'}</span>
                            </span>
                            {item.estimatedPoints && (
                              <span className="text-emerald-400 font-semibold">
                                +{item.estimatedPoints} points
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {(!improvementRoadmap.lowPriority || improvementRoadmap.lowPriority.length === 0) && (
                        <div className="text-xs text-slate-400 text-center py-4">No low priority items</div>
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
