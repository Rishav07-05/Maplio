import React from 'react'
import { SignIn } from '@clerk/clerk-react'
import { Map, ShieldCheck, Sparkles } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen maplio-auth text-slate-900 flex items-center justify-center px-6 py-12 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 maplio-pill">
            <Map className="w-4 h-4" />
            Secure Maplio Access
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Sign in to keep your roadmap history synchronized.
          </h1>
          <p className="text-lg text-slate-600 max-w-xl">
            Save milestones, edits, and notes across devices. Connect Google or GitHub and keep moving.
          </p>
          <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Encrypted sync
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI-curated paths
            </div>
          </div>
        </div>
        <div className="maplio-auth-card glass rounded-3xl p-6 md:p-8">
          <SignIn routing="path" path="/sign-in" redirectUrl="/dashboard" />
        </div>
      </div>
    </div>
  )
}

export default AuthPage
