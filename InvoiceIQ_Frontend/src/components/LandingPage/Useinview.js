import { useEffect, useRef, useState } from 'react'

// Returns [ref, inView]. Flips to true once, the first time the element scrolls into view.
function useInView({ threshold = 0.2, rootMargin = '0px 0px -60px 0px' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, inView]
}

export default useInView