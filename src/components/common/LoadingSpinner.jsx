import React from 'react'

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-14 w-14',
    lg: 'h-20 w-20',
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg animate-spin`}
      >
        <i className="fa-solid fa-spinner text-white text-xl"></i>
      </div>
      {text && <p className="text-white text-lg mt-4">{text}</p>}
    </div>
  )
}

export default LoadingSpinner

