'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun, Type } from 'lucide-react'

type Theme = 'light' | 'dark'
type Font = 'default' | 'readable'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  const [font, setFont] = useState<Font>('default')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = (localStorage.getItem('ph-theme') as Theme) || 'light'
    const savedFont = (localStorage.getItem('ph-font') as Font) || 'default'
    setTheme(savedTheme)
    setFont(savedFont)
    document.documentElement.setAttribute('data-theme', savedTheme)
    document.documentElement.setAttribute('data-font', savedFont)
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('ph-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const toggleFont = () => {
    const next: Font = font === 'default' ? 'readable' : 'default'
    setFont(next)
    localStorage.setItem('ph-font', next)
    document.documentElement.setAttribute('data-font', next)
  }

  if (!mounted) return null

  return (
    <div
      className="ph-theme-toggle-bar"
      title="Accessibility & Theme controls"
      aria-label="Theme and font toggles"
    >
      {/* Dark / Light toggle */}
      <button
        onClick={toggleTheme}
        className={`ph-theme-toggle-btn${theme === 'dark' ? ' active' : ''}`}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      >
        {theme === 'dark'
          ? <Sun size={15} strokeWidth={2.5} />
          : <Moon size={15} strokeWidth={2.5} />
        }
      </button>

      {/* Readable font toggle */}
      <button
        onClick={toggleFont}
        className={`ph-theme-toggle-btn${font === 'readable' ? ' active' : ''}`}
        aria-label={font === 'readable' ? 'Switch to default font' : 'Switch to readable font'}
        title={font === 'readable' ? 'Default font' : 'Readable font (Atkinson Hyperlegible)'}
        style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.7rem' }}
      >
        <Type size={15} strokeWidth={2.5} />
      </button>
    </div>
  )
}
