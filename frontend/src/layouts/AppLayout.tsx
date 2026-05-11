import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Map } from 'lucide-react'
import { UserButton } from '@clerk/clerk-react'
import ThemeToggle from '../components/ThemeToggle'

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen maplio-app-shell flex flex-col font-sans overflow-hidden">
      <header className="maplio-app-header h-16 flex items-center justify-between px-6 flex-shrink-0 z-20">
        <Link to="/" className="flex items-center gap-2">
          <div className="maplio-brand-mark">
            <Map className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold maplio-brand-text tracking-tight">Maplio</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserButton appearance={{ elements: { userButtonBox: 'rounded-full' } }} />
        </div>
      </header>
      <main className="flex-grow p-4 md:p-6 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  )
}

export default AppLayout
