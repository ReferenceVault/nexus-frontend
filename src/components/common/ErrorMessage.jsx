import React from 'react'

const ErrorMessage = ({ error, message, onDismiss }) => {
  const errorText = error || message
  if (!errorText) return null

  return (
    <div className="bg-red-50 border-2 border-red-400 text-red-800 text-sm p-4 rounded-lg flex items-start justify-between gap-3 shadow-md">
      <div className="flex items-start gap-2 flex-1">
        <i className="fa-solid fa-circle-exclamation text-red-600 mt-0.5 flex-shrink-0"></i>
        <span className="flex-1 font-medium">{errorText}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800 focus:outline-none flex-shrink-0 transition-colors"
          aria-label="Dismiss error"
        >
          <i className="fa-solid fa-times"></i>
        </button>
      )}
    </div>
  )
}

export default ErrorMessage

