import React from 'react'

const ErrorMessage = ({ error, onDismiss }) => {
  if (!error) return null

  return (
    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg flex items-center justify-between">
      <span>{error}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-red-600 hover:text-red-800 focus:outline-none"
        >
          <i className="fa-solid fa-times"></i>
        </button>
      )}
    </div>
  )
}

export default ErrorMessage

