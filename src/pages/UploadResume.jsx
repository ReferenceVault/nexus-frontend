import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuth } from '../hooks/useAuth'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'
import Footer from '../components/Footer'
import SocialSidebar from '../components/SocialSidebar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { getCandidateMenuItems, getCandidateQuickActions } from '../utils/candidateSidebar'

const UploadResume = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [uploadedResumeId, setUploadedResumeId] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [resumes, setResumes] = useState([])
  const [videos, setVideos] = useState([])
  const [resumeDownloadUrl, setResumeDownloadUrl] = useState(null)

  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''
  const userInitial = (user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const userResumes = await api.getUserResumes()
        setResumes(userResumes || [])
        const userVideos = await api.getUserVideos()
        setVideos(userVideos || [])
        
        // Fetch presigned URL for current resume if exists
        if (userResumes && userResumes.length > 0) {
          try {
            const presignedUrlResponse = await api.getResumePresignedUrl(userResumes[0].id)
            setResumeDownloadUrl(presignedUrlResponse.presignedUrl)
          } catch (error) {
            console.error('Error fetching presigned URL for resume:', error)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setError(null)

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF and DOCX files are allowed')
      e.target.value = ''
      return
    }

    const maxSize = 5 * 1024 * 1024
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2)
    
    if (file.size > maxSize) {
      setError(`File size is too large (${fileSizeMB} MB). Maximum file size is 5 MB.`)
      e.target.value = ''
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const result = await api.uploadResume(selectedFile)
      setUploadedResumeId(result.id)
      setShowSuccessModal(true)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      const userResumes = await api.getUserResumes()
      setResumes(userResumes || [])
      
      // Fetch presigned URL for the newly uploaded resume
      if (userResumes && userResumes.length > 0) {
        try {
          const presignedUrlResponse = await api.getResumePresignedUrl(userResumes[0].id)
          setResumeDownloadUrl(presignedUrlResponse.presignedUrl)
        } catch (error) {
          console.error('Error fetching presigned URL for resume:', error)
        }
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to upload resume'
      setError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const handleStartAssessment = async () => {
    setShowSuccessModal(false)
    
    try {
      const latestResumes = await api.getUserResumes()
      const latestVideos = await api.getUserVideos()
      
      if (!latestResumes || latestResumes.length === 0) {
        setError('No resume found. Please upload a resume first.')
        return
      }
      
      if (!latestVideos || latestVideos.length === 0) {
        setError('No video found. Please upload a video first.')
        return
      }

      const resumeId = latestResumes[0].id
      const videoId = latestVideos[0].id

      const analysisRequest = await api.startAnalysis(resumeId, videoId)
      navigate(`/analysis/${analysisRequest.id}`, { replace: true })
    } catch (error) {
      const errorMessage = error.message || 'Failed to start analysis'
      setError(errorMessage)
    }
  }

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
          { label: 'Dashboard', href: '/user-dashboard' },
          { label: 'Upload Resume' }
        ]}
        title="Upload Resume"
        subtitle="Update your resume file"
      />

      <div className="flex flex-1">
        <DashboardSidebar
          title="Workspace"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeView="resumes"
          menuItems={getCandidateMenuItems({
            navigate,
            resumeCount: resumes.length,
            videoCount: videos.length,
          })}
          quickFilters={getCandidateQuickActions(navigate)}
        />

        <main className="flex-1 pr-11 lg:pr-14">
          <div className="px-8 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 shadow-md p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <i className="fa-solid fa-file-pdf text-white text-2xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">Update Your Resume</h2>
                  <p className="text-sm text-neutral-600">Upload a new resume file to replace your existing one</p>
                </div>

                <ErrorMessage error={error} onDismiss={() => setError(null)} />

                <div className="space-y-6">
                  {resumes.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Current Resume
                      </label>
                      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                              <i className="fa-solid fa-file-pdf text-white"></i>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-neutral-900">
                                {resumes[0].fileUrl?.split('/').pop() || 'Resume.pdf'}
                              </p>
                              <p className="text-xs text-neutral-600">
                                Uploaded {new Date(resumes[0].createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        </div>
                        {resumeDownloadUrl && (
                          <a
                            href={resumeDownloadUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                          >
                            <i className="fa-solid fa-download"></i>
                            <span>Download Resume</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      {resumes.length > 0 ? 'Upload New Resume File' : 'Select Resume File'}
                    </label>
                    <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-file-input"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="resume-file-input"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <i className="fa-solid fa-cloud-arrow-up text-3xl text-indigo-500 mb-3"></i>
                        <p className="text-sm font-semibold text-neutral-700 mb-1">
                          {selectedFile ? selectedFile.name : 'Click to select or drag and drop'}
                        </p>
                        <p className="text-xs text-neutral-500">
                          PDF or DOCX (Max 5MB)
                        </p>
                      </label>
                    </div>
                    {selectedFile && (
                      <div className="mt-3 p-3 bg-indigo-50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-file-pdf text-indigo-600"></i>
                          <span className="text-sm text-neutral-700">{selectedFile.name}</span>
                          <span className="text-xs text-neutral-500">
                            ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedFile(null)
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ''
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                    <button
                      onClick={() => navigate('/user-dashboard')}
                      disabled={isUploading}
                      className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 text-sm font-semibold hover:bg-neutral-50 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={!selectedFile || isUploading}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-upload"></i>
                          <span>Update Resume</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-check text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Resume Updated Successfully!</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Your resume has been updated. Would you like to start an AI assessment?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  navigate('/user-dashboard')
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 text-sm font-semibold hover:bg-neutral-50 transition"
              >
                Later
              </button>
              <button
                onClick={handleStartAssessment}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition"
              >
                Do AI Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default UploadResume

