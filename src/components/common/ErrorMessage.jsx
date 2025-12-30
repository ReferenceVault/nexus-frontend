import React from 'react'

const ErrorMessage = ({ error, message, onDismiss }) => {
  const errorText = error || message
  if (!errorText) return null

  return (
    <div className="bg-red-900/20 border border-red-500/50 text-red-300 text-sm p-4 rounded-lg flex items-start justify-between gap-3 shadow-lg">
      <div className="flex items-start gap-2 flex-1">
        <i className="fa-solid fa-circle-exclamation text-red-400 mt-0.5"></i>
        <span className="flex-1">{errorText}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-300 focus:outline-none flex-shrink-0"
          aria-label="Dismiss error"
        >
          <i className="fa-solid fa-times"></i>
        </button>
      )}
    </div>
  )
}

export default ErrorMessage

