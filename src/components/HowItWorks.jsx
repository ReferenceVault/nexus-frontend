import React from 'react'

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">How It Works</h2>
          <p className="text-xl text-neutral-900/70 max-w-3xl mx-auto">Our streamlined process connects exceptional talent with outstanding opportunities in just four simple steps.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="text-center group">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all">
                <i className="fa-solid fa-user-plus text-white text-2xl"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Create Profile</h3>
            <p className="text-neutral-900/70 leading-relaxed">Build a comprehensive profile showcasing your skills, experience, and career aspirations.</p>
          </div>

          {/* Step 2 */}
          <div className="text-center group">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all">
                <i className="fa-solid fa-tasks text-white text-2xl"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Take Assessment</h3>
            <p className="text-neutral-900/70 leading-relaxed">Complete fair, skills-based assessments that highlight your technical and soft skills.</p>
          </div>

          {/* Step 3 */}
          <div className="text-center group">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all">
                <i className="fa-solid fa-handshake text-white text-2xl"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Get Matched</h3>
            <p className="text-neutral-900/70 leading-relaxed">Our AI matches you with roles that align with your skills, preferences, and career goals.</p>
          </div>

          {/* Step 4 */}
          <div className="text-center group">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all">
                <i className="fa-solid fa-rocket text-white text-2xl"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Start Journey</h3>
            <p className="text-neutral-900/70 leading-relaxed">Begin your new role with comprehensive onboarding and relocation support if needed.</p>
          </div>
        </div>

        {/* Process Flow Visualization */}
        <div className="mt-16 relative">
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



