import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'
import { api } from '../utils/api'
import { useAuth } from '../hooks/useAuth'
import { useLogout } from '../hooks/useLogout'

const EmployerOnboarding = () => {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const handleLogout = useLogout('/employer-signup')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    industry: '',
    primaryCountry: '',
    primaryProvince: '',
    companySize: '',
    title: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await api.getEmployerProfile()
        if (profile?.company) {
          setFormData({
            companyName: profile.company.name || '',
            companyWebsite: profile.company.website || '',
            industry: profile.company.industry || '',
            primaryCountry: profile.company.primaryCountry || '',
            primaryProvince: profile.company.primaryProvince || '',
            companySize: profile.company.size || '',
            title: profile.title || '',
          })
        }
      } catch (err) {
        // Ignore if profile doesn't exist yet
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!formData.companyName.trim()) {
      setError('Company name is required.')
      return
    }
    try {
      setIsSaving(true)
      await api.employerOnboard({
        companyName: formData.companyName.trim(),
        companyWebsite: formData.companyWebsite.trim() || undefined,
        industry: formData.industry.trim() || undefined,
        primaryCountry: formData.primaryCountry.trim() || undefined,
        primaryProvince: formData.primaryProvince.trim() || undefined,
        companySize: formData.companySize.trim() || undefined,
        title: formData.title.trim() || undefined,
      })
      // Refresh tokens to ensure employer role is present
      try {
        const refreshed = await api.refreshToken()
        if (refreshed?.user && refreshed?.tokens) {
          login(refreshed.user, refreshed.tokens)
        }
      } catch (refreshError) {
        // If refresh fails, continue; user can re-login
      }
      navigate('/employer-dashboard')
    } catch (err) {
      setError(err.message || 'Failed to onboard employer.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/30 via-white to-indigo-50/20 flex flex-col">
      <DashboardHeader
        userName={user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email?.split('@')[0] || 'Employer'}
        userEmail={user?.email || ''}
        userInitial={(user?.firstName?.[0] || user?.email?.[0] || 'E').toUpperCase()}
        onProfile={() => navigate('/user-dashboard')}
        onLogout={handleLogout}
        breadcrumbs={[{ label: 'Employer Onboarding', href: '/employer-onboarding' }]}
        title="Employer Onboarding"
        subtitle=""
      />

      <div className="flex flex-1">
        <DashboardSidebar
          title="Employer"
          collapsed={false}
          onToggleCollapse={() => {}}
          activeView="onboarding"
          menuItems={[
            { id: 'onboarding', label: 'Onboarding', icon: 'fa-solid fa-building', onClick: () => navigate('/employer-onboarding') },
            { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-briefcase', onClick: () => navigate('/employer-dashboard') },
          ]}
        />

        <main className="flex-1 pr-11 lg:pr-14">
          <div className="px-8 py-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-indigo-200/50 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-1">Company Profile</h2>
                <p className="text-xs text-neutral-600 mb-4">Tell us about your company to get started.</p>

                {isLoadingProfile ? (
                  <div className="flex items-center justify-center py-10 text-sm text-neutral-600">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Loading employer profile...
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Company Name *</label>
                    <input
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="CIP Nexus"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">Website</label>
                      <input
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">Industry</label>
                      <input
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Technology"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">Primary Country</label>
                      <input
                        name="primaryCountry"
                        value={formData.primaryCountry}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Canada"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">Primary Province</label>
                      <input
                        name="primaryProvince"
                        value={formData.primaryProvince}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Ontario"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">Company Size</label>
                      <input
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="1-10, 11-50, 51-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">Your Title</label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Hiring Manager"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      {error}
                    </div>
                  )}

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Company Profile'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default EmployerOnboarding
