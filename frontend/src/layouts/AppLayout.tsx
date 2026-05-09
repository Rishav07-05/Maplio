import React from 'react'
import { Link } from 'react-router-dom'
import { Map, Settings } from 'lucide-react'

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans overflow-hidden">
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 flex-shrink-0 z-20">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Map className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Maplio</h1>
        </Link>
        <div className="flex items-center gap-4">
          {/* Placeholder for future theme toggle/settings */}
          <button className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>
      <main className="flex-grow p-4 md:p-6 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  )
}

export default AppLayout
