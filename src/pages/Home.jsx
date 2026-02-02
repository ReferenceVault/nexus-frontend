import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import SocialSidebar from '../components/SocialSidebar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import FeaturedTalent from '../components/FeaturedTalent'
import ValueProposition from '../components/ValueProposition'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import TrustSecurity from '../components/TrustSecurity'
import FeaturesDeepDive from '../components/FeaturesDeepDive'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'
import ChatWidget from '../components/ChatWidget'
import { useScrollEffect } from '../hooks/useScrollEffect'
import { useAuth } from '../hooks/useAuth'
import { isTokenExpired } from '../utils/apiClient'

const Home = () => {
  useScrollEffect()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, accessToken, user } = useAuth()
  const isEmployer = Array.isArray(user?.roles) && user.roles.includes('employer')

  // Redirect authenticated users - respect user's current context, not just roles
  useEffect(() => {
    if (isAuthenticated && accessToken && !isTokenExpired(accessToken)) {
      // Check if user came from a specific dashboard context (stored in sessionStorage)
      const lastDashboardType = sessionStorage.getItem('lastDashboardType')
      
      // If we have a stored dashboard preference, use it
      if (lastDashboardType === 'user') {
        navigate('/user-dashboard', { replace: true })
        return
      } else if (lastDashboardType === 'employer') {
        navigate('/employer-dashboard', { replace: true })
        return
      }
      
      // If no stored preference, check if user has employer role
      // But default to user-dashboard to respect user intent flow
      // Only redirect to employer-dashboard if user ONLY has employer role (not both)
      const userRoles = user?.roles || []
      const hasUserRole = Array.isArray(userRoles) && userRoles.includes('user')
      const hasEmployerRole = Array.isArray(userRoles) && userRoles.includes('employer')
      
      // If user has both roles, default to user-dashboard (safer default)
      // If user only has employer role, redirect to employer-dashboard
      if (hasEmployerRole && !hasUserRole) {
        navigate('/employer-dashboard', { replace: true })
      } else {
        // Default to user-dashboard (respects user intent flow)
        navigate('/user-dashboard', { replace: true })
      }
    }
  }, [isAuthenticated, accessToken, user, navigate])

  // Don't render home page content if authenticated (will redirect)
  if (isAuthenticated && accessToken && !isTokenExpired(accessToken)) {
    return null
  }

  return (
    <div className="bg-white font-sans">
      <Header />
      <SocialSidebar position={isAuthenticated ? 'right' : 'left'} />
      <Hero />
      <Stats />
      <FeaturedTalent />
      <ValueProposition />
      <HowItWorks />
      <Testimonials />
      <TrustSecurity />
      <FeaturesDeepDive />
      <FinalCTA />
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default Home



