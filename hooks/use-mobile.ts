import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // 🛡️ RE-ENFORCED: Start with a sensible default for a mobile-first app
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useLayoutEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Modern listener
    mql.addEventListener('change', onChange)
    
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}