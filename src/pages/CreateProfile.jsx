import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateProfile = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [profileCompleteness, setProfileCompleteness] = useState(15)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    phoneCode: '+1',
    role: '',
    location: '',
    timezone: '',
    experience: '',
    languages: [{ language: '', proficiency: 'Native' }],
    workAuth: [],
    visaSponsorship: '',
    summary: '',
    linkedin: '',
    github: '',
    website: '',
    portfolio: ''
  })

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimeout = setTimeout(() => {
      // Simulate auto-save
      console.log('Auto-saving profile...')
    }, 1000)

    return () => clearTimeout(autoSaveTimeout)
  }, [formData])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    updateProfileStrength()
  }

  const handleLanguageChange = (index, field, value) => {
    const newLanguages = [...formData.languages]
    newLanguages[index] = { ...newLanguages[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      languages: newLanguages
    }))
    updateProfileStrength()
  }

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', proficiency: 'Native' }]
    }))
  }

  const handleWorkAuthChange = (country) => {
    setFormData(prev => ({
      ...prev,
      workAuth: prev.workAuth.includes(country)
        ? prev.workAuth.filter(c => c !== country)
        : [...prev.workAuth, country]
    }))
    updateProfileStrength()
  }

  const updateProfileStrength = () => {
    const totalFields = 15 // Adjust based on actual form fields
    let filledFields = 0

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'languages') {
        filledFields += value.filter(lang => lang.language).length
      } else if (key === 'workAuth') {
        filledFields += value.length
      } else if (value && value.toString().trim() !== '') {
        filledFields++
      }
    })

    const completeness = Math.round((filledFields / totalFields) * 100)
    setProfileCompleteness(completeness)
  }

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Show success modal or redirect
      navigate('/')
    }
  }

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const saveAndExit = () => {
    // Simulate save and redirect
    navigate('/')
  }

  const handleImport = (type) => {
    if (type === 'resume') {
      // Simulate file upload
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = '.pdf,.doc,.docx'
      fileInput.click()
    } else {
      alert(`${type} import will open in a new window for authentication.`)
    }
  }

  return (
    <div className="bg-neutral-50 font-sans min-h-screen">
      {/* Header Navigation */}
      <header id="header" className="bg-white shadow-sm border-b border-neutral-50 sticky top-0 z-40">
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

            {/* Progress Indicator */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-sm text-neutral-900/60">Step {currentStep} of 6</div>
              <div className="w-48 bg-neutral-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-neutral-900/60 hover:text-neutral-900 transition">
                <i className="fa-solid fa-question-circle text-lg mr-2"></i>
                Help
              </button>
              <button 
                className="text-neutral-900 font-medium hover:text-primary transition"
                onClick={saveAndExit}
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="min-h-screen flex">
        {/* Main Form Content */}
        <div className="flex-1 max-w-4xl mx-auto px-6 py-12">
          {/* Step Navigation */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        step <= currentStep 
                          ? 'bg-primary text-white' 
                          : 'bg-neutral-200 text-neutral-600'
                      }`}>
                        {step}
                      </div>
                      <span className={`ml-3 ${
                        step <= currentStep 
                          ? 'font-semibold text-neutral-900' 
                          : 'text-neutral-600'
                      }`}>
                        {step === 1 && 'About You'}
                        {step === 2 && 'Skills Matrix'}
                        {step === 3 && 'Experience'}
                        {step === 4 && 'Preferences'}
                        {step === 5 && 'Privacy'}
                        {step === 6 && 'Review'}
                      </span>
                    </div>
                    {step < 6 && <div className="w-12 h-0.5 bg-neutral-200"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Step 1: About You */}
          {currentStep === 1 && (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-neutral-900 mb-4">Tell us about yourself</h1>
                <p className="text-xl text-neutral-900/70 max-w-2xl mx-auto">Let's start with the basics. This information helps us create personalized matches for you.</p>
              </div>

              {/* Import Options */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">Quick Import</h3>
                  <p className="text-neutral-900/70">Save time by importing your information from existing profiles</p>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                  <button 
                    className="flex items-center justify-center p-6 border-2 border-neutral-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                    onClick={() => handleImport('LinkedIn')}
                  >
                    <i className="fa-brands fa-linkedin text-2xl text-blue-600 mr-4 group-hover:scale-110 transition-transform"></i>
                    <div className="text-left">
                      <div className="font-semibold text-neutral-900">Import from LinkedIn</div>
                      <div className="text-sm text-neutral-900/60">Work experience & skills</div>
                    </div>
                  </button>
                  <button 
                    className="flex items-center justify-center p-6 border-2 border-neutral-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                    onClick={() => handleImport('GitHub')}
                  >
                    <i className="fa-brands fa-github text-2xl text-neutral-900 mr-4 group-hover:scale-110 transition-transform"></i>
                    <div className="text-left">
                      <div className="font-semibold text-neutral-900">Connect GitHub</div>
                      <div className="text-sm text-neutral-900/60">Projects & contributions</div>
                    </div>
                  </button>
                  <button 
                    className="flex items-center justify-center p-6 border-2 border-dashed border-neutral-300 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                    onClick={() => handleImport('resume')}
                  >
                    <i className="fa-solid fa-file-upload text-2xl text-neutral-600 mr-4 group-hover:scale-110 transition-transform"></i>
                    <div className="text-left">
                      <div className="font-semibold text-neutral-900">Upload Resume</div>
                      <div className="text-sm text-neutral-900/60">PDF, DOC up to 10MB</div>
                    </div>
                  </button>
                </div>
                <div className="text-center mt-6">
                  <button 
                    className="text-primary font-medium hover:underline"
                    onClick={() => navigate('/import-profile')}
                  >
                    Or fill manually below
                  </button>
                </div>
              </div>

              {/* Basic Information Form */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
                <h3 className="text-2xl font-bold text-neutral-900 mb-8">Basic Information</h3>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Full Name *</label>
                      <input 
                        type="text" 
                        placeholder="Enter your full name" 
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                      />
                      <p className="text-sm text-neutral-900/60 mt-1">This will be visible to employers</p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Email Address *</label>
                      <input 
                        type="email" 
                        placeholder="your.email@example.com" 
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                      <p className="text-sm text-neutral-900/60 mt-1">We'll use this to contact you about opportunities</p>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Phone Number</label>
                      <div className="flex">
                        <select 
                          className="px-3 py-3 border border-neutral-200 border-r-0 rounded-l-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                          value={formData.phoneCode}
                          onChange={(e) => handleInputChange('phoneCode', e.target.value)}
                        >
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+91">+91</option>
                          <option value="+49">+49</option>
                          <option value="+33">+33</option>
                        </select>
                        <input 
                          type="tel" 
                          placeholder="(555) 123-4567" 
                          className="flex-1 px-4 py-3 border border-neutral-200 rounded-r-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Professional Title */}
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Current/Desired Role *</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Senior Software Engineer" 
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        required
                      />
                      <p className="text-sm text-neutral-900/60 mt-1">What role are you looking for?</p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Location */}
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Current Location *</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="City, Country" 
                          className="w-full px-4 py-3 pr-12 border border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          required
                        />
                        <i className="fa-solid fa-map-marker-alt absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
                      </div>
                    </div>

                    {/* Timezone */}
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Timezone</label>
                      <select 
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                        value={formData.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                      >
                        <option value="">Select your timezone</option>
                        <option value="UTC-8">UTC-8 (PST)</option>
                        <option value="UTC-5">UTC-5 (EST)</option>
                        <option value="UTC+0">UTC+0 (GMT)</option>
                        <option value="UTC+1">UTC+1 (CET)</option>
                        <option value="UTC+5:30">UTC+5:30 (IST)</option>
                      </select>
                    </div>

                    {/* Years of Experience */}
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Years of Experience *</label>
                      <select 
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white" 
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        required
                      >
                        <option value="">Select experience level</option>
                        <option value="0-1">0-1 years (Entry Level)</option>
                        <option value="2-3">2-3 years (Junior)</option>
                        <option value="4-6">4-6 years (Mid-Level)</option>
                        <option value="7-10">7-10 years (Senior)</option>
                        <option value="10+">10+ years (Expert/Lead)</option>
                      </select>
                    </div>

                    {/* Languages */}
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Languages Spoken</label>
                      <div className="space-y-3">
                        {formData.languages.map((lang, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input 
                              type="text" 
                              placeholder="Language" 
                              className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                              value={lang.language}
                              onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                            />
                            <select 
                              className="px-3 py-3 border border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                              value={lang.proficiency}
                              onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                            >
                              <option value="Native">Native</option>
                              <option value="Fluent">Fluent</option>
                              <option value="Conversational">Conversational</option>
                              <option value="Basic">Basic</option>
                            </select>
                          </div>
                        ))}
                        <button 
                          className="text-primary font-medium hover:underline flex items-center"
                          onClick={addLanguage}
                        >
                          <i className="fa-solid fa-plus mr-2"></i>
                          Add another language
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Authorization */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
                <h3 className="text-2xl font-bold text-neutral-900 mb-6">Work Authorization</h3>
                <p className="text-neutral-900/70 mb-8">Help us match you with opportunities where you can legally work</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-4">Where are you authorized to work? *</label>
                    <div className="grid lg:grid-cols-2 gap-4">
                      {['United States', 'European Union', 'Canada', 'United Kingdom'].map((country) => (
                        <label key={country} className="flex items-center p-4 border border-neutral-200 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                          <input 
                            type="checkbox" 
                            className="mr-3 text-primary focus:ring-primary"
                            checked={formData.workAuth.includes(country)}
                            onChange={() => handleWorkAuthChange(country)}
                          />
                          <div>
                            <div className="font-medium text-neutral-900">{country}</div>
                            <div className="text-sm text-neutral-900/60">
                              {country === 'United States' && 'US Citizen or Green Card'}
                              {country === 'European Union' && 'EU Citizen or work permit'}
                              {country === 'Canada' && 'Canadian Citizen or PR'}
                              {country === 'United Kingdom' && 'Right to work in UK'}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-4">Are you open to visa sponsorship?</label>
                    <div className="flex space-x-6">
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name="visa-sponsorship" 
                          className="mr-3 text-primary focus:ring-primary"
                          value="yes"
                          checked={formData.visaSponsorship === 'yes'}
                          onChange={(e) => handleInputChange('visaSponsorship', e.target.value)}
                        />
                        <span className="text-neutral-900">Yes, I need sponsorship</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name="visa-sponsorship" 
                          className="mr-3 text-primary focus:ring-primary"
                          value="no"
                          checked={formData.visaSponsorship === 'no'}
                          onChange={(e) => handleInputChange('visaSponsorship', e.target.value)}
                        />
                        <span className="text-neutral-900">No sponsorship needed</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
                <h3 className="text-2xl font-bold text-neutral-900 mb-6">Professional Summary</h3>
                <p className="text-neutral-900/70 mb-8">Write a brief summary that highlights your key strengths and career goals</p>
                
                <div className="space-y-4">
                  <textarea 
                    placeholder="Tell us about your professional background, key achievements, and what you're looking for in your next role..." 
                    rows="6" 
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    value={formData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                  />
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-neutral-900/60">
                      <i className="fa-solid fa-lightbulb mr-2 text-warning"></i>
                      Tip: Mention your top skills, experience level, and career aspirations
                    </div>
                    <div className={`text-neutral-900/60 ${formData.summary.length > 450 ? 'text-warning' : ''}`}>
                      {formData.summary.length}/500 characters
                    </div>
                  </div>
                </div>

                {/* Example */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-neutral-900 mb-2">Example:</h4>
                  <p className="text-sm text-neutral-900/80">"Passionate full-stack developer with 5 years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. Looking for a senior role where I can lead technical initiatives and mentor junior developers while working on innovative products that impact millions of users."</p>
                </div>
              </div>

              {/* Portfolio Links */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
                <h3 className="text-2xl font-bold text-neutral-900 mb-6">Portfolio & Links</h3>
                <p className="text-neutral-900/70 mb-8">Showcase your work with links to your professional profiles and portfolio</p>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">LinkedIn Profile</label>
                    <div className="relative">
                      <i className="fa-brands fa-linkedin absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600"></i>
                      <input 
                        type="url" 
                        placeholder="https://linkedin.com/in/yourprofile" 
                        className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={formData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">GitHub Profile</label>
                    <div className="relative">
                      <i className="fa-brands fa-github absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-900"></i>
                      <input 
                        type="url" 
                        placeholder="https://github.com/yourusername" 
                        className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={formData.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">Personal Website</label>
                    <div className="relative">
                      <i className="fa-solid fa-globe absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-600"></i>
                      <input 
                        type="url" 
                        placeholder="https://yourwebsite.com" 
                        className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">Portfolio URL</label>
                    <div className="relative">
                      <i className="fa-solid fa-briefcase absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-600"></i>
                      <input 
                        type="url" 
                        placeholder="https://yourportfolio.com" 
                        className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={formData.portfolio}
                        onChange={(e) => handleInputChange('portfolio', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="text-primary font-medium hover:underline flex items-center">
                    <i className="fa-solid fa-plus mr-2"></i>
                    Add another link
                  </button>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8">
                <button 
                  className="px-8 py-3 border border-neutral-200 text-neutral-900 rounded-lg font-medium hover:bg-neutral-50 transition-all flex items-center"
                  onClick={() => navigate('/')}
                >
                  <i className="fa-solid fa-arrow-left mr-2"></i>
                  Back
                </button>
                <button 
                  className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-all flex items-center"
                  onClick={nextStep}
                >
                  Continue to Skills
                  <i className="fa-solid fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          )}

          {/* Other steps would go here */}
          {currentStep > 1 && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Step {currentStep} - Coming Soon</h2>
              <p className="text-neutral-900/70 mb-8">This step is under development</p>
              <div className="flex justify-center space-x-4">
                <button 
                  className="px-6 py-3 border border-neutral-200 text-neutral-900 rounded-lg font-medium hover:bg-neutral-50 transition-all"
                  onClick={previousStep}
                >
                  Previous
                </button>
                <button 
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-all"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Strength Meter */}
        <div className="w-80 bg-white border-l border-neutral-200 p-6 sticky top-0 h-screen overflow-y-auto">
          {/* Profile Strength Card */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-900">Profile Strength</h3>
              <div className="text-2xl font-bold text-primary">{profileCompleteness}%</div>
            </div>
            
            {/* Progress Ring */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="#E5E7EB" strokeWidth="8" fill="none"></circle>
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  stroke="#146EF5" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (profileCompleteness / 100) * 283}
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{profileCompleteness}%</span>
              </div>
            </div>
            
            <p className="text-sm text-neutral-900/70 text-center">Complete your profile to increase visibility to employers</p>
          </div>

          {/* Completion Checklist */}
          <div className="space-y-4 mb-8">
            <h4 className="font-semibold text-neutral-900 mb-4">Profile Completion</h4>
            
            <div className="flex items-center p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <i className="fa-solid fa-clock text-primary mr-3"></i>
              <div className="flex-1">
                <div className="text-sm font-medium text-neutral-900">Basic Information</div>
                <div className="text-xs text-neutral-900/60">In Progress</div>
              </div>
            </div>
            
            {[2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center p-3 bg-neutral-50 border border-neutral-200 rounded-lg opacity-60">
                <i className="fa-solid fa-circle text-neutral-400 mr-3"></i>
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900">
                    {step === 2 && 'Skills & Technologies'}
                    {step === 3 && 'Work Experience'}
                    {step === 4 && 'Job Preferences'}
                    {step === 5 && 'Privacy Settings'}
                    {step === 6 && 'Review & Submit'}
                  </div>
                  <div className="text-xs text-neutral-900/60">Not Started</div>
                </div>
              </div>
            ))}
          </div>

          {/* Missing Items */}
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-6 mb-8">
            <h4 className="font-semibold text-neutral-900 mb-4 flex items-center">
              <i className="fa-solid fa-exclamation-triangle text-warning mr-2"></i>
              Missing Items
            </h4>
            <ul className="space-y-2 text-sm">
              {!formData.summary && (
                <li className="flex items-center text-neutral-900/80">
                  <i className="fa-solid fa-minus text-warning mr-2"></i>
                  Add professional summary
                </li>
              )}
              {formData.workAuth.length === 0 && (
                <li className="flex items-center text-neutral-900/80">
                  <i className="fa-solid fa-minus text-warning mr-2"></i>
                  Complete work authorization
                </li>
              )}
              {!formData.linkedin && !formData.github && (
                <li className="flex items-center text-neutral-900/80">
                  <i className="fa-solid fa-minus text-warning mr-2"></i>
                  Add portfolio links
                </li>
              )}
            </ul>
          </div>

          {/* Tips Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <h4 className="font-semibold text-neutral-900 mb-4 flex items-center">
              <i className="fa-solid fa-lightbulb text-blue-600 mr-2"></i>
              Profile Tips
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <i className="fa-solid fa-check-circle text-success mr-2 mt-0.5 flex-shrink-0"></i>
                <span className="text-neutral-900/80">Use a professional photo to increase profile views by 40%</span>
              </div>
              <div className="flex items-start">
                <i className="fa-solid fa-check-circle text-success mr-2 mt-0.5 flex-shrink-0"></i>
                <span className="text-neutral-900/80">Add specific skills and certifications</span>
              </div>
              <div className="flex items-start">
                <i className="fa-solid fa-check-circle text-success mr-2 mt-0.5 flex-shrink-0"></i>
                <span className="text-neutral-900/80">Include links to your best work samples</span>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="border border-neutral-200 rounded-2xl p-6">
            <h4 className="font-semibold text-neutral-900 mb-4">Need Help?</h4>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-neutral-50 rounded-lg transition-all flex items-center">
                <i className="fa-solid fa-question-circle text-primary mr-3"></i>
                <span className="text-sm text-neutral-900">Profile FAQ</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-neutral-50 rounded-lg transition-all flex items-center">
                <i className="fa-solid fa-video text-primary mr-3"></i>
                <span className="text-sm text-neutral-900">Watch Tutorial</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-neutral-50 rounded-lg transition-all flex items-center">
                <i className="fa-solid fa-comments text-primary mr-3"></i>
                <span className="text-sm text-neutral-900">Chat with Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="fixed bottom-6 left-6 bg-white rounded-lg shadow-lg border border-neutral-200 px-4 py-2 flex items-center opacity-0 transition-opacity">
        <i className="fa-solid fa-check-circle text-success mr-2"></i>
        <span className="text-sm text-neutral-900">Changes saved automatically</span>
      </div>
    </div>
  )
}

export default CreateProfile
