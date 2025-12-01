import React from 'react'

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">Success Stories</h2>
          <p className="text-xl text-neutral-900/70 max-w-3xl mx-auto">Hear from professionals who've transformed their careers through Nexus Recruitment.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center mb-6">
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg" alt="Sarah Chen" className="w-16 h-16 rounded-full object-cover mr-4" />
              <div>
                <h4 className="font-bold text-neutral-900">Sarah Chen</h4>
                <p className="text-neutral-900/60">Senior Software Engineer</p>
                <div className="flex text-warning mt-1">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
              </div>
            </div>
            <p className="text-neutral-900/80 leading-relaxed mb-4">"Nexus helped me transition from a local startup to a global tech company. The assessment process was fair and the relocation support was incredible. I'm now working my dream job in Berlin!"</p>
            <div className="text-sm text-neutral-900/60">
              <i className="fa-solid fa-map-marker-alt mr-1"></i>
              Singapore → Berlin, Germany
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center mb-6">
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="Marcus Rodriguez" className="w-16 h-16 rounded-full object-cover mr-4" />
              <div>
                <h4 className="font-bold text-neutral-900">Marcus Rodriguez</h4>
                <p className="text-neutral-900/60">Data Scientist</p>
                <div className="flex text-warning mt-1">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
              </div>
            </div>
            <p className="text-neutral-900/80 leading-relaxed mb-4">"The transparency in salary ranges and company culture was refreshing. No more guessing games. I found a role that perfectly matched my skills and values, with a 40% salary increase."</p>
            <div className="text-sm text-neutral-900/60">
              <i className="fa-solid fa-map-marker-alt mr-1"></i>
              Mexico City → Toronto, Canada
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center mb-6">
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" alt="Priya Patel" className="w-16 h-16 rounded-full object-cover mr-4" />
              <div>
                <h4 className="font-bold text-neutral-900">Priya Patel</h4>
                <p className="text-neutral-900/60">Product Manager</p>
                <div className="flex text-warning mt-1">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
              </div>
            </div>
            <p className="text-neutral-900/80 leading-relaxed mb-4">"As someone from a non-traditional background, the skills-based assessment gave me a fair chance to showcase my abilities. The bias-free process opened doors I never thought possible."</p>
            <div className="text-sm text-neutral-900/60">
              <i className="fa-solid fa-map-marker-alt mr-1"></i>
              Mumbai → Amsterdam, Netherlands
            </div>
          </div>
        </div>

        {/* Testimonial Stats */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <div className="text-neutral-900/60">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary mb-2">4.9/5</div>
            <div className="text-neutral-900/60">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">30%</div>
            <div className="text-neutral-900/60">Average Salary Increase</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500 mb-2">12K+</div>
            <div className="text-neutral-900/60">Successful Placements</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials



