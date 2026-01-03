import React from 'react'

const Stats = () => {
  const statsData = [
    { icon: 'fa-briefcase', value: '2,500+', label: 'AI‑curated tech jobs posted in Canada' },
    { icon: 'fa-building', value: '800+', label: 'leading Canadian Employers' },
    { icon: 'fa-video', value: '15,000+', label: 'video resumes analysed by AI' },
    { icon: 'fa-users', value: '5,000+', label: 'successful tech placements across Canada' }
  ]

  return (
    <section className="relative -mt-8 z-10 pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 p-4 lg:p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 mb-2 shadow-sm">
                <i className={`fa-solid ${stat.icon} text-lg`}></i>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats

