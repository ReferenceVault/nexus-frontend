import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuth } from '../hooks/useAuth'
import { useLogout } from '../hooks/useLogout'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'
import Footer from '../components/Footer'
import SocialSidebar from '../components/SocialSidebar'
import ErrorMessage from '../components/common/ErrorMessage'
import { getCandidateMenuItems, getCandidateQuickActions } from '../utils/candidateSidebar'

const UploadVideo = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const handleLogout = useLogout('/signin')
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [uploadedVideoId, setUploadedVideoId] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [resumes, setResumes] = useState([])
  const [videos, setVideos] = useState([])
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)

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
        
        // Fetch presigned URL for current video if exists
        if (userVideos && userVideos.length > 0) {
          try {
            const presignedUrlResponse = await api.getVideoPresignedUrl(userVideos[0].id)
            setCurrentVideoUrl(presignedUrlResponse.presignedUrl)
          } catch (error) {
            console.error('Error fetching presigned URL for video:', error)
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
    setRecordedVideo(null)

    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm']
    if (!allowedTypes.includes(file.type)) {
      setError('Only MP4, MOV, and WebM video files are allowed')
      e.target.value = ''
      return
    }

    const maxSize = 50 * 1024 * 1024
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2)
    
    if (file.size > maxSize) {
      setError(`Video file is too large (${fileSizeMB} MB). Maximum file size is 50 MB.`)
      e.target.value = ''
      return
    }

    setSelectedFile(file)
    const videoUrl = URL.createObjectURL(file)
    setVideoPreview(videoUrl)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      })

      const chunks = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const videoFile = new File([blob], 'recorded-video.webm', { type: 'video/webm' })
        setRecordedVideo(videoFile)
        setSelectedFile(videoFile)
        const videoUrl = URL.createObjectURL(blob)
        setVideoPreview(videoUrl)
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setError(null)
    } catch (error) {
      console.error('Error starting recording:', error)
      setError('Failed to access camera/microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  const handleUpload = async () => {
    const videoFile = selectedFile || recordedVideo
    if (!videoFile) {
      setError('Please select or record a video to upload')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const result = await api.uploadVideo(videoFile)
      setUploadedVideoId(result.id)
      setShowSuccessModal(true)
      setSelectedFile(null)
      setRecordedVideo(null)
      setVideoPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      const userVideos = await api.getUserVideos()
      setVideos(userVideos || [])
      
      // Fetch presigned URL for the newly uploaded video
      if (userVideos && userVideos.length > 0) {
        try {
          const presignedUrlResponse = await api.getVideoPresignedUrl(userVideos[0].id)
          setCurrentVideoUrl(presignedUrlResponse.presignedUrl)
        } catch (error) {
          console.error('Error fetching presigned URL for video:', error)
        }
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to upload video'
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
          { label: 'Upload Video' }
        ]}
        title="Upload Video"
        subtitle="Update your video introduction"
      />

      <div className="flex flex-1">
        <DashboardSidebar
          title="Workspace"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeView="videos"
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
                    <i className="fa-solid fa-video text-white text-2xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">Update Your Video Introduction</h2>
                  <p className="text-sm text-neutral-600">Upload a new video or record one using your camera</p>
                </div>

                <ErrorMessage error={error} onDismiss={() => setError(null)} />

                <div className="space-y-6">
                  {videos.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Current Video
                      </label>
                      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                              <i className="fa-solid fa-video text-white"></i>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-neutral-900">
                                {videos[0].fileUrl?.split('/').pop() || 'Video.mp4'}
                              </p>
                              <p className="text-xs text-neutral-600">
                                Uploaded {new Date(videos[0].createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        </div>
                        {currentVideoUrl && (
                          <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg overflow-hidden">
                            <video
                              src={currentVideoUrl}
                              controls
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      {videos.length > 0 ? 'Upload New Video File' : 'Upload Video File'}
                    </label>
                    <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/quicktime,video/webm"
                        onChange={handleFileChange}
                        className="hidden"
                        id="video-file-input"
                        disabled={isUploading || isRecording}
                      />
                      <label
                        htmlFor="video-file-input"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <i className="fa-solid fa-cloud-arrow-up text-3xl text-indigo-500 mb-3"></i>
                        <p className="text-sm font-semibold text-neutral-700 mb-1">
                          {selectedFile ? selectedFile.name : 'Click to select or drag and drop'}
                        </p>
                        <p className="text-xs text-neutral-500">
                          MP4, MOV, or WebM (Max 50MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="text-center text-sm font-semibold text-neutral-700 mb-2">OR</div>
                    <div className="border-t border-neutral-200"></div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Record Video
                    </label>
                    <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6">
                      {videoPreview ? (
                        <div className="space-y-4">
                          <video
                            ref={videoRef}
                            src={videoPreview}
                            controls
                            className="w-full rounded-lg"
                          />
                          <button
                            onClick={() => {
                              setVideoPreview(null)
                              setSelectedFile(null)
                              setRecordedVideo(null)
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ''
                              }
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 text-sm font-semibold hover:bg-neutral-50 transition"
                          >
                            Remove Video
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          {!isRecording ? (
                            <button
                              onClick={startRecording}
                              disabled={isUploading}
                              className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition disabled:opacity-50 flex items-center gap-2 mx-auto"
                            >
                              <i className="fa-solid fa-video"></i>
                              <span>Start Recording</span>
                            </button>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex items-center justify-center gap-2 text-red-600">
                                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold">Recording...</span>
                              </div>
                              <button
                                onClick={stopRecording}
                                className="px-6 py-3 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition flex items-center gap-2 mx-auto"
                              >
                                <i className="fa-solid fa-stop"></i>
                                <span>Stop Recording</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {(selectedFile || recordedVideo) && (
                    <div className="p-3 bg-indigo-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-video text-indigo-600"></i>
                        <span className="text-sm text-neutral-700">
                          {selectedFile?.name || recordedVideo?.name || 'Video selected'}
                        </span>
                        {(selectedFile || recordedVideo) && (
                          <span className="text-xs text-neutral-500">
                            ({((selectedFile?.size || recordedVideo?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                    <button
                      onClick={() => navigate('/user-dashboard')}
                      disabled={isUploading || isRecording}
                      className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 text-sm font-semibold hover:bg-neutral-50 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={(!selectedFile && !recordedVideo) || isUploading || isRecording}
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
                          <span>Update Video</span>
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
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Video Updated Successfully!</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Your video has been updated. Would you like to start an AI assessment?
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

export default UploadVideo

