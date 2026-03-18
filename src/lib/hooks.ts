import { useEffect, useState, useCallback } from 'react'

// Hook for scroll-triggered atmosphere changes
export const useAtmosphereScroll = () => {
  const [currentAtmosphere, setCurrentAtmosphere] = useState<string>('default')
  
  const updateAtmosphere = useCallback(() => {
    // Get all atmosphere sections
    const sections = document.querySelectorAll('[data-atmosphere]')
    let newAtmosphere = 'default'
    
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Check if section is in viewport (at least 30% visible)
      if (rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3) {
        const atmosphere = section.getAttribute('data-atmosphere')
        if (atmosphere) {
          newAtmosphere = atmosphere
        }
      }
    })
    
    if (newAtmosphere !== currentAtmosphere) {
      setCurrentAtmosphere(newAtmosphere)
    }
  }, [currentAtmosphere])
  
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(updateAtmosphere)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    updateAtmosphere() // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [updateAtmosphere])
  
  return currentAtmosphere
}

// Hook for intersection observer
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  
  useEffect(() => {
    if (!elementRef.current) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        ...options,
      }
    )
    
    observer.observe(elementRef.current)
    
    return () => {
      observer.disconnect()
    }
  }, [elementRef, options])
  
  return isIntersecting
}