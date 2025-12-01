import React from 'react'

const GDPRBanner = () => {
  const handleAccept = () => {
    document.getElementById('gdpr-banner').style.display = 'none'
  }

  return (
    <div id="gdpr-banner" className="fixed top-0 left-0 right-0 bg-neutral-900 text-white p-4 z-50 shadow-lg">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            We use cookies to enhance your experience and analyze site usage. By continuing, you consent to our use of cookies. 
            <span className="underline hover:text-primary cursor-pointer"> Learn more</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-neutral-50 text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
            Manage Preferences
          </button>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
            onClick={handleAccept}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}

export default GDPRBanner



