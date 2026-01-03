import React from 'react'

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  showPasswordToggle = false,
  onTogglePassword,
  showPassword = false,
  className = '',
}) => {
  const inputClasses = `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
    error
      ? 'border-red-300 focus:ring-red-200'
      : 'border-slate-200 focus:ring-indigo-200'
  } ${className}`

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={showPasswordToggle && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default FormInput

