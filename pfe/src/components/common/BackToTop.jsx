import { useEffect } from 'react'

const BackToTop = () => {
  useEffect(() => {
    const handleScroll = () => {
      const backToTop = document.querySelector('.rbt-progress-parent')
      if (backToTop) {
        if (window.scrollY > 50) {
          backToTop.classList.add('rbt-backto-top-active')
        } else {
          backToTop.classList.remove('rbt-backto-top-active')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = (e) => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="rbt-progress-parent" onClick={scrollToTop}>
      <svg className="rbt-back-circle svg-inner" width="100%" height="100%" viewBox="-1 -1 102 102">
        <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
      </svg>
    </div>
  )
}

export default BackToTop