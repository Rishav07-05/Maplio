import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Moon, Sun } from 'lucide-react'
import type { RootState, AppDispatch } from '../redux/store'
import { setTheme } from '../redux/uiSlice'

type ThemeToggleProps = {
  className?: string
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>()
  const theme = useSelector((state: RootState) => state.ui.theme)
  const isDark = theme === 'dark'

  const handleToggle = () => {
    dispatch(setTheme(isDark ? 'light' : 'dark'))
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`maplio-theme-toggle ${className ?? ''}`.trim()}
    >
      <span className="maplio-theme-toggle__icon">
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </span>
      <span className="maplio-theme-toggle__label">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  )
}

export default ThemeToggle
