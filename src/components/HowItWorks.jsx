import React from 'react'

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-4">How CIP Nexus Works</h2>
          <p className="text-base text-neutral-900/70 max-w-3xl mx-auto">Our streamlined process connects exceptional talent with outstanding opportunities in just four simple steps.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-5">
          {/* Step 1 */}
          <div className="text-center group">
            <div className="relative mb-5">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all">
                <i className="fa-solid fa-user-plus text-white text-lg"></i>
              </div>
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-3">Create Your AI‑Enhanced Profile</h3>
            <p className="text-sm text-neutral-900/70 leading-relaxed">Build your profile now by simply uploading your resume and record a video. Our AI analyses your skills and communication and lets you showcase your skills and experiences</p>
          </div>

          {/* Step 2 */}
          <div className="text-center group">
            <div className="relative mb-5">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all">
                <i className="fa-solid fa-tasks text-white text-lg"></i>
              </div>
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-3">Ace AI‑Powered Assessments</h3>
            <p className="text-sm text-neutral-900/70 leading-relaxed">Complete technical, soft skill and communication evaluations scored by our AI, and receive personalised improvement tips.</p>
          </div>

          {/* Step 3 */}
          <div className="text-center group">
            <div className="relative mb-5">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all">
                <i className="fa-solid fa-handshake text-white text-lg"></i>
              </div>
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-3">Get Discovered</h3>
            <p className="text-sm text-neutral-900/70 leading-relaxed">Our AI helps you discover roles based on your skills, preferences and location, delivering personalised career goals.</p>
          </div>

          {/* Step 4 */}
          <div className="text-center group">
            <div className="relative mb-5">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all">
                <i className="fa-solid fa-rocket text-white text-lg"></i>
              </div>
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-3">Start Your Professional Journey</h3>
            <p className="text-sm text-neutral-900/70 leading-relaxed">Begin your journey with support from experienced mentors and trusted CIP advisors.</p>
          </div>
        </div>

        {/* Process Flow Visualization */}
        <div className="mt-10 relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-orange-500 transform -translate-y-1/2"></div>
          <div className="flex justify-between items-center relative z-10">
            <div className="w-4 h-4 bg-primary rounded-full"></div>
            <div className="w-4 h-4 bg-secondary rounded-full"></div>
            <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks



