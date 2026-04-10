import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

// Simple Theme Toggle
export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // Default to dark since user asked for "dark mode by default"
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark'
    }
    return 'dark'
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md w-9 h-9 flex items-center justify-center hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
