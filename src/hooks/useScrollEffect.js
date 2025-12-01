import { useEffect } from 'react'

export const useScrollEffect = () => {
  useEffect(() => {
    // Add scroll effect to header
    const handleScroll = () => {
      const header = document.getElementById('header')
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add('bg-white/95', 'backdrop-blur-sm')
        } else {
          header.classList.remove('bg-white/95', 'backdrop-blur-sm')
        }
      }
    }

    // Smooth scrolling for anchor links
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]')
      if (target) {
        e.preventDefault()
        const targetElement = document.querySelector(target.getAttribute('href'))
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('click', handleAnchorClick)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [])
}



