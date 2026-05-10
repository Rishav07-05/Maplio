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
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Map className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Maplio</h1>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-3 text-sm font-semibold text-slate-500">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full transition ${isActive ? 'bg-slate-100 text-slate-900' : 'hover:text-slate-800'}`
              }
            >
              Dashboard
            </NavLink>
          </nav>
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
