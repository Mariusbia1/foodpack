import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    // Instantly reset scroll to top before next paint
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname, search])

  return null
}
