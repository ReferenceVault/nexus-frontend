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

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate('/signin', { replace: true })
      return
    }

    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        setError(null)

        let analysisData
        if (id) {
          // Fetch specific analysis by ID
          analysisData = await api.getAnalysisResults(id)
        } else {
          // Fetch latest analysis
          analysisData = await api.getLatestAnalysis()
        }

        if (!analysisData) {
          setError('No analysis found. Please complete onboarding first.')
          return
        }

        if (analysisData.status !== 'COMPLETED') {
          // Redirect to status page if not completed
          navigate(`/analysis/${analysisData.id}`, { replace: true })
          return
        }

        setAnalysis(analysisData)
      } catch (err) {
        console.error('Error fetching analysis:', err)
        setError(err.message || 'Failed to load analysis results')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [id, isAuthenticated, accessToken, navigate])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading analysis results..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white min-h-screen">
        <Header userMode activeNav="Assessments" />
        <div className="container mx-auto px-4 py-16">
          <ErrorMessage message={error} />
        </div>
        <Footer />
      </div>
    )
  }

  if (!analysis || !analysis.overallReport) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white min-h-screen">
        <Header userMode activeNav="Assessments" />
        <div className="container mx-auto px-4 py-16">
          <ErrorMessage message="Analysis results are not available yet. Please wait for the analysis to complete." />
        </div>
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

  // Get color for recommendation priority
  const getRecommendationColor = (priority, index) => {
    if (priority === 'high') return 'yellow'
    if (priority === 'medium') return 'blue'
    return 'emerald'
  }

  // Get icon for strength/improvement type
  const getStrengthIcon = (type) => {
    if (type === 'strength') return 'fa-check-circle'
    if (type === 'improvement') return 'fa-triangle-exclamation'
    return 'fa-lightbulb'
  }

  // Get color for strength/improvement type
  const getStrengthColor = (type) => {
    if (type === 'strength') return 'emerald'
    if (type === 'improvement') return 'yellow'
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
                  {keyRecommendations.slice(0, 3).map((rec, index) => {
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
                  {strengthsAndImprovements.slice(0, 3).map((item, index) => {
                    const type = item.type || (index === 0 ? 'strength' : index === 1 ? 'improvement' : 'tip')
                    const color = getStrengthColor(type)
                    const icon = getStrengthIcon(type)
                    const colorClasses = {
                      emerald: 'bg-emerald-500/20 border-emerald-500/30',
                      yellow: 'bg-yellow-500/20 border-yellow-500/30',
                      blue: 'bg-blue-500/20 border-blue-500/30',
                    }
                    const textColors = {
                      emerald: 'text-emerald-400',
                      yellow: 'text-yellow-400',
                      blue: 'text-blue-400',
                    }
                    return (
                      <div key={index} className={`${colorClasses[color]} border rounded-lg p-3`}>
                        <div className="flex items-start gap-2">
                          <i className={`fa-solid ${icon} ${textColors[color]} mt-0.5 text-xs`}></i>
                          <div>
                            <div className="font-semibold text-white mb-0.5 text-sm">{item.title || item.type || 'Item'}</div>
                            <div className="text-xs text-slate-300">{item.message || item.description || ''}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {strengthsAndImprovements.length === 0 && (
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
                      {strongSkills.slice(0, 3).map((skill, index) => {
                        const colors = ['emerald', 'blue', 'orange']
                        const color = colors[index % colors.length]
                        const colorClasses = {
                          emerald: 'bg-emerald-500/20 text-emerald-300',
                          blue: 'bg-blue-500/20 text-blue-300',
                          orange: 'bg-orange-500/20 text-orange-300',
                        }
                        const textColors = {
                          emerald: 'text-emerald-400',
                          blue: 'text-blue-400',
                          orange: 'text-orange-400',
                        }
                        const abbreviation = skill.skill?.substring(0, 2).toUpperCase() || 'SK'
                        return (
                          <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className={`w-10 h-10 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
                              <span className="font-bold text-xs">{abbreviation}</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-white text-sm">{skill.skill || 'Skill'}</div>
                              <div className="text-xs text-slate-400">{skill.demand || 'High demand skill'}</div>
                              <div className={`text-xs ${textColors[color]} font-semibold mt-1`}>{skill.marketFit || 0}% Market fit</div>
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
                      {recommendedSkills.slice(0, 3).map((skill, index) => {
                        const colors = ['purple', 'blue', 'emerald']
                        const color = colors[index % colors.length]
                        const colorClasses = {
                          purple: 'bg-purple-500/20 text-purple-300',
                          blue: 'bg-blue-500/20 text-blue-300',
                          emerald: 'bg-emerald-500/20 text-emerald-300',
                        }
                        const textColors = {
                          purple: 'text-purple-400',
                          blue: 'text-blue-400',
                          emerald: 'text-emerald-400',
                        }
                        const abbreviation = skill.skill?.substring(0, 2).toUpperCase() || 'SK'
                        return (
                          <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className={`w-10 h-10 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
                              <span className="font-bold text-xs">{abbreviation}</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-white text-sm">{skill.skill || 'Skill'}</div>
                              <div className="text-xs text-slate-400">{skill.demand || 'Growing demand'}</div>
                              <div className={`text-xs ${textColors[color]} font-semibold mt-1`}>+{skill.salaryBoost || 0}% Salary boost</div>
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
