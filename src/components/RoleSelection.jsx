import React from 'react'
import { useNavigate } from 'react-router-dom'

const RoleSelection = () => {
  const navigate = useNavigate()
  return (
    <section id="role-selection" className="py-20 bg-gradient-to-br from-neutral-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">Choose Your Path</h2>
          <p className="text-xl text-neutral-900/70 max-w-2xl mx-auto">Whether you're looking for talent or seeking opportunities, we've got you covered.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Candidate Path */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group border border-neutral-100">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                <i className="fa-solid fa-user-tie text-3xl text-primary group-hover:text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">I'm Looking for a Job</h3>
              <p className="text-neutral-900/70 leading-relaxed">Find your dream role with companies that value your skills and offer fair compensation.</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check-circle text-primary mr-3"></i>
                <span>Create detailed profile</span>
              </div>
              <div className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check-circle text-primary mr-3"></i>
                <span>Take skill assessments</span>
              </div>
              <div className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check-circle text-primary mr-3"></i>
                <span>Get matched to roles</span>
              </div>
              <div className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check-circle text-primary mr-3"></i>
                <span>Access relocation support</span>
              </div>
            </div>

            <button 
              className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 transition flex items-center justify-center"
              onClick={() => navigate('/create-profile')}
            >
              Start as Candidate
              <i className="fa-solid fa-arrow-right ml-3"></i>
            </button>
          </div>

          {/* Employer Path */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group border border-neutral-100">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary group-hover:text-white transition-all">
                <i className="fa-solid fa-building text-3xl text-secondary group-hover:text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">I'm Hiring Talent</h3>
              <p className="text-neutral-900/70 leading-relaxed">Access a global pool of pre-vetted candidates and streamline your hiring process.</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check-circle text-secondary mr-3"></i>
                <span>Post verified job listings</span>
              </div>
              <div className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check-circle text-secondary mr-3"></i>
                <span>Access talent pool</span>
              </div>
              <div className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check-circle text-secondary mr-3"></i>
                <span>Use assessment tools</span>
              </div>
              <div className="flex items-center text-neutral-900/80">
                <i className="fa-solid fa-check-circle text-secondary mr-3"></i>
                <span>Manage hiring pipeline</span>
              </div>
            </div>

            <button className="w-full bg-secondary text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition flex items-center justify-center">
              Start Hiring
              <i className="fa-solid fa-arrow-right ml-3"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RoleSelection
