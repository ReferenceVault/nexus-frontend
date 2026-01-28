import React from 'react'

const Testimonials = () => {
  // Reusable star rating component
  const StarRating = () => (
    <div className="flex text-warning mt-0.5">
      {[...Array(5)].map((_, i) => (
        <i key={i} className="fa-solid fa-star text-xs"></i>
      ))}
    </div>
  )

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Software Engineer',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
      quote: "Thanks to CIP Nexus' AI assessments, I knew exactly what to improve. The transparent matching and salary insights landed me a dream job in Toronto.",
      location: 'Toronto, Canada'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Data Scientist',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
      quote: "CIP Nexus matched me to an amazing data scientist role. The fair assessment and market-based salary guidance were game-changers.",
      location: 'Mexico City → Toronto, Canada'
    },
    {
      name: 'Priya Patel',
      role: 'Product Manager',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
      quote: "I was skeptical about recruitment agencies. CIP Nexus proved me wrong with fair, AI-driven hiring that valued my strengths and helped me relocate to Vancouver.",
      location: 'Vancouver, Canada'
    }
  ]

  return (
    <section id="testimonials" className="py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-4">Success Stories & Impact Metrics</h2>
          <p className="text-base text-neutral-900/70 max-w-3xl mx-auto">Hear from professionals who've transformed their careers through Nexus Recruitment.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-3" />
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm">{testimonial.name}</h4>
                  <p className="text-neutral-900/60 text-xs">{testimonial.role}</p>
                  <StarRating />
                </div>
              </div>
              <p className="text-sm text-neutral-900/80 leading-relaxed mb-3">"{testimonial.quote}"</p>
              <div className="text-xs text-neutral-900/60">
                <i className="fa-solid fa-map-marker-alt mr-1"></i>
                {testimonial.location}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Stats */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-5 text-center">
          <div>
            <div className="text-2xl font-bold text-primary mb-1">5,000+</div>
            <div className="text-xs text-neutral-900/60">successful tech placements across Canada.</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary mb-1">4.9/5</div>
            <div className="text-xs text-neutral-900/60">satisfaction from candidates and employers.</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 mb-1">30%</div>
            <div className="text-xs text-neutral-900/60">average salary increase for placed candidates.</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-500 mb-1">95%</div>
            <div className="text-xs text-neutral-900/60">placement success within 120 days.</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials



