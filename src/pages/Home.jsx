import React from 'react'
import Header from '../components/Header'
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

const Home = () => {
  useScrollEffect()

  return (
    <div className="bg-white font-sans">
      <Header />
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



