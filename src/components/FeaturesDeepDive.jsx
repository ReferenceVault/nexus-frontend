import React from 'react'

const FeaturesDeepDive = () => {
  return (
    <section id="features-deep-dive" className="py-20 bg-gradient-to-br from-neutral-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">AI‑Native Features for Tech Careers</h2>
          <p className="text-xl text-neutral-900/70 max-w-3xl mx-auto">Empower your tech career with AI insights, a vibrant mentorship network and recognised skill certifications.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Feature 1 */}
          <div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-brain text-white"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">AI‑Powered Matching</h3>
                  <p className="text-neutral-900/70">Our AI analyses skills, video resumes, assessments and work permits to find the best-fit roles and candidates.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-chart-line text-white"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">AI Career Insights</h3>
                  <p className="text-neutral-900/70">Get personalised growth plans, trending tech roles and salary benchmarks based on your data and market trends.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-users text-white"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Mentorship & Community</h3>
                  <p className="text-neutral-900/70">Connect with like-minded professionals and peers across Canada, and access exclusive mentorship, events and forums.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <img className="w-full h-96 object-cover rounded-2xl shadow-xl" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/b31a7c3388-7800eca52b6495047017.png" alt="modern AI dashboard interface showing career matching and analytics, professional design" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mt-20">
          <div className="order-2 lg:order-1">
            <img className="w-full h-96 object-cover rounded-2xl shadow-xl" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/3ed36677ee-be699a927f080bf160c5.png" alt="assessment interface showing coding challenge and skills evaluation, clean modern UI" />
          </div>
          <div className="order-1 lg:order-2">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-code text-white"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Technical Assessments</h3>
                  <p className="text-neutral-900/70">Take AI-scored coding, cloud and data challenges validated by Canadian industry experts.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-comments text-white"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Soft Skills Evaluation</h3>
                  <p className="text-neutral-900/70">Our AI analyses communication, teamwork and problem-solving from your video and interview responses.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-trophy text-white"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Verified Skills Certification</h3>
                  <p className="text-neutral-900/70">Earn digital badges recognised by Canadian tech employers and display them on your resume and LinkedIn profile.</p>
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



