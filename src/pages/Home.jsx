import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const { isAuthenticated, accessToken, user } = useAuth()
  const isEmployer = Array.isArray(user?.roles) && user.roles.includes('employer')

  // Redirect authenticated users to user dashboard
  useEffect(() => {
    if (isAuthenticated && accessToken && !isTokenExpired(accessToken)) {
      navigate(isEmployer ? '/employer-dashboard' : '/user-dashboard', { replace: true })
    }
  }, [isAuthenticated, accessToken, isEmployer, navigate])

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



