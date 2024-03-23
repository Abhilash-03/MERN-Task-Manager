import React from 'react'
import { useSelector } from 'react-redux'

const ThemeProvider = ({ children }) => {
    const { theme } = useSelector(state => state.theme);
  return (
    <div className={theme}>
      <div className={`bg-[#e0dfff] text-slate-800 dark:text-gray-800 dark:bg-[#12113b] min-h-screen`}>
        {children}
      </div>
    </div>
  )
}

export default ThemeProvider
