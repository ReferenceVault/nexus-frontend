import React from 'react'

const ValueProposition = () => {
  return (
    <section id="value-proposition" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-4">Why CIP Nexus for AI-Driven Talent Discovery?</h2>
          <p className="text-base text-neutral-900/70 max-w-3xl mx-auto">We're revolutionizing the hiring process with transparency, fairness, and global opportunities.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-shield-check text-white text-lg"></i>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-3">Verified & Compliant Opportunities</h3>
            <p className="text-sm text-neutral-900/70 leading-relaxed">We work only with credible employers and well-defined roles, ensuring fair pay, clarity, and strong career potential.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-balance-scale text-white text-lg"></i>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-3">AI‑Powered Fair Assessments</h3>
            <p className="text-sm text-neutral-900/70 leading-relaxed">Our AI evaluates technical, communication and soft skills objectively, reducing bias and providing clear improvement guidance.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-globe text-white text-lg"></i>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-3">Global Mobility Support</h3>
            <p className="text-sm text-neutral-900/70 leading-relaxed">End-to-end support to help you transition smoothly into the Canadian tech workforce professionally.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ValueProposition



