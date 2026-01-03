import React from 'react'

const FeaturesDeepDive = () => {
  return (
    <section id="features-deep-dive" className="py-12 bg-gradient-to-br from-neutral-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-4">AI‑Native Features for Tech Careers</h2>
          <p className="text-base text-neutral-900/70 max-w-3xl mx-auto">Empower your tech career with AI insights, a vibrant mentorship network and recognised skill certifications.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Feature 1 */}
          <div>
            <div className="space-y-5">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-brain text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1.5">AI‑Powered Matching</h3>
                  <p className="text-sm text-neutral-900/70">Our AI analyses skills, video resumes, assessments and work permits to find the best-fit roles and candidates.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-chart-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1.5">AI Career Insights</h3>
                  <p className="text-sm text-neutral-900/70">Get personalised growth plans, trending tech roles and salary benchmarks based on your data and market trends.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-users text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1.5">Mentorship & Community</h3>
                  <p className="text-sm text-neutral-900/70">Connect with like-minded professionals and peers across Canada, and access exclusive mentorship, events and forums.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <img className="w-full h-72 object-cover rounded-xl shadow-xl" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/b31a7c3388-7800eca52b6495047017.png" alt="modern AI dashboard interface showing career matching and analytics, professional design" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center mt-12">
          <div className="order-2 lg:order-1">
            <img className="w-full h-72 object-cover rounded-xl shadow-xl" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/3ed36677ee-be699a927f080bf160c5.png" alt="assessment interface showing coding challenge and skills evaluation, clean modern UI" />
          </div>
          <div className="order-1 lg:order-2">
            <div className="space-y-5">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-code text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1.5">Technical Assessments</h3>
                  <p className="text-sm text-neutral-900/70">Take AI-scored coding, cloud and data challenges validated by Canadian industry experts.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-comments text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1.5">Soft Skills Evaluation</h3>
                  <p className="text-sm text-neutral-900/70">Our AI analyses communication, teamwork and problem-solving from your video and interview responses.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-trophy text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1.5">Verified Skills Certification</h3>
                  <p className="text-sm text-neutral-900/70">Earn digital badges recognised by Canadian tech employers and display them on your resume and LinkedIn profile.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesDeepDive



