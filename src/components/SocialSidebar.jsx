import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const SocialSidebar = ({ position = 'left' }) => {
  const { isAuthenticated } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in after a delay (only for left side, right side shows immediately)
    if (position === 'left') {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(true)
    }
  }, [position])

  const socialLinks = [
    { icon: 'fa-brands fa-facebook-f', href: '#', label: 'Facebook' },
    { icon: 'fa-brands fa-instagram', href: '#', label: 'Instagram' },
    { icon: 'fa-brands fa-twitter', href: '#', label: 'Twitter' },
    { icon: 'fa-brands fa-linkedin-in', href: '#', label: 'LinkedIn' },
    { icon: 'fa-brands fa-youtube', href: '#', label: 'YouTube' }
  ]

  const isRight = position === 'right'
  const positionClasses = isRight 
    ? 'right-0 rounded-l-xl' 
    : 'left-0 rounded-r-xl'
  
  const animationClasses = isRight
    ? 'translate-x-0' // Right side always visible
    : isVisible 
      ? 'translate-x-0' 
      : '-translate-x-full'

  return (
    <div 
      className={`fixed ${positionClasses} top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-1 bg-white shadow-lg overflow-hidden transition-transform duration-700 ease-out ${animationClasses}`}
    >
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-3 py-2 text-xs font-medium text-center">
        <span 
          className="block" 
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Connect
        </span>
      </div>
      {socialLinks.map((social, index) => (
        <a
          key={index}
          href={social.href}
          className="p-3 text-neutral-500 hover:text-primary hover:bg-indigo-50 transition-colors duration-300 flex items-center justify-center"
          aria-label={social.label}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className={`${social.icon} w-5 h-5`}></i>
        </a>
      ))}
    </div>
  )
}

export default SocialSidebar

