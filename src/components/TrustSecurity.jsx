import React from 'react'

const TrustSecurity = () => {
  return (
    <section id="trust-security" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">Trusted by Leading Canadian Employers</h2>
          <p className="text-xl text-neutral-900/70 max-w-3xl mx-auto">Join thousands of professionals and companies who trust Nexus for their career and hiring needs.</p>
        </div>

        {/* Company Logos */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 items-center mb-16 opacity-30 hover:opacity-60 transition-opacity">
          <div className="flex items-center justify-center h-16">
            <img className="h-12 w-auto object-contain grayscale" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/2f6c33be22-ebd70fb258b29f854f9f.png" alt="tech company logo Google style" />
          </div>
          <div className="flex items-center justify-center h-16">
            <img className="h-12 w-auto object-contain grayscale" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/3b15123c0d-c06508d46305f35dccf8.png" alt="tech company logo Microsoft style" />
          </div>
          <div className="flex items-center justify-center h-16">
            <img className="h-12 w-auto object-contain grayscale" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/2ebeae9ce1-62075a3fce99d09efcf2.png" alt="tech company logo Amazon style" />
          </div>
          <div className="flex items-center justify-center h-16">
            <img className="h-12 w-auto object-contain grayscale" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a9b72bfb4e-cd09c58518e4aa14f6bf.png" alt="tech company logo Apple style" />
          </div>
          <div className="flex items-center justify-center h-16">
            <img className="h-12 w-auto object-contain grayscale" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/d500b50f36-1880705fb4e0b6ddefd6.png" alt="tech company logo Netflix style" />
          </div>
          <div className="flex items-center justify-center h-16">
            <img className="h-12 w-auto object-contain grayscale" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/6210e18c5d-06ae33f52bfe94945b67.png" alt="tech company logo Spotify style" />
          </div>
        </div>

        {/* Security Features */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-shield-check text-success text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Data Protection & Compliance</h3>
            <p className="text-neutral-900/70">Your data is encrypted and stored in Canada. Our processes meet GDPR and PIPEDA standards and undergo independent audits.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-user-shield text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Privacy First</h3>
            <p className="text-neutral-900/70">You choose who can view your video resume and skills profiles, and can control your profile access at any time.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-certificate text-purple-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Licensed & Verified Employers</h3>
            <p className="text-neutral-900/70">All employers hold the necessary provincial recruiter licences and have been vetted for fair hiring practices.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustSecurity



