import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const JobDetails = () => {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [isJobSaved, setIsJobSaved] = useState(false)

  // Sample job data - in real app, this would come from API
  const jobData = {
    id: 'senior-ux-designer-techflow',
    title: 'Senior UX Designer',
    company: 'TechFlow Inc',
    location: 'San Francisco, CA (Remote OK)',
    posted: '2 days ago',
    companyType: 'Series C',
    salary: '$120k - $160k',
    workType: 'Full-time',
    matchScore: 95,
    isPremium: true,
    description: `We're looking for a Senior UX Designer to join our product team and help shape the future of our enterprise SaaS platform. You'll work closely with product managers, engineers, and stakeholders to create intuitive, user-centered designs that solve complex business problems.

As a Senior UX Designer at TechFlow, you'll have the opportunity to work on cutting-edge products that serve millions of users worldwide. You'll be responsible for the entire design process, from user research and wireframing to prototyping and usability testing.`,
    requirements: {
      required: [
        '5+ years of experience in UX/UI design for web and mobile applications',
        'Strong portfolio demonstrating user-centered design process and outcomes',
        'Proficiency in Figma, Sketch, Adobe Creative Suite, and prototyping tools',
        'Experience with user research methodologies and usability testing',
        'Bachelor\'s degree in Design, HCI, Psychology, or related field'
      ],
      preferred: [
        'Experience designing enterprise SaaS products or B2B applications',
        'Knowledge of front-end technologies (HTML, CSS, JavaScript)',
        'Experience with design systems and component libraries',
        'Background in accessibility and inclusive design practices'
      ]
    },
    responsibilities: [
      'Lead end-to-end design processes for complex product features and workflows',
      'Conduct user research, interviews, and usability testing to inform design decisions',
      'Create wireframes, prototypes, and high-fidelity designs using Figma and other tools',
      'Collaborate with engineering teams to ensure design implementation quality',
      'Maintain and evolve our design system and component library',
      'Mentor junior designers and contribute to design culture and processes'
    ],
    benefits: [
      { icon: 'fa-heart', title: 'Health & Wellness', description: 'Premium health, dental, vision insurance' },
      { icon: 'fa-piggy-bank', title: 'Financial Benefits', description: '401(k) with company matching, stock options' },
      { icon: 'fa-calendar-days', title: 'Time Off', description: 'Unlimited PTO, sabbatical program' },
      { icon: 'fa-graduation-cap', title: 'Learning & Growth', description: '$3k annual learning budget, conferences' },
      { icon: 'fa-home', title: 'Remote Work', description: '$1k home office setup, flexible hours' },
      { icon: 'fa-users', title: 'Team Culture', description: 'Team retreats, social events, wellness programs' }
    ],
    skillsMatch: [
      { skill: 'User Experience Design', level: 'Expert', percentage: 95 },
      { skill: 'Figma & Design Tools', level: 'Expert', percentage: 90 },
      { skill: 'User Research', level: 'Advanced', percentage: 85 },
      { skill: 'Prototyping', level: 'Expert', percentage: 92 }
    ],
    applicationProcess: [
      { step: 1, title: 'Submit Application', description: 'Submit your profile and portfolio for initial review', duration: '~1 day' },
      { step: 2, title: 'Design Challenge', description: 'Complete a take-home design exercise (3-5 hours)', duration: '~3 days' },
      { step: 3, title: 'Portfolio Review', description: 'Present your design challenge and discuss your portfolio', duration: '~1 hour' },
      { step: 4, title: 'Team Interview', description: 'Meet the team and discuss collaboration & culture fit', duration: '~45 mins' },
      { step: 5, title: 'Final Decision', description: 'Reference check and offer discussion', duration: '~2 days' }
    ],
    companyInfo: {
      name: 'TechFlow Inc',
      employees: '500-1000 employees',
      industry: 'Enterprise Software',
      founded: '2018',
      headquarters: 'San Francisco, CA',
      funding: 'Series C',
      description: 'TechFlow is a leading enterprise software company specializing in workflow automation and business intelligence solutions. We serve over 10,000 companies worldwide.'
    },
    jobStats: {
      applications: 23,
      views: 147,
      responseRate: '85%',
      avgResponseTime: '2 days'
    },
    similarJobs: [
      { company: 'Netflix', title: 'Product Designer', salary: '$110k - $150k', location: 'Los Angeles, CA (Remote OK)', match: 92 },
      { company: 'Spotify', title: 'UX Designer', salary: '$105k - $140k', location: 'New York, NY (Hybrid)', match: 88 },
      { company: 'Dropbox', title: 'Senior UX Designer', salary: '$125k - $165k', location: 'San Francisco, CA (Remote OK)', match: 90 }
    ]
  }

  const openApplicationModal = () => {
    setIsApplicationModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeApplicationModal = () => {
    setIsApplicationModalOpen(false)
    document.body.style.overflow = 'auto'
  }

  const toggleSaveJob = () => {
    setIsJobSaved(!isJobSaved)
  }

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'Expert': return 'text-success'
      case 'Advanced': return 'text-warning'
      default: return 'text-neutral-600'
    }
  }

  const getSkillBarColor = (level) => {
    switch (level) {
      case 'Expert': return 'bg-success'
      case 'Advanced': return 'bg-warning'
      default: return 'bg-neutral-400'
    }
  }

  return (
    <div className="bg-white font-sans min-h-screen">
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
              <div className="relative group">
                <button className="flex items-center text-neutral-900 font-medium hover:text-primary transition">
                  For Candidates
                  <i className="fa-solid fa-chevron-down ml-2 text-sm"></i>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-50 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <span 
                    className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer"
                    onClick={() => navigate('/job-matches')}
                  >
                    Browse Jobs
                  </span>
                  <span className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer">Take Assessment</span>
                  <span className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer">Career Resources</span>
                  <span className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer">Relocation Guide</span>
                </div>
              </div>
              <div className="relative group">
                <button className="flex items-center text-neutral-900 font-medium hover:text-primary transition">
                  For Employers
                  <i className="fa-solid fa-chevron-down ml-2 text-sm"></i>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-50 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <span
                    className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer"
                    onClick={() => navigate('/employer-signin')}
                  >
                    Post Jobs
                  </span>
                  <span className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer">Talent Pool</span>
                  <span className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer">Assessment Tools</span>
                  <span className="block px-6 py-3 text-neutral-900 hover:bg-neutral-50 hover:text-primary transition cursor-pointer">Enterprise</span>
                </div>
              </div>
              <span className="text-neutral-900 font-medium hover:text-primary transition cursor-pointer">Resources</span>
              <span className="text-neutral-900 font-medium hover:text-primary transition cursor-pointer">About</span>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <button className="text-neutral-900 p-2 rounded-full hover:bg-neutral-50 transition">
                  <i className="fa-solid fa-search text-lg"></i>
                </button>
                <button className="text-neutral-900 p-2 rounded-full hover:bg-neutral-50 transition">
                  <i className="fa-solid fa-bell text-lg"></i>
                </button>
                <button className="text-neutral-900 p-2 rounded-full hover:bg-neutral-50 transition">
                  <i className="fa-solid fa-bookmark text-lg"></i>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg" alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                <div className="hidden lg:block">
                  <div className="text-sm font-medium text-neutral-900">Sarah Chen</div>
                  <div className="text-xs text-neutral-900/60">Candidate</div>
                </div>
              </div>
              <button className="lg:hidden text-neutral-900">
                <i className="fa-solid fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <span 
              className="text-primary hover:text-blue-600 cursor-pointer"
              onClick={() => navigate('/job-matches')}
            >
              Jobs
            </span>
            <i className="fa-solid fa-chevron-right text-neutral-400 text-xs"></i>
            <span className="text-primary hover:text-blue-600 cursor-pointer">Technology</span>
            <i className="fa-solid fa-chevron-right text-neutral-400 text-xs"></i>
            <span className="text-primary hover:text-blue-600 cursor-pointer">Design</span>
            <i className="fa-solid fa-chevron-right text-neutral-400 text-xs"></i>
            <span className="text-neutral-900 font-medium">{jobData.title}</span>
          </nav>
        </div>
      </div>

      {/* Job Header Section */}
      <section className="bg-white py-8 border-b border-neutral-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Job Info */}
            <div className="flex-1">
              <div className="flex items-start space-x-6">
                {/* Company Logo */}
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">TF</span>
                </div>
                
                {/* Job Details */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                      <i className="fa-solid fa-circle text-xs mr-2"></i>
                      Actively Hiring
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      Remote Friendly
                    </span>
                    <span className="bg-warning/10 text-warning px-3 py-1 rounded-full text-sm font-medium">
                      Visa Sponsor
                    </span>
                  </div>
                  
                  <h1 className="text-4xl font-bold text-neutral-900 mb-3">{jobData.title}</h1>
                  
                  <div className="flex items-center space-x-6 text-neutral-900/70 mb-4">
                    <div className="flex items-center">
                      <i className="fa-solid fa-building mr-2 text-primary"></i>
                      <span className="font-medium">{jobData.company}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fa-solid fa-map-marker-alt mr-2 text-primary"></i>
                      <span>{jobData.location}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fa-solid fa-clock mr-2 text-primary"></i>
                      <span>{jobData.workType}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fa-solid fa-calendar mr-2 text-primary"></i>
                      <span>Posted {jobData.posted}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-neutral-900">{jobData.salary}</span>
                      <span className="text-neutral-900/60 ml-2">per year</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex text-warning">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <span className="text-neutral-900/70 text-sm">(4.9/5 company rating)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-success/10 text-success px-4 py-2 rounded-lg text-sm font-medium">
                      <i className="fa-solid fa-check-circle mr-2"></i>
                      {jobData.matchScore}% Match Score
                    </div>
                    <div className="text-neutral-900/60 text-sm">
                      <i className="fa-solid fa-eye mr-2"></i>
                      {jobData.jobStats.views} views • {jobData.jobStats.applications} applications
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 lg:w-64">
              <button 
                className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 transition flex items-center justify-center"
                onClick={openApplicationModal}
              >
                <i className="fa-solid fa-paper-plane mr-3"></i>
                Apply Now
              </button>
              <div className="flex space-x-3">
                <button 
                  className={`flex-1 border-2 px-6 py-3 rounded-xl font-medium transition flex items-center justify-center ${
                    isJobSaved 
                      ? 'bg-primary text-white border-primary' 
                      : 'border-neutral-200 text-neutral-900 hover:bg-neutral-50'
                  }`}
                  onClick={toggleSaveJob}
                >
                  <i className={`fa-solid fa-bookmark mr-2 ${isJobSaved ? 'text-white' : ''}`}></i>
                  {isJobSaved ? 'Saved' : 'Save Job'}
                </button>
                <button className="flex-1 border-2 border-neutral-200 text-neutral-900 px-6 py-3 rounded-xl font-medium hover:bg-neutral-50 transition flex items-center justify-center">
                  <i className="fa-solid fa-share mr-2"></i>
                  Share
                </button>
              </div>
              <div className="text-center text-sm text-neutral-900/60 mt-4">
                <i className="fa-solid fa-shield-check text-success mr-1"></i>
                Verified employer • Fair hiring practices
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Content Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Job Description */}
              <div className="bg-white">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Job Description</h2>
                <div className="prose prose-lg max-w-none text-neutral-900/80 leading-relaxed space-y-6">
                  <p>{jobData.description.split('\n\n')[0]}</p>
                  <p>{jobData.description.split('\n\n')[1]}</p>
                  
                  <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">What You'll Do</h3>
                  <ul className="space-y-3">
                    {jobData.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start">
                        <i className="fa-solid fa-check text-primary mr-3 mt-1"></i>
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Requirements</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Required Qualifications</h3>
                    <ul className="space-y-3">
                      {jobData.requirements.required.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <i className="fa-solid fa-star text-warning mr-3 mt-1"></i>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Preferred Qualifications</h3>
                    <ul className="space-y-3">
                      {jobData.requirements.preferred.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <i className="fa-solid fa-plus text-secondary mr-3 mt-1"></i>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Benefits & Perks */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Benefits & Perks</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {jobData.benefits.slice(0, 3).map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                          <i className={`fa-solid ${benefit.icon} text-primary`}></i>
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900">{benefit.title}</div>
                          <div className="text-sm text-neutral-900/70">{benefit.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {jobData.benefits.slice(3).map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                          <i className={`fa-solid ${benefit.icon} text-orange-500`}></i>
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900">{benefit.title}</div>
                          <div className="text-sm text-neutral-900/70">{benefit.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills Assessment */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Skills Assessment</h2>
                <div className="space-y-6">
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-neutral-900">Your Skills Match</h3>
                      <span className="bg-success text-white px-3 py-1 rounded-full text-sm font-medium">{jobData.matchScore}% Match</span>
                    </div>
                    
                    <div className="space-y-4">
                      {jobData.skillsMatch.map((skill, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-neutral-900">{skill.skill}</span>
                            <span className={`text-sm font-medium ${getSkillLevelColor(skill.level)}`}>{skill.level}</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getSkillBarColor(skill.level)}`} 
                              style={{ width: `${skill.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition">
                      <i className="fa-solid fa-chart-line mr-2"></i>
                      Take Additional Assessment
                    </button>
                  </div>
                </div>
              </div>

              {/* Application Process */}
              <div className="bg-white">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Application Process</h2>
                <div className="space-y-6">
                  {jobData.applicationProcess.map((step, index) => (
                    <div key={index} className="flex items-center space-x-4 p-6 border border-neutral-200 rounded-xl">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        step.step === 1 ? 'bg-primary' :
                        step.step === 2 ? 'bg-secondary' :
                        step.step === 3 ? 'bg-purple-600' :
                        step.step === 4 ? 'bg-orange-500' : 'bg-success'
                      }`}>
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">{step.title}</h3>
                        <p className="text-neutral-900/70 text-sm">{step.description}</p>
                      </div>
                      <div className="text-sm text-neutral-900/60">{step.duration}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Company Info Card */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">TF</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">{jobData.companyInfo.name}</h3>
                    <div className="flex items-center text-sm text-neutral-900/70">
                      <i className="fa-solid fa-users mr-2"></i>
                      <span>{jobData.companyInfo.employees}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-neutral-900/70 text-sm mb-6 leading-relaxed">
                  {jobData.companyInfo.description}
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-900/70">Industry</span>
                    <span className="text-sm font-medium text-neutral-900">{jobData.companyInfo.industry}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-900/70">Founded</span>
                    <span className="text-sm font-medium text-neutral-900">{jobData.companyInfo.founded}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-900/70">Headquarters</span>
                    <span className="text-sm font-medium text-neutral-900">{jobData.companyInfo.headquarters}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-900/70">Funding</span>
                    <span className="text-sm font-medium text-neutral-900">{jobData.companyInfo.funding}</span>
                  </div>
                </div>
                
                <button className="w-full border border-neutral-200 text-neutral-900 py-3 rounded-xl font-medium hover:bg-neutral-50 transition">
                  <i className="fa-solid fa-building mr-2"></i>
                  View Company Profile
                </button>
              </div>

              {/* Job Stats */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Job Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-900/70">Applications</span>
                    <span className="text-sm font-medium text-neutral-900">{jobData.jobStats.applications}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-900/70">Views</span>
                    <span className="text-sm font-medium text-neutral-900">{jobData.jobStats.views}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-900/70">Response Rate</span>
                    <span className="text-sm font-medium text-success">{jobData.jobStats.responseRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-900/70">Avg. Response Time</span>
                    <span className="text-sm font-medium text-neutral-900">{jobData.jobStats.avgResponseTime}</span>
                  </div>
                </div>
              </div>

              {/* Similar Jobs */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-neutral-900 mb-6">Similar Jobs</h3>
                <div className="space-y-4">
                  {jobData.similarJobs.map((job, index) => (
                    <div key={index} className="p-4 border border-neutral-100 rounded-xl hover:shadow-md transition cursor-pointer">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          index === 0 ? 'bg-red-500' : index === 1 ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                          <span className="text-white font-bold text-sm">{job.company.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900 text-sm">{job.title}</div>
                          <div className="text-xs text-neutral-900/60">{job.company}</div>
                        </div>
                      </div>
                      <div className="text-xs text-neutral-900/70">{job.salary} • {job.location}</div>
                      <div className="text-xs text-primary mt-1">{job.match}% Match</div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 text-primary font-medium text-sm hover:text-blue-600 transition">
                  View All Similar Jobs →
                </button>
              </div>

              {/* Recruiter Contact */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" alt="Recruiter" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-medium text-neutral-900">Marcus Johnson</div>
                    <div className="text-sm text-neutral-900/70">Senior Recruiter</div>
                  </div>
                </div>
                <p className="text-sm text-neutral-900/80 mb-4">
                  Hi! I'm the recruiter for this role. Feel free to reach out with any questions about the position or application process.
                </p>
                <button className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition">
                  <i className="fa-solid fa-message mr-2"></i>
                  Message Recruiter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {isApplicationModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center min-h-screen p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">Apply for {jobData.title}</h2>
                <button 
                  onClick={closeApplicationModal}
                  className="text-neutral-900/60 hover:text-neutral-900 transition"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-neutral-50 rounded-xl p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">TF</span>
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">{jobData.title}</div>
                      <div className="text-sm text-neutral-900/70">{jobData.company} • {jobData.location}</div>
                    </div>
                  </div>
                  <div className="text-sm text-neutral-900/70">{jobData.salary} per year • Remote OK</div>
                </div>
                
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">Cover Letter</label>
                    <textarea 
                      className="w-full p-4 border border-neutral-200 rounded-xl resize-none h-32 focus:ring-2 focus:ring-primary focus:border-transparent" 
                      placeholder="Tell us why you're interested in this role and what makes you a great fit..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">Portfolio URL</label>
                    <input 
                      type="url" 
                      className="w-full p-4 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent" 
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">Resume</label>
                    <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center hover:border-primary transition">
                      <i className="fa-solid fa-cloud-upload text-3xl text-neutral-400 mb-4"></i>
                      <p className="text-neutral-900/70 mb-2">Drag & drop your resume here</p>
                      <p className="text-sm text-neutral-900/50">or click to browse (PDF, DOC, DOCX up to 10MB)</p>
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <i className="fa-solid fa-info-circle text-primary mt-1"></i>
                      <div className="text-sm">
                        <div className="font-medium text-neutral-900 mb-1">Application Tips</div>
                        <ul className="text-neutral-900/70 space-y-1">
                          <li>• Highlight relevant UX design experience</li>
                          <li>• Include links to your best design work</li>
                          <li>• Mention specific tools and methodologies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="privacy-consent" className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary" />
                    <label htmlFor="privacy-consent" className="text-sm text-neutral-900/70">
                      I consent to the processing of my personal data for this application
                    </label>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button 
                      type="button" 
                      onClick={closeApplicationModal}
                      className="flex-1 border border-neutral-200 text-neutral-900 py-4 rounded-xl font-medium hover:bg-neutral-50 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 bg-primary text-white py-4 rounded-xl font-medium hover:bg-blue-600 transition"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 space-y-4">
        <button className="bg-secondary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110">
          <i className="fa-solid fa-bookmark text-xl"></i>
        </button>
        <button className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110">
          <i className="fa-solid fa-comments text-xl"></i>
        </button>
      </div>
    </div>
  )
}

export default JobDetails



