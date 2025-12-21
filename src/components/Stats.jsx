import React from 'react'

const Stats = () => {
  return (
    <section className="relative -mt-12 z-10 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 lg:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Jobs */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3 shadow-sm">
              <i className="fa-solid fa-briefcase text-xl"></i>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-slate-900">2,500+</div>
            <div className="text-sm text-slate-500 mt-1">AI‑curated tech jobs posted in Canada</div>
          </div>

          {/* Tech Companies */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3 shadow-sm">
              <i className="fa-solid fa-building text-xl"></i>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-slate-900">800+</div>
            <div className="text-sm text-slate-500 mt-1">leading Canadian Employers</div>
          </div>

          {/* Video Resumes */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3 shadow-sm">
              <i className="fa-solid fa-video text-xl"></i>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-slate-900">15,000+</div>
            <div className="text-sm text-slate-500 mt-1">video resumes analysed by AI</div>
          </div>

          {/* Placements */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3 shadow-sm">
              <i className="fa-solid fa-users text-xl"></i>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-slate-900">5,000+</div>
            <div className="text-sm text-slate-500 mt-1">successful tech placements across Canada</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Stats

