import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ImportProfile = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('resume')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [progress, setProgress] = useState(15)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleFileUpload = (files) => {
    if (files.length > 0) {
      const fileArray = Array.from(files).map(file => ({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        type: file.type
      }))
      setUploadedFiles(fileArray)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-primary', 'bg-primary/5')
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5')
    handleFileUpload(e.dataTransfer.files)
  }

  const handleFileInputChange = (e) => {
    handleFileUpload(e.target.files)
  }

  const updateProgress = (newProgress) => {
    setProgress(newProgress)
  }

  return (
    <div className="bg-neutral-50 font-sans min-h-screen">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b border-neutral-50 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-network-wired text-white text-lg"></i>
              </div>
              <span className="ml-3 text-2xl font-bold text-neutral-900">Nexus</span>
              <span className="ml-1 text-2xl font-light text-primary">Recruitment</span>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <span className="text-neutral-900 font-medium hover:text-primary transition cursor-pointer">Dashboard</span>
              <span className="text-neutral-900 font-medium hover:text-primary transition cursor-pointer">Jobs</span>
              <span className="text-neutral-900 font-medium hover:text-primary transition cursor-pointer">Assessments</span>
              <span className="text-neutral-900 font-medium hover:text-primary transition cursor-pointer">Messages</span>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="text-neutral-900 hover:text-primary transition">
                  <i className="fa-regular fa-bell text-xl"></i>
                </button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></div>
              </div>
              <div className="flex items-center space-x-3">
                <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                <div className="hidden lg:block">
                  <div className="text-sm font-medium text-neutral-900">John Doe</div>
                  <div className="text-xs text-neutral-900/60">Candidate</div>
                </div>
                <button className="text-neutral-900 hover:text-primary transition">
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/create-profile')}>Profile Setup</span>
            <i className="fa-solid fa-chevron-right text-neutral-400"></i>
            <span className="text-neutral-900 font-medium">Import Profile Data</span>
          </div>
        </div>
      </section>

      {/* Main Import Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">Speed Up Your Profile Creation</h1>
            <p className="text-xl text-neutral-900/70 max-w-3xl mx-auto">Import your existing information from resume files or connect your professional accounts to pre-fill your profile instantly.</p>
          </div>

          {/* Import Options Tabs */}
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="bg-white rounded-xl p-2 shadow-sm border border-neutral-200">
                <div className="flex space-x-2">
                  <button 
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                      activeTab === 'resume' 
                        ? 'bg-primary text-white' 
                        : 'text-neutral-900 hover:text-primary'
                    }`}
                    onClick={() => handleTabChange('resume')}
                  >
                    <i className="fa-solid fa-file-pdf mr-2"></i>
                    Resume Upload
                  </button>
                  <button 
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                      activeTab === 'github' 
                        ? 'bg-primary text-white' 
                        : 'text-neutral-900 hover:text-primary'
                    }`}
                    onClick={() => handleTabChange('github')}
                  >
                    <i className="fa-brands fa-github mr-2"></i>
                    GitHub
                  </button>
                  <button 
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                      activeTab === 'linkedin' 
                        ? 'bg-primary text-white' 
                        : 'text-neutral-900 hover:text-primary'
                    }`}
                    onClick={() => handleTabChange('linkedin')}
                  >
                    <i className="fa-brands fa-linkedin mr-2"></i>
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Upload Tab */}
          {activeTab === 'resume' && (
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Upload Area */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-cloud-upload-alt text-primary text-3xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">Upload Your Resume</h3>
                  <p className="text-neutral-900/60">Drag and drop your resume or click to browse</p>
                </div>

                {/* Upload Zone */}
                <div 
                  className="border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center hover:border-primary hover:bg-primary/5 transition cursor-pointer"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <i className="fa-solid fa-file-upload text-4xl text-neutral-400 mb-4"></i>
                  <div className="text-lg font-medium text-neutral-900 mb-2">Drop your resume here</div>
                  <div className="text-neutral-900/60 mb-4">or click to browse files</div>
                  <div className="text-sm text-neutral-900/50">Supports PDF, DOC, DOCX (Max 10MB)</div>
                  <input 
                    type="file" 
                    id="file-input" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx" 
                    multiple 
                    onChange={handleFileInputChange}
                  />
                </div>

                {/* File List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <i className="fa-solid fa-file-pdf text-error text-xl"></i>
                          <div>
                            <div className="font-medium text-neutral-900">{file.name}</div>
                            <div className="text-sm text-neutral-900/60">{file.size}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-neutral-200 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full w-full"></div>
                          </div>
                          <button 
                            className="text-neutral-400 hover:text-error transition"
                            onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                <button className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 transition mt-6 flex items-center justify-center">
                  <i className="fa-solid fa-upload mr-3"></i>
                  Parse Resume
                </button>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start space-x-3">
                    <i className="fa-solid fa-shield-check text-success text-lg mt-0.5"></i>
                    <div>
                      <div className="font-medium text-success mb-1">Secure Processing</div>
                      <div className="text-sm text-success/80">Your resume is processed securely and deleted after parsing. We never store your original files.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview & Features */}
              <div className="space-y-6">
                {/* Parsing Preview */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
                  <h4 className="text-xl font-bold text-neutral-900 mb-6">What We Extract</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-check-circle text-success"></i>
                      <span className="text-neutral-900">Personal Information (Name, Contact)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-check-circle text-success"></i>
                      <span className="text-neutral-900">Work Experience & Positions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-check-circle text-success"></i>
                      <span className="text-neutral-900">Education & Certifications</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-check-circle text-success"></i>
                      <span className="text-neutral-900">Skills & Technologies</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-check-circle text-success"></i>
                      <span className="text-neutral-900">Projects & Achievements</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-check-circle text-success"></i>
                      <span className="text-neutral-900">Languages & Proficiency</span>
                    </div>
                  </div>
                </div>

                {/* Supported Formats */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
                  <h4 className="text-xl font-bold text-neutral-900 mb-6">Supported Formats</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-error/10 rounded-lg">
                      <i className="fa-solid fa-file-pdf text-error text-2xl mb-2"></i>
                      <div className="font-medium text-neutral-900">PDF</div>
                    </div>
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <i className="fa-solid fa-file-word text-primary text-2xl mb-2"></i>
                      <div className="font-medium text-neutral-900">DOC</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/10 rounded-lg">
                      <i className="fa-solid fa-file-word text-secondary text-2xl mb-2"></i>
                      <div className="font-medium text-neutral-900">DOCX</div>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-warning/10 rounded-2xl p-6 border border-warning/20">
                  <div className="flex items-start space-x-3">
                    <i className="fa-solid fa-lightbulb text-warning text-lg mt-1"></i>
                    <div>
                      <h5 className="font-semibold text-neutral-900 mb-2">Tips for Better Parsing</h5>
                      <ul className="text-sm text-neutral-900/70 space-y-1">
                        <li>• Use standard resume formats</li>
                        <li>• Ensure text is selectable (not scanned images)</li>
                        <li>• Include clear section headers</li>
                        <li>• List skills and technologies explicitly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GitHub Tab */}
          {activeTab === 'github' && (
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Connection Area */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-brands fa-github text-white text-3xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">Connect GitHub Account</h3>
                  <p className="text-neutral-900/60">Import your repositories, contributions, and coding activity</p>
                </div>

                {/* Connection Status */}
                <div className="mb-8">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-neutral-900">GitHub Account</span>
                    </div>
                    <span className="text-sm text-neutral-900/60">Not Connected</span>
                  </div>
                </div>

                {/* Connect Button */}
                <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition flex items-center justify-center">
                  <i className="fa-brands fa-github mr-3"></i>
                  Connect GitHub Account
                </button>

                {/* Permissions Modal Preview */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-neutral-900 mb-3">Permissions We'll Request:</h5>
                  <ul className="text-sm text-neutral-900/70 space-y-2">
                    <li className="flex items-center space-x-2">
                      <i className="fa-solid fa-check text-primary"></i>
                      <span>Read public repositories</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <i className="fa-solid fa-check text-primary"></i>
                      <span>Access contribution activity</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <i className="fa-solid fa-check text-primary"></i>
                      <span>View programming languages used</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <i className="fa-solid fa-check text-primary"></i>
                      <span>Read public profile information</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* GitHub Features */}
              <div className="space-y-6">
                {/* Data We Import */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
                  <h4 className="text-xl font-bold text-neutral-900 mb-6">What We Import from GitHub</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <i className="fa-solid fa-code-branch text-primary mt-1"></i>
                      <div>
                        <div className="font-medium text-neutral-900">Repository Highlights</div>
                        <div className="text-sm text-neutral-900/60">Popular repos, stars, forks, and descriptions</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <i className="fa-solid fa-chart-line text-secondary mt-1"></i>
                      <div>
                        <div className="font-medium text-neutral-900">Contribution Activity</div>
                        <div className="text-sm text-neutral-900/60">Commit frequency and consistency patterns</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <i className="fa-solid fa-code text-purple-600 mt-1"></i>
                      <div>
                        <div className="font-medium text-neutral-900">Programming Languages</div>
                        <div className="text-sm text-neutral-900/60">Most used languages with proficiency estimates</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <i className="fa-solid fa-users text-orange-500 mt-1"></i>
                      <div>
                        <div className="font-medium text-neutral-900">Collaboration Data</div>
                        <div className="text-sm text-neutral-900/60">Open source contributions and teamwork</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sample GitHub Profile */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
                  <h4 className="text-xl font-bold text-neutral-900 mb-6">Preview: GitHub Integration</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <i className="fa-solid fa-star text-warning"></i>
                        <span className="font-medium text-neutral-900">awesome-project</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-neutral-900/60">
                        <span>⭐ 1.2k</span>
                        <span>JavaScript</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <i className="fa-solid fa-code-fork text-secondary"></i>
                        <span className="font-medium text-neutral-900">ml-algorithms</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-neutral-900/60">
                        <span>⭐ 856</span>
                        <span>Python</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <i className="fa-solid fa-cube text-primary"></i>
                        <span className="font-medium text-neutral-900">react-components</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-neutral-900/60">
                        <span>⭐ 423</span>
                        <span>TypeScript</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LinkedIn Tab */}
          {activeTab === 'linkedin' && (
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Connection Area */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-brands fa-linkedin text-white text-3xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">Connect LinkedIn Profile</h3>
                  <p className="text-neutral-900/60">Import your professional experience and network</p>
                </div>

                {/* Connection Status */}
                <div className="mb-8">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-neutral-900">LinkedIn Profile</span>
                    </div>
                    <span className="text-sm text-neutral-900/60">Not Connected</span>
                  </div>
                </div>

                {/* Connect Button */}
                <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition flex items-center justify-center">
                  <i className="fa-brands fa-linkedin mr-3"></i>
                  Connect LinkedIn Profile
                </button>

                {/* Privacy Notice */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <i className="fa-solid fa-info-circle text-blue-600 text-lg mt-0.5"></i>
                    <div>
                      <div className="font-medium text-blue-600 mb-1">LinkedIn Integration</div>
                      <div className="text-sm text-blue-600/80">We'll only access your public profile information. Your private messages and connections remain private.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LinkedIn Features */}
              <div className="space-y-6">
                {/* Data We Import */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
                  <h4 className="text-xl font-bold text-neutral-900 mb-6">LinkedIn Profile Data</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <i className="fa-solid fa-briefcase text-blue-600 mt-1"></i>
                      <div>
                        <div className="font-medium text-neutral-900">Work Experience</div>
                        <div className="text-sm text-neutral-900/60">Job titles, companies, dates, and descriptions</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <i className="fa-solid fa-graduation-cap text-secondary mt-1"></i>
                      <div>
                        <div className="font-medium text-neutral-900">Education Background</div>
                        <div className="text-sm text-neutral-900/60">Degrees, institutions, and academic achievements</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <i className="fa-solid fa-tools text-primary mt-1"></i>
                      <div>
                        <div className="font-medium text-neutral-900">Skills & Endorsements</div>
                        <div className="text-sm text-neutral-900/60">Professional skills with peer validations</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <i className="fa-solid fa-medal text-warning mt-1"></i>
                      <div>
                        <div className="font-medium text-neutral-900">Certifications & Awards</div>
                        <div className="text-sm text-neutral-900/60">Professional certifications and recognitions</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coming Soon Features */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
                  <div className="flex items-center mb-4">
                    <i className="fa-solid fa-rocket text-purple-600 text-xl mr-3"></i>
                    <h4 className="text-xl font-bold text-neutral-900">Coming Soon</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-clock text-purple-600"></i>
                      <span className="text-neutral-900">Recommendation imports</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-clock text-purple-600"></i>
                      <span className="text-neutral-900">Project portfolio sync</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-clock text-purple-600"></i>
                      <span className="text-neutral-900">Professional network insights</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Alternative Import Methods */}
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Other Ways to Build Your Profile</h2>
            <p className="text-xl text-neutral-900/70 mb-12">Choose the method that works best for you</p>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Manual Entry */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-edit text-orange-500 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Manual Entry</h3>
                <p className="text-neutral-900/70 mb-6">Fill out your profile step by step with our guided wizard</p>
                <button 
                  className="w-full border border-orange-500 text-orange-500 py-3 rounded-xl font-medium hover:bg-orange-500 hover:text-white transition"
                  onClick={() => navigate('/create-profile')}
                >
                  Start Manual Entry
                </button>
              </div>

              {/* Import from URL */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-link text-purple-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Import from URL</h3>
                <p className="text-neutral-900/70 mb-6">Paste your online resume or portfolio URL for quick import</p>
                <button className="w-full border border-purple-600 text-purple-600 py-3 rounded-xl font-medium hover:bg-purple-600 hover:text-white transition">
                  Import from URL
                </button>
              </div>

              {/* Copy & Paste */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-clipboard text-secondary text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Copy & Paste</h3>
                <p className="text-neutral-900/70 mb-6">Copy your resume text and paste it for AI-powered parsing</p>
                <button className="w-full border border-secondary text-secondary py-3 rounded-xl font-medium hover:bg-secondary hover:text-white transition">
                  Paste Resume Text
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">Why Import Your Profile?</h2>
              <p className="text-xl text-neutral-900/70 max-w-3xl mx-auto">Save time and ensure accuracy by importing your existing professional information</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-clock text-primary"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Save 80% of Time</h3>
                    <p className="text-neutral-900/70">Complete your profile in minutes instead of hours with automated data extraction</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-target text-secondary"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Higher Accuracy</h3>
                    <p className="text-neutral-900/70">Reduce typos and ensure consistency by importing from verified sources</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-sync text-purple-600"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Stay Up-to-Date</h3>
                    <p className="text-neutral-900/70">Keep your profile current with automatic updates from connected accounts</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-chart-line text-orange-500"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Better Matching</h3>
                    <p className="text-neutral-900/70">More complete profiles lead to more accurate job matches and opportunities</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-1">
                  <img className="w-full h-80 object-cover rounded-2xl" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/4a7c8b1e2f-9d5f3c8e7a6b2c4d1e8f.png" alt="professional profile dashboard showing imported data from multiple sources, clean modern interface" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-shield-check text-success text-3xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Your Data is Safe & Secure</h2>
              <p className="text-xl text-neutral-900/70">We take your privacy seriously and follow industry best practices</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-lock text-success text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">End-to-End Encryption</h3>
                <p className="text-neutral-900/70 text-sm">All data transfers are encrypted using industry-standard SSL/TLS protocols</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-trash text-primary text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">Automatic Deletion</h3>
                <p className="text-neutral-900/70 text-sm">Uploaded files are automatically deleted after parsing completion</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-user-shield text-purple-600 text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">GDPR Compliant</h3>
                <p className="text-neutral-900/70 text-sm">Full compliance with European data protection regulations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help & Support */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">Need Help?</h2>
              <p className="text-xl text-neutral-900/70">We're here to assist you with the import process</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* FAQ */}
              <div className="bg-neutral-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-neutral-900 mb-6">Common Questions</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-neutral-900 mb-2">What file formats are supported?</h4>
                    <p className="text-sm text-neutral-900/70">We support PDF, DOC, and DOCX files up to 10MB in size.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-neutral-900 mb-2">How accurate is the parsing?</h4>
                    <p className="text-sm text-neutral-900/70">Our AI achieves 95%+ accuracy on standard resume formats. You can always review and edit before applying.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-neutral-900 mb-2">Is my data stored permanently?</h4>
                    <p className="text-sm text-neutral-900/70">No, uploaded files are deleted immediately after parsing. Only the extracted profile data is retained.</p>
                  </div>
                </div>
              </div>

              {/* Contact Support */}
              <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
                <h3 className="text-xl font-bold text-neutral-900 mb-6">Still Need Help?</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <i className="fa-solid fa-comments text-primary"></i>
                    <div>
                      <div className="font-medium text-neutral-900">Live Chat</div>
                      <div className="text-sm text-neutral-900/60">Available 24/7 for instant support</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fa-solid fa-envelope text-primary"></i>
                    <div>
                      <div className="font-medium text-neutral-900">Email Support</div>
                      <div className="text-sm text-neutral-900/60">support@nexusrecruitment.com</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fa-solid fa-book text-primary"></i>
                    <div>
                      <div className="font-medium text-neutral-900">Documentation</div>
                      <div className="text-sm text-neutral-900/60">Comprehensive guides and tutorials</div>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition mt-6">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-6 z-40">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <button 
              className="text-neutral-900 font-medium hover:text-primary transition flex items-center"
              onClick={() => navigate('/create-profile')}
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Previous Step
            </button>
            <div className="flex items-center space-x-4">
              <button className="border border-neutral-300 text-neutral-900 px-6 py-3 rounded-xl font-medium hover:bg-neutral-50 transition">
                Save & Exit
              </button>
              <button className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition flex items-center">
                Continue
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportProfile



