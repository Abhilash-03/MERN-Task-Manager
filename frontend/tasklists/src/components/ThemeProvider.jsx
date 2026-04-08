import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector(state => state.theme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}

export default ThemeProvider
