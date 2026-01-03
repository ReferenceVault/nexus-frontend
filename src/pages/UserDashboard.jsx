import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Footer from '../components/Footer'
import SocialSidebar from '../components/SocialSidebar'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'
import { api } from '../utils/api'
import { useAuth } from '../hooks/useAuth'

const UserDashboard = () => {
  const navigate = useNavigate()
  const { user, logout, updateUser, isAuthenticated, accessToken } = useAuth()
  const profileFormRef = useRef(null)
  
  const [activeView, setActiveView] = useState('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  })
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [resumes, setResumes] = useState([])
  const [videos, setVideos] = useState([])
  const [analysisRequests, setAnalysisRequests] = useState([])
  
  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''
  const userInitial = (user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && accessToken) {
        try {
          // Fetch resumes, videos, analysis requests
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
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
    }
    fetchUserData()
  }, [isAuthenticated, accessToken])

  // Fetch profile when form is shown
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (showProfileForm && isAuthenticated && accessToken) {
        try {
          setIsLoadingProfile(true)
          const userProfile = await api.getCurrentUser()
          
          setFormData({
            firstName: userProfile.firstName || '',
            lastName: userProfile.lastName || '',
            email: userProfile.email || '',
            phone: userProfile.phone || '',
            streetAddress: userProfile.addressInformation?.streetAddress || '',
            city: userProfile.addressInformation?.city || '',
            state: userProfile.addressInformation?.state || '',
            zipCode: userProfile.addressInformation?.zipCode || '',
            country: userProfile.addressInformation?.country || '',
          })
        } catch (error) {
          console.error('Error fetching user profile:', error)
        } finally {
          setIsLoadingProfile(false)
        }
      }
    }
    fetchUserProfile()
  }, [showProfileForm, isAuthenticated, accessToken])

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        addressInformation: {
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      }

      const updatedUser = await api.updateProfile(profileData)
      updateUser(updatedUser)
      setShowProfileForm(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert(error.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/30 via-white to-indigo-50/20 flex flex-col">
      <SocialSidebar position="right" />
      
      <DashboardHeader
        userName={userName}
        userEmail={userEmail}
        userInitial={userInitial}
        onProfile={() => setActiveView('profile')}
        onLogout={handleLogout}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: activeView === 'overview' ? 'Dashboard' : activeView === 'resumes' ? 'My Resumes' : activeView === 'videos' ? 'Video Introductions' : activeView === 'profile' ? 'Profile' : 'Dashboard' }
        ]}
        title={activeView === 'overview' ? '' : activeView === 'resumes' ? '' : activeView === 'videos' ? '' : activeView === 'profile' ? 'Profile' : ''}
        subtitle={activeView === 'resumes' ? '' : activeView === 'videos' ? '' : activeView === 'profile' ? 'Update your profile information' : ''}
      />

      <div className="flex flex-1">
        <DashboardSidebar
          title="Workspace"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeView={activeView}
          menuItems={[
            {
              id: 'overview',
              label: 'Overview',
              icon: 'fa-solid fa-grid-2',
              onClick: () => setActiveView('overview')
            },
            {
              id: 'resumes',
              label: 'My Resumes',
              icon: 'fa-solid fa-file-pdf',
              badge: resumes.length > 0 ? resumes.length : undefined,
              onClick: () => setActiveView('resumes')
            },
            {
              id: 'videos',
              label: 'Video Introductions',
              icon: 'fa-solid fa-video',
              badge: videos.length > 0 ? videos.length : undefined,
              onClick: () => setActiveView('videos')
            },
            {
              id: 'assessments',
              label: 'Assessments',
              icon: 'fa-solid fa-clipboard-check',
              onClick: () => navigate('/assessments')
            },
            {
              id: 'job-matches',
              label: 'Job Matches',
              icon: 'fa-solid fa-briefcase',
              onClick: () => navigate('/job-matches')
            }
          ]}
          quickFilters={[
            { label: 'Upload Resume', icon: 'fa-solid fa-upload', onClick: () => navigate('/onboarding?step=2') },
            { label: 'Upload Video', icon: 'fa-solid fa-video', onClick: () => navigate('/onboarding?step=3') },
            { label: 'Take Assessment', icon: 'fa-solid fa-clipboard-question', onClick: () => navigate('/assessments') },
            { label: 'Browse Jobs', icon: 'fa-solid fa-search', onClick: () => navigate('/job-matches') }
          ]}
          ctaSection={
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_55%)]" />
              <div className="relative flex items-start space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <i className="fa-solid fa-plus text-white text-xl"></i>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 mb-1">Get Started</h4>
                  <p className="text-xs text-neutral-600 mb-3">Complete your profile to find perfect job matches</p>
                <button
                    onClick={() => navigate('/onboarding')}
                    className="text-xs font-semibold text-primary hover:text-indigo-700 transition-colors flex items-center gap-1 group-hover:gap-2"
                  >
                    Continue Setup
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
            </>
          }
          collapsedCtaButton={{
            icon: 'fa-solid fa-plus',
            onClick: () => navigate('/onboarding'),
            title: 'Get Started'
          }}
        />

        <main className="flex-1 pr-11 lg:pr-14">
          {activeView === 'profile' ? (
            <div className="px-8 py-4">
              <div className="max-w-4xl mx-auto">
                <div className="mb-4">
                  <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mb-0.5">Profile Settings</h1>
                  <p className="text-xs text-neutral-600">Update your personal information</p>
                  </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-indigo-200/50 p-4">
                  {isLoadingProfile ? (
                    <div className="flex items-center justify-center py-12">
                      <i className="fa-solid fa-spinner fa-spin text-2xl text-primary"></i>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-semibold text-neutral-700 mb-2">Basic Information</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-1">First Name *</label>
                            <input 
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                              placeholder="John" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-1">Last Name *</label>
                            <input 
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                              placeholder="Doe" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-1">Email *</label>
                            <input 
                              type="email" 
                              name="email"
                              value={formData.email}
                              disabled
                              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-neutral-50 cursor-not-allowed" 
                              placeholder="your.email@example.com" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-1">Phone Number *</label>
                            <input 
                              type="tel" 
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                              placeholder="+1 (555) 123-4567" 
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-semibold text-neutral-700 mb-2">Address Information</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-neutral-600 mb-1">Street Address *</label>
                            <input 
                              name="streetAddress"
                              value={formData.streetAddress}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                              placeholder="123 Main Street" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-1">City *</label>
                            <input 
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                              placeholder="San Francisco" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-1">State/Province *</label>
                            <input 
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                              placeholder="California" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-1">ZIP/Postal Code *</label>
                            <input 
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                              placeholder="94102" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-1">Country *</label>
                            <select 
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="">Select country</option>
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-200">
                    <button
                          onClick={() => setActiveView('overview')}
                      disabled={isSaving}
                          className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving || isLoadingProfile}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          <span>Saving...</span>
                        </>
                      ) : (
                            'Save Changes'
                      )}
                    </button>
                  </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : activeView === 'resumes' ? (
            <div className="px-8 py-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-0.5">My Resumes</h2>
                    <p className="text-xs text-neutral-600">Manage and track your uploaded resumes</p>
                  </div>
                  <button 
                    onClick={() => navigate('/onboarding?step=2')}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2"
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                    Upload Resume
                  </button>
                </div>

                {resumes.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {resumes.map((resume, index) => (
                      <div key={resume.id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md hover:shadow-lg transition-all p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <i className="fa-solid fa-file-pdf text-white text-base"></i>
                          </div>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm text-neutral-900 mb-1">Resume #{index + 1}</h3>
                        <p className="text-xs text-neutral-600 mb-3">Uploaded {new Date(resume.createdAt).toLocaleDateString()}</p>
                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-1.5 bg-indigo-50 text-primary rounded-lg text-xs font-semibold hover:bg-indigo-100 transition">
                            View
                          </button>
                          <button className="px-3 py-1.5 border border-neutral-300 text-neutral-700 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition">
                            <i className="fa-solid fa-download text-xs"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center border border-indigo-200/50 shadow-md">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-md">
                      <i className="fa-solid fa-file-pdf text-white text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">No resumes uploaded</h3>
                    <p className="text-sm text-neutral-600 mb-4">Upload your first resume to get started</p>
                    <button 
                      onClick={() => navigate('/onboarding?step=2')}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all inline-flex items-center gap-2"
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                      Upload Resume
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : activeView === 'videos' ? (
            <div className="px-8 py-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-0.5">Video Introductions</h2>
                    <p className="text-xs text-neutral-600">Manage your video introductions</p>
                  </div>
                  <button 
                    onClick={() => navigate('/onboarding?step=3')}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2"
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                    Upload Video
                  </button>
                </div>
                
                {videos.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {videos.map((video, index) => (
                      <div key={video.id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md hover:shadow-lg transition-all overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <i className="fa-solid fa-play text-white text-2xl"></i>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-sm text-neutral-900 mb-1">Video #{index + 1}</h3>
                          <p className="text-xs text-neutral-600 mb-3">Uploaded {new Date(video.createdAt).toLocaleDateString()}</p>
                          <button className="w-full px-3 py-1.5 bg-indigo-50 text-primary rounded-lg text-xs font-semibold hover:bg-indigo-100 transition">
                            Watch Video
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center border border-indigo-200/50 shadow-md">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-md">
                      <i className="fa-solid fa-video text-white text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">No videos uploaded</h3>
                    <p className="text-sm text-neutral-600 mb-4">Upload your first video introduction</p>
                    <button 
                      onClick={() => navigate('/onboarding?step=3')}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all inline-flex items-center gap-2"
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                      Upload Video
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Overview view
            <>
              <section className="px-8 py-4">
                <div className="max-w-7xl mx-auto">
                  <div className="mb-4">
                    <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mb-1">
                      Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{userName}</span>
                    </h1>
                    <p className="text-sm text-neutral-600">Here's what's happening with your profile today</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {[
                      { icon: 'fa-solid fa-eye', value: '0', label: 'Profile Views', change: '+0%', changeColor: 'text-green-600' },
                      { icon: 'fa-solid fa-briefcase', value: '0', label: 'Job Matches', change: '+0%', changeColor: 'text-green-600' },
                      { icon: 'fa-solid fa-envelope', value: '0', label: 'Messages', change: '+0%', changeColor: 'text-green-600' },
                      { icon: 'fa-solid fa-clipboard-check', value: '0', label: 'Assessments', change: 'Pending', changeColor: 'text-primary' }
                    ].map((stat, index) => (
                      <div 
                        key={index}
                        className="relative bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-indigo-200/50 shadow-md hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                              <i className={`${stat.icon} text-white text-sm`}></i>
                            </div>
                            <span className={`text-xs font-semibold ${stat.changeColor}`}>{stat.change}</span>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-0.5">
                            {stat.value}
                          </h3>
                          <p className="text-xs text-neutral-600 font-medium">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* My Top 3 Job Matches Section */}
              <section className="px-8 py-4">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-0.5">My Top 3 Job Matches</h2>
                      <p className="text-xs text-neutral-600">Personalized opportunities based on your profile</p>
                    </div>
                    <button
                      onClick={() => navigate('/job-matches')}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
                    >
                      <i className="fa-solid fa-briefcase text-xs"></i>
                      View All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {[
                      {
                        id: 'senior-frontend-techflow',
                        title: 'Senior Frontend Developer',
                        company: 'TechFlow Inc.',
                        location: 'San Francisco, CA',
                        salary: '$95k - $130k',
                        matchScore: 96,
                        isPremium: true,
                        logo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2615db9833-1271f64869e51bf90875.png'
                      },
                      {
                        id: 'full-stack-financehub',
                        title: 'Full Stack Engineer',
                        company: 'FinanceHub',
                        location: 'New York, NY',
                        salary: '$85k - $115k',
                        matchScore: 89,
                        isPremium: false,
                        logo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/623dd88eee-8b0dcc56b705435f7025.png'
                      },
                      {
                        id: 'react-developer-healthtech',
                        title: 'React Developer',
                        company: 'HealthTech Solutions',
                        location: 'Austin, TX',
                        salary: '$75k - $105k',
                        matchScore: 84,
                        isPremium: false,
                        logo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e72528e45d-81fb3cc5e5597fae6dff.png'
                      }
                    ].map((job, index) => (
                      <div
                        key={job.id}
                        onClick={() => navigate(`/job-details/${job.id}`)}
                        className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Job Header with Logo */}
                        <div className="p-4 pb-3 relative">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-white border border-indigo-200/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                <img
                                  src={job.logo}
                                  alt={job.company}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                  }}
                                />
                                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs hidden">
                                  {job.company.charAt(0)}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-neutral-900 mb-0.5 group-hover:text-primary transition-colors line-clamp-1">
                                  {job.title}
                                </h3>
                                <p className="text-xs text-neutral-600 line-clamp-1">{job.company}</p>
                              </div>
                            </div>
                            {job.isPremium && (
                              <div className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1 flex-shrink-0 ml-2">
                                <i className="fa-solid fa-crown text-[10px]"></i>
                                <span className="text-[10px]">Premium</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Match Score Badge */}
                          <div className="flex items-center justify-between mt-2">
                            <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                              job.matchScore >= 90 
                                ? 'bg-green-100 text-green-700 border border-green-300' 
                                : job.matchScore >= 80
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-purple-100 text-purple-700 border border-purple-300'
                            }`}>
                              {job.matchScore}% Match
                  </div>
                </div>
              </div>

                        {/* Job Details */}
                        <div className="px-4 pb-4 space-y-2 relative">
                          <div className="flex items-center text-xs text-neutral-600">
                            <i className="fa-solid fa-map-marker-alt text-primary mr-1.5 text-xs"></i>
                            <span className="line-clamp-1">{job.location}</span>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-indigo-200/50">
                            <div>
                              <p className="text-[10px] text-neutral-500 mb-0.5">Salary range</p>
                              <p className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {job.salary}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/job-details/${job.id}`)
                              }}
                              className="w-7 h-7 rounded-lg border border-indigo-200 bg-white text-neutral-600 hover:text-primary hover:border-primary hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
                              title="View details"
                            >
                              <i className="fa-solid fa-eye text-xs"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="px-8 py-4">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-0.5">Quick Actions</h2>
                      <p className="text-xs text-neutral-600">Manage your Nexus profile efficiently</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { icon: 'fa-solid fa-upload', title: 'Upload Resume', description: 'Add or update your resume', onClick: () => navigate('/onboarding?step=2') },
                      { icon: 'fa-solid fa-video', title: 'Upload Video', description: 'Record your introduction video', onClick: () => navigate('/onboarding?step=3') },
                      { icon: 'fa-solid fa-briefcase', title: 'Browse Jobs', description: 'Discover job opportunities', onClick: () => navigate('/job-matches') },
                      { icon: 'fa-solid fa-user-pen', title: 'Edit Profile', description: 'Update your profile information', onClick: () => setActiveView('profile') }
                    ].map((action, index) => (
                      <button 
                        key={index}
                        onClick={action.onClick}
                        className="relative bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-indigo-200/50 text-left hover:shadow-lg transition-all duration-300 group shadow-md"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-2 shadow-md">
                            <i className={`${action.icon} text-white text-sm`}></i>
                          </div>
                          <h4 className="font-semibold text-neutral-900 mb-1 text-xs group-hover:text-primary transition-colors">{action.title}</h4>
                          <p className="text-[10px] text-neutral-600 leading-relaxed">{action.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}
      </main>
      </div>

      <Footer />
    </div>
  )
}

export default UserDashboard
