import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import SocialSidebar from '../components/SocialSidebar'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { api } from '../utils/api'
import { useAuth } from '../hooks/useAuth'
import { useLogout } from '../hooks/useLogout'
import { getCandidateMenuItems, getCandidateQuickActions } from '../utils/candidateSidebar'

const Assessment = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { accessToken, isAuthenticated, user, updateUser } = useAuth()
  const handleLogout = useLogout('/signin')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasResume, setHasResume] = useState(false)
  const [checkingResume, setCheckingResume] = useState(true)
  const [benchmarks, setBenchmarks] = useState(null)
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

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        setCheckingResume(true)

        // Fetch resumes and videos (single call for each)
        let userResumes = []
        let userVideos = []
        
        try {
          userResumes = await api.getUserResumes()
          setResumes(userResumes || [])
        } catch (error) {
          console.error('Error fetching resumes:', error)
        }

        try {
          userVideos = await api.getUserVideos()
          setVideos(userVideos || [])
        } catch (error) {
          console.error('Error fetching videos:', error)
        }

        // Check if user has uploaded a resume (reuse data from above)
        const userHasResume = userResumes && userResumes.length > 0
        setHasResume(userHasResume)
        setCheckingResume(false)

        // If no resume, don't try to fetch analysis
        if (!userHasResume) {
          setLoading(false)
          return
        }

        // Fetch analysis
        let analysisData
        try {
          if (id) {
            analysisData = await api.getAnalysisResults(id)
          } else {
            analysisData = await api.getLatestAnalysis()
          }
        } catch (analysisErr) {
          console.log('No analysis found:', analysisErr)
          setLoading(false)
          return
        }

        if (!analysisData) {
          setLoading(false)
          return
        }

        if (analysisData.status !== 'COMPLETED') {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50/30 via-white to-indigo-50/20 flex items-center justify-center">
        <LoadingSpinner text="Loading analysis results..." />
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
            { label: 'Assessments' }
          ]}
          title="Assessments"
          subtitle="Your AI feedback results and analysis"
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

  // Show blank state if no resume or no analysis
  if (!hasResume || !analysis || !analysis.overallReport) {
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
            { label: 'Assessments' }
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

          <main className="flex-1 pr-11 lg:pr-14 flex items-center justify-center px-8 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="relative">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <i className="fa-solid fa-file-circle-question text-white text-3xl"></i>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
                  {!hasResume ? 'No Resume Uploaded Yet' : 'No Analysis Available'}
                </h1>

                <p className="text-sm text-neutral-600 mb-4 max-w-lg mx-auto">
                  {!hasResume 
                    ? "You haven't uploaded your resume yet. Complete the onboarding process to get AI-powered feedback on your resume and video introduction."
                    : "Your analysis results aren't ready yet. Complete the onboarding process to generate your personalized AI feedback."}
                </p>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 p-4 mb-4 text-left shadow-md">
                  <h2 className="text-base font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-sparkles text-primary text-sm"></i>
                    What You'll Get:
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <i className="fa-solid fa-check-circle text-green-500 mt-0.5 text-xs"></i>
                      <div>
                        <div className="text-sm text-neutral-900 font-medium">Resume Analysis</div>
                        <div className="text-xs text-neutral-600">Get detailed feedback on your resume quality, formatting, and content</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fa-solid fa-check-circle text-green-500 mt-0.5 text-xs"></i>
                      <div>
                        <div className="text-sm text-neutral-900 font-medium">Video Introduction Review</div>
                        <div className="text-xs text-neutral-600">AI-powered analysis of your presentation and communication skills</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fa-solid fa-check-circle text-green-500 mt-0.5 text-xs"></i>
                      <div>
                        <div className="text-sm text-neutral-900 font-medium">Personalized Recommendations</div>
                        <div className="text-xs text-neutral-600">Actionable tips to improve your profile and stand out to employers</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fa-solid fa-check-circle text-green-500 mt-0.5 text-xs"></i>
                      <div>
                        <div className="text-sm text-neutral-900 font-medium">Skills Gap Analysis</div>
                        <div className="text-xs text-neutral-600">Discover which skills to add to boost your market value</div>
                      </div>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => navigate('/onboarding')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
                >
                  <i className="fa-solid fa-rocket text-xs"></i>
                  <span>Start Onboarding</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>

                <p className="mt-4 text-xs text-neutral-500">
                  Takes less than 5 minutes to complete
                </p>
              </div>
            </div>
          </main>
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

  const benchmarkAverages = benchmarks?.industryAverages || {
    resumeQuality: 65,
    videoPresentation: 58,
    technicalSkills: 72,
  }
  const totalProfiles = benchmarks?.totalProfiles || 0
  const industry = benchmarks?.industry || 'Software Engineering'

  const strengths = strengthsAndImprovements.filter(item => 
    item.type === 'Strength' || item.type === 'strength'
  ).slice(0, 2)
  const improvements = strengthsAndImprovements.filter(item => 
    item.type === 'Improvement' || item.type === 'improvement'
  ).slice(0, 2)

  const getRecommendationColor = (priority, index) => {
    if (priority === 'high') return 'yellow'
    if (priority === 'medium') return 'blue'
    return 'emerald'
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
          { label: 'Assessments' }
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
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mb-0.5">Assessments</h1>
                    <p className="text-xs text-neutral-600">Your AI feedback results and analysis</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg border border-indigo-200 bg-white text-neutral-700 text-xs font-semibold hover:bg-indigo-50 transition flex items-center gap-1.5">
                      <i className="fa-solid fa-download text-xs"></i>
                      Export Report
                    </button>
                    <button className="px-3 py-1.5 rounded-lg border border-indigo-200 bg-white text-neutral-700 text-xs font-semibold hover:bg-indigo-50 transition flex items-center gap-1.5">
                      <i className="fa-solid fa-share text-xs"></i>
                      Share Results
                    </button>
                  </div>
                </div>
              </div>

              {/* Overall Analysis Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <i className="fa-solid fa-robot text-lg text-primary"></i>
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">AI Analysis Complete</h2>
                    <p className="text-xs text-neutral-600">Your profile has been thoroughly analyzed by our advanced AI system</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-3 items-center">
                  {/* Resume Quality Tile */}
                  <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <i className="fa-solid fa-file-lines text-primary text-sm"></i>
                      <div className="text-xs text-neutral-600">Resume Quality</div>
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 mb-1.5">{resumeScore}</div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: `${resumeScore}%` }}></div>
                    </div>
                  </div>
                  {/* Video Presentation Tile */}
                  <div className="bg-purple-50 rounded-lg border border-purple-200 p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <i className="fa-solid fa-video text-purple-600 text-sm"></i>
                      <div className="text-xs text-neutral-600">Video Presentation</div>
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 mb-1.5">{videoScore}</div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" style={{ width: `${videoScore}%` }}></div>
                    </div>
                  </div>
                  {/* Overall Score Circle */}
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 border-4 border-white shadow-lg flex items-center justify-center mx-auto mb-1.5">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{overallScore}</div>
                        <div className="text-[10px] text-indigo-100">Overall</div>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-600">You're in the {percentile} of candidates</div>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis Cards */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Resume Analysis Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-file-lines text-primary text-sm"></i>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900">Resume Analysis</h3>
                        <p className="text-[10px] text-neutral-500">Comprehensive document review</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{resumeScore}</div>
                      <div className="text-[10px] text-neutral-500">out of 100</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-file-text text-primary text-xs"></i>
                          <span className="text-neutral-600">Content Quality</span>
                        </div>
                        <span className="text-neutral-900 font-semibold">{resumeBreakdown.contentQuality || 0}</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                        <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: `${resumeBreakdown.contentQuality || 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-palette text-primary text-xs"></i>
                          <span className="text-neutral-600">Format & Design</span>
                        </div>
                        <span className="text-neutral-900 font-semibold">{resumeBreakdown.formatDesign || 0}</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                        <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: `${resumeBreakdown.formatDesign || 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-key text-primary text-xs"></i>
                          <span className="text-neutral-600">Keyword Optimization</span>
                        </div>
                        <span className="text-neutral-900 font-semibold">{resumeBreakdown.keywordOptimization || 0}</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                        <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: `${resumeBreakdown.keywordOptimization || 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-bullseye text-primary text-xs"></i>
                          <span className="text-neutral-600">Impact Statements</span>
                        </div>
                        <span className="text-neutral-900 font-semibold">{resumeBreakdown.impactStatements || 0}</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                        <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: `${resumeBreakdown.impactStatements || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Analysis Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-video text-primary text-sm"></i>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900">Video Analysis</h3>
                        <p className="text-[10px] text-neutral-500">Presentation & communication review</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{videoScore}</div>
                      <div className="text-[10px] text-neutral-500">out of 100</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-microphone text-primary text-xs"></i>
                          <span className="text-neutral-600">Speech Clarity</span>
                        </div>
                        <span className="text-neutral-900 font-semibold">{videoBreakdown.speechClarity || 0}</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                        <div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" style={{ width: `${videoBreakdown.speechClarity || 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-user-tie text-primary text-xs"></i>
                          <span className="text-neutral-600">Professional Presence</span>
                        </div>
                        <span className="text-neutral-900 font-semibold">{videoBreakdown.professionalPresence || 0}</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                        <div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" style={{ width: `${videoBreakdown.professionalPresence || 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-check-circle text-primary text-xs"></i>
                          <span className="text-neutral-600">Content Relevance</span>
                        </div>
                        <span className="text-neutral-900 font-semibold">{videoBreakdown.contentRelevance || 0}</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                        <div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" style={{ width: `${videoBreakdown.contentRelevance || 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-cog text-primary text-xs"></i>
                          <span className="text-neutral-600">Technical Quality</span>
                        </div>
                        <span className="text-neutral-900 font-semibold">{videoBreakdown.technicalQuality || 0}</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                        <div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" style={{ width: `${videoBreakdown.technicalQuality || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations Section */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Key Recommendations Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <i className="fa-solid fa-lightbulb text-yellow-500 text-sm"></i>
                    <h3 className="text-sm font-bold text-neutral-900">Key Recommendations</h3>
                  </div>
                  <div className="space-y-2 mb-3">
                    {keyRecommendations.slice(0, 4).map((rec, index) => {
                      const color = getRecommendationColor(rec.priority, index)
                      const colorClasses = {
                        yellow: 'bg-yellow-50 border-yellow-200',
                        blue: 'bg-blue-50 border-blue-200',
                        emerald: 'bg-emerald-50 border-emerald-200',
                      }
                      const textColors = {
                        yellow: 'text-yellow-700',
                        blue: 'text-blue-700',
                        emerald: 'text-emerald-700',
                      }
                      return (
                        <div key={index} className={`${colorClasses[color]} border rounded-lg p-3`}>
                          <div className="flex items-start gap-2">
                            <span className={`${textColors[color]} font-bold text-base`}>{index + 1}.</span>
                            <div>
                              <div className="font-semibold text-neutral-900 mb-0.5 text-sm">{rec.type || rec.title || 'Recommendation'}</div>
                              <div className="text-xs text-neutral-600">{rec.message || rec.description || ''}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {keyRecommendations.length === 0 && (
                      <div className="text-xs text-neutral-500 text-center py-4">No recommendations available</div>
                    )}
                  </div>
                  <button className="w-full px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition flex items-center justify-center gap-1.5">
                    <i className="fa-solid fa-eye text-xs"></i>
                    View Detailed Analysis
                  </button>
                </div>

                {/* Strengths & Improvements Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <i className="fa-solid fa-star text-yellow-500 text-sm"></i>
                    <h3 className="text-sm font-bold text-neutral-900">Strengths & Improvements</h3>
                  </div>
                  <div className="space-y-2 mb-3">
                    {strengths.map((item, index) => (
                      <div key={`strength-${index}`} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <i className="fa-solid fa-check-circle text-emerald-600 mt-0.5 text-xs"></i>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-semibold text-neutral-900 text-sm">{item.category || 'Strength'}</div>
                              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-300">
                                Strength
                              </span>
                            </div>
                            <div className="text-xs text-neutral-600">{item.message || ''}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {improvements.map((item, index) => (
                      <div key={`improvement-${index}`} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <i className="fa-solid fa-triangle-exclamation text-yellow-600 mt-0.5 text-xs"></i>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-semibold text-neutral-900 text-sm">{item.category || 'Improvement'}</div>
                              <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-300">
                                Improvement
                              </span>
                            </div>
                            <div className="text-xs text-neutral-600">{item.message || ''}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {strengths.length === 0 && improvements.length === 0 && (
                      <div className="text-xs text-neutral-500 text-center py-4">No strengths or improvements available</div>
                    )}
                  </div>
                  <button className="w-full px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition flex items-center justify-center gap-1.5">
                    <i className="fa-solid fa-play text-xs"></i>
                    Watch Analysis Highlights
                  </button>
                </div>
              </div>

              {/* Skills Gap Analysis Section */}
              {skillsGap && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 mb-0.5">Skills Gap Analysis</h3>
                      <p className="text-xs text-neutral-600">How your skills match with current market demands</p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-100 border border-emerald-300 rounded-lg px-2 py-1">
                      <i className="fa-solid fa-check text-emerald-600 text-xs"></i>
                      <span className="text-emerald-700 font-semibold text-xs">{skillsGap.matchPercentage || 0}% Match</span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-semibold text-neutral-900 mb-3">Your Strong Skills</div>
                        <div className="space-y-3">
                          {strongSkills.slice(0, 4).map((skill, index) => {
                            const getDemandColor = (level) => {
                              switch (level) {
                                case 'very_high': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' }
                                case 'high': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' }
                                case 'medium': return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' }
                                case 'growing': return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' }
                                case 'emerging': return { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' }
                                default: return { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-300' }
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
                              <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                                <div className={`w-10 h-10 rounded-full ${demandColor.bg} flex items-center justify-center border ${demandColor.border}`}>
                                  <span className={`font-bold text-xs ${demandColor.text}`}>{abbreviation}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-neutral-900 text-sm">{skill.skill || 'Skill'}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded ${demandColor.bg} ${demandColor.text} border ${demandColor.border}`}>
                                      {demandLabel}
                                    </span>
                                    {categoryLabel && (
                                      <span className="text-xs text-neutral-500">{categoryLabel}</span>
                                    )}
                                  </div>
                                  <div className={`text-xs ${demandColor.text} font-semibold mt-1`}>{skill.marketFit || 0}% Market fit</div>
                                </div>
                              </div>
                            )
                          })}
                          {strongSkills.length === 0 && (
                            <div className="text-xs text-neutral-500 text-center py-4">No strong skills identified</div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-neutral-900 mb-3">Recommended Skills to Add</div>
                        <div className="space-y-3">
                          {recommendedSkills.map((skill, index) => {
                            const getDemandColor = (level) => {
                              switch (level) {
                                case 'very_high': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' }
                                case 'high': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' }
                                case 'growing': return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' }
                                case 'emerging': return { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' }
                                case 'stable': return { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-300' }
                                default: return { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-300' }
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
                              <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                                <div className={`w-10 h-10 rounded-full ${demandColor.bg} flex items-center justify-center border ${demandColor.border}`}>
                                  <span className={`font-bold text-xs ${demandColor.text}`}>{abbreviation}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-neutral-900 text-sm">{skill.skill || 'Skill'}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded ${demandColor.bg} ${demandColor.text} border ${demandColor.border}`}>
                                      {demandLabel}
                                    </span>
                                    {categoryLabel && (
                                      <span className="text-xs text-neutral-500">{categoryLabel}</span>
                                    )}
                                  </div>
                                  <div className={`text-xs ${demandColor.text} font-semibold mt-1`}>+{skill.salaryBoost || 0}% Salary boost</div>
                                </div>
                              </div>
                            )
                          })}
                          {recommendedSkills.length === 0 && (
                            <div className="text-xs text-neutral-500 text-center py-4">No recommended skills</div>
                          )}
                        </div>
                      </div>
                  </div>
                </div>
              )}

              {/* Industry Benchmarking Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-base font-bold text-neutral-900 mb-0.5">Industry Benchmarking</h2>
                    <p className="text-xs text-neutral-600">See how you compare with other professionals in your field</p>
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-indigo-100 border border-indigo-300">
                    <span className="text-xs font-semibold text-indigo-700">{industry}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <i className="fa-solid fa-trophy text-emerald-600 text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-emerald-700 mb-0.5">{percentile}</div>
                        <div className="text-xs text-neutral-600">Overall Ranking</div>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-500">
                      Among {totalProfiles > 0 ? `${totalProfiles.toLocaleString()}+` : '50,000+'} profiles
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <i className="fa-solid fa-chart-line text-blue-600 text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-blue-700 mb-0.5">{skillRelevance}%</div>
                        <div className="text-xs text-neutral-600">Skill Relevance</div>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-500">
                      {skillRelevance >= benchmarkAverages.technicalSkills ? 'Above' : 'Below'} industry average
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <i className="fa-solid fa-rocket text-purple-600 text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-purple-700 mb-0.5">{profileCompleteness}%</div>
                        <div className="text-xs text-neutral-600">Profile Completeness</div>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-500">
                      {profileCompleteness >= 90 ? 'Excellent' : profileCompleteness >= 70 ? 'Good' : 'Needs improvement'} coverage
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Comparison Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4 mb-4">
                <h2 className="text-base font-bold text-neutral-900 mb-3">Performance Comparison</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-neutral-900">Resume Quality</span>
                      <span className="text-sm text-neutral-600">
                        {resumeScore} vs {benchmarkAverages.resumeQuality} (avg)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${resumeScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-neutral-900">Video Presentation</span>
                      <span className="text-sm text-neutral-600">
                        {videoScore} vs {benchmarkAverages.videoPresentation} (avg)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500"
                        style={{ width: `${videoScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-neutral-900">Technical Skills</span>
                      <span className="text-sm text-neutral-600">
                        {technicalSkillsScore} vs {benchmarkAverages.technicalSkills} (avg)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${technicalSkillsScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Insights & Hot Skills Section */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {marketInsights && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h2 className="text-base font-bold text-neutral-900 mb-0.5">Market Insights</h2>
                        <p className="text-xs text-neutral-600">Current trends and opportunities in your field</p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg border ${
                        marketInsights.marketStatus === 'Growing Market' 
                          ? 'bg-emerald-100 border-emerald-300' 
                          : marketInsights.marketStatus === 'Stable Market'
                          ? 'bg-blue-100 border-blue-300'
                          : 'bg-red-100 border-red-300'
                      }`}>
                        <span className={`text-xs font-semibold ${
                          marketInsights.marketStatus === 'Growing Market'
                            ? 'text-emerald-700'
                            : marketInsights.marketStatus === 'Stable Market'
                            ? 'text-blue-700'
                            : 'text-red-700'
                        }`}>
                          {marketInsights.marketStatus || 'Market Status'}
                        </span>
                      </div>
                    </div>

                    {marketInsights.salaryInsights && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-neutral-900 mb-3">Salary Insights</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-600">Your Expected Range</span>
                            <span className="text-emerald-600 font-semibold">
                              {marketInsights.salaryInsights.yourExpectedRange || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-600">Market Average</span>
                            <span className="text-neutral-900 font-semibold">
                              {marketInsights.salaryInsights.marketAverage || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-600">Top 10%</span>
                            <span className="text-neutral-900 font-semibold">
                              {marketInsights.salaryInsights.top10Percent || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                            <span className="text-neutral-600">Your Profile Strength</span>
                            <span className={`font-semibold ${
                              marketInsights.salaryInsights.yourProfileStrength === 'Above Average'
                                ? 'text-emerald-600'
                                : marketInsights.salaryInsights.yourProfileStrength === 'Average'
                                ? 'text-yellow-600'
                                : 'text-red-600'
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
                          <div key={index} className="text-xs text-neutral-600 bg-neutral-50 rounded-lg p-2 border border-neutral-200">
                            {point}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {hotSkillsAndTrends && hotSkillsAndTrends.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4">
                    <div className="mb-3">
                      <h2 className="text-base font-bold text-neutral-900 mb-0.5">Hot Skills & Trends</h2>
                      <p className="text-xs text-neutral-600">Skills in high demand</p>
                    </div>

                    <div className="space-y-3">
                      {hotSkillsAndTrends.map((skill, index) => (
                        <div key={index} className="bg-neutral-50 rounded-lg border border-neutral-200 p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {skill.status === 'Trending' && (
                                <i className="fa-solid fa-fire text-red-500"></i>
                              )}
                              {skill.status === 'Growing' && (
                                <i className="fa-solid fa-arrow-up text-blue-500"></i>
                              )}
                              {skill.status === 'Stable' && (
                                <i className="fa-solid fa-check-circle text-emerald-500"></i>
                              )}
                              {skill.status === 'Declining' && (
                                <i className="fa-solid fa-arrow-down text-neutral-400"></i>
                              )}
                              <h3 className="text-sm font-semibold text-neutral-900">{skill.skill || 'Skill'}</h3>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${
                              skill.status === 'Trending'
                                ? 'bg-red-100 text-red-700 border border-red-300'
                                : skill.status === 'Growing'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : skill.status === 'Stable'
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                : 'bg-neutral-100 text-neutral-700 border border-neutral-300'
                            }`}>
                              {skill.status || 'N/A'}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 mb-2">{skill.description || ''}</p>
                          {skill.demandIncrease && (
                            <div className="flex items-center gap-1 text-xs text-emerald-600">
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

              {/* Improvement Roadmap Section */}
              {improvementRoadmap && (improvementRoadmap.highPriority?.length > 0 || improvementRoadmap.mediumPriority?.length > 0 || improvementRoadmap.lowPriority?.length > 0) && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-base font-bold text-neutral-900 mb-0.5">Improvement Roadmap</h2>
                      <p className="text-xs text-neutral-600">Prioritized action items to enhance your profile</p>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-indigo-100 border border-indigo-300">
                      <span className="text-xs font-semibold text-indigo-700">2-3 weeks</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-red-600 mb-3">High Priority (Week 1)</h3>
                      <div className="space-y-3">
                        {(improvementRoadmap.highPriority || []).map((item, index) => (
                          <div key={index} className="bg-red-50 rounded-lg border border-red-200 p-3">
                            <div className="font-semibold text-neutral-900 text-sm mb-1">{item.actionTitle || 'Action Item'}</div>
                            <div className="text-xs text-neutral-600 mb-2">{item.description || ''}</div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5 text-neutral-500">
                                <i className="fa-regular fa-clock"></i>
                                <span>{item.estimatedTime || 'N/A'}</span>
                              </span>
                              {item.estimatedPoints && (
                                <span className="text-emerald-600 font-semibold">
                                  +{item.estimatedPoints} points
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        {(!improvementRoadmap.highPriority || improvementRoadmap.highPriority.length === 0) && (
                          <div className="text-xs text-neutral-500 text-center py-4">No high priority items</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-yellow-600 mb-3">Medium Priority (Week 2)</h3>
                      <div className="space-y-3">
                        {(improvementRoadmap.mediumPriority || []).map((item, index) => (
                          <div key={index} className="bg-yellow-50 rounded-lg border border-yellow-200 p-3">
                            <div className="font-semibold text-neutral-900 text-sm mb-1">{item.actionTitle || 'Action Item'}</div>
                            <div className="text-xs text-neutral-600 mb-2">{item.description || ''}</div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5 text-neutral-500">
                                <i className="fa-regular fa-clock"></i>
                                <span>{item.estimatedTime || 'N/A'}</span>
                              </span>
                              {item.estimatedPoints && (
                                <span className="text-emerald-600 font-semibold">
                                  +{item.estimatedPoints} points
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        {(!improvementRoadmap.mediumPriority || improvementRoadmap.mediumPriority.length === 0) && (
                          <div className="text-xs text-neutral-500 text-center py-4">No medium priority items</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-blue-600 mb-3">Low Priority (Week 3)</h3>
                      <div className="space-y-3">
                        {(improvementRoadmap.lowPriority || []).map((item, index) => (
                          <div key={index} className="bg-blue-50 rounded-lg border border-blue-200 p-3">
                            <div className="font-semibold text-neutral-900 text-sm mb-1">{item.actionTitle || 'Action Item'}</div>
                            <div className="text-xs text-neutral-600 mb-2">{item.description || ''}</div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5 text-neutral-500">
                                <i className="fa-regular fa-clock"></i>
                                <span>{item.estimatedTime || 'N/A'}</span>
                              </span>
                              {item.estimatedPoints && (
                                <span className="text-emerald-600 font-semibold">
                                  +{item.estimatedPoints} points
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        {(!improvementRoadmap.lowPriority || improvementRoadmap.lowPriority.length === 0) && (
                          <div className="text-xs text-neutral-500 text-center py-4">No low priority items</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ready to Level Up Banner */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl border border-indigo-300 shadow-md p-4 mb-4 relative overflow-hidden">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <i className="fa-solid fa-rocket text-white text-2xl"></i>
                  </div>
                </div>

                <div className="relative z-10 max-w-3xl">
                  <h2 className="text-xl font-bold text-white mb-1">Ready to Level Up?</h2>
                  <p className="text-white/90 mb-4 text-xs">
                    Follow our personalized roadmap to boost your profile score and land better opportunities.
                  </p>

                  <div className="space-y-2 mb-4">
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
                    <button className="bg-white text-primary border border-white/30 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition flex items-center gap-2">
                      <i className="fa-solid fa-play text-primary"></i>
                      <span>Start Improvement Plan</span>
                    </button>
                    <button className="bg-indigo-500 text-white border border-white/30 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2">
                      <i className="fa-regular fa-calendar text-white"></i>
                      <span>Schedule Coaching Call</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Assessment
