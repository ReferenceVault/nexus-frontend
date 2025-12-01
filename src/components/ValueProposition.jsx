import React from 'react'

const ValueProposition = () => {
  return (
    <section id="value-proposition" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">Why Choose Nexus Recruitment?</h2>
          <p className="text-xl text-neutral-900/70 max-w-3xl mx-auto">We're revolutionizing the hiring process with transparency, fairness, and global opportunities.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-shield-check text-white text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Vetted Opportunities</h3>
            <p className="text-neutral-900/70 mb-6 leading-relaxed">Every role is thoroughly vetted for legitimacy, fair compensation, and growth potential. No spam, no scams.</p>
            <ul className="space-y-2">
              <li className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check text-primary mr-3"></i>
                Company verification process
              </li>
              <li className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check text-primary mr-3"></i>
                Salary transparency
              </li>
              <li className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check text-primary mr-3"></i>
                Growth opportunities
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-balance-scale text-white text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Fair Assessments</h3>
            <p className="text-neutral-900/70 mb-6 leading-relaxed">Skills-based evaluations that focus on ability, not background. Level the playing field for everyone.</p>
            <ul className="space-y-2">
              <li className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check text-secondary mr-3"></i>
                Bias-free evaluation
              </li>
              <li className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check text-secondary mr-3"></i>
                Multiple assessment types
              </li>
              <li className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check text-secondary mr-3"></i>
                Instant feedback
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-globe text-white text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Global Relocation</h3>
            <p className="text-neutral-900/70 mb-6 leading-relaxed">Comprehensive support for international moves, from visa assistance to cultural integration.</p>
            <ul className="space-y-2">
              <li className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check text-purple-600 mr-3"></i>
                Visa sponsorship matching
              </li>
              <li className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check text-purple-600 mr-3"></i>
                Relocation packages
              </li>
              <li className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check text-purple-600 mr-3"></i>
                Cultural onboarding
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ValueProposition



