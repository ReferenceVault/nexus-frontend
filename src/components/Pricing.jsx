import React from 'react'

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">Simple, Transparent Pricing</h2>
          <p className="text-xl text-neutral-900/70 max-w-3xl mx-auto">Choose the plan that fits your career goals. No hidden fees, no surprises.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:shadow-xl transition-all">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Starter</h3>
              <div className="text-4xl font-bold text-neutral-900 mb-2">Free</div>
              <p className="text-neutral-900/60">Perfect for getting started</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <i className="fa-solid fa-check text-success mr-3"></i>
                <span>Basic profile creation</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check text-success mr-3"></i>
                <span>Browse job listings</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check text-success mr-3"></i>
                <span>Basic skill assessments</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check text-success mr-3"></i>
                <span>Community access</span>
              </li>
            </ul>
            <button className="w-full border-2 border-neutral-900 text-neutral-900 py-3 rounded-xl font-semibold hover:bg-neutral-900 hover:text-white transition">
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-primary text-white rounded-2xl p-8 hover:shadow-2xl transition-all transform scale-105 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-warning text-neutral-900 px-4 py-1 rounded-full text-sm font-bold">
              Most Popular
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <div className="text-4xl font-bold mb-2">$29<span className="text-lg font-normal">/month</span></div>
              <p className="text-blue-100">For serious job seekers</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <i className="fa-solid fa-check text-green-300 mr-3"></i>
                <span>Everything in Starter</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check text-green-300 mr-3"></i>
                <span>Advanced assessments</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check text-green-300 mr-3"></i>
                <span>Priority matching</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check text-green-300 mr-3"></i>
                <span>Direct employer messaging</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check text-green-300 mr-3"></i>
                <span>Interview preparation</span>
              </li>
            </ul>
            <button className="w-full bg-white text-primary py-3 rounded-xl font-semibold hover:bg-blue-50 transition">
              Start Professional
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:shadow-xl transition-all">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-neutral-900 mb-2">Custom</div>
              <p className="text-neutral-900/60">For organizations</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <i className="fa-solid fa-check text-success mr-3"></i>
                <span>Everything in Professional</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check text-success mr-3"></i>
                <span>Bulk licensing</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check text-success mr-3"></i>
                <span>Custom assessments</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check text-success mr-3"></i>
                <span>Dedicated support</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check text-success mr-3"></i>
                <span>Analytics dashboard</span>
              </li>
            </ul>
            <button className="w-full border-2 border-neutral-900 text-neutral-900 py-3 rounded-xl font-semibold hover:bg-neutral-900 hover:text-white transition">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing



