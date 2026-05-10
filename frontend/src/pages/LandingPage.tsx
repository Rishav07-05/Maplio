import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Map, ArrowRight, Zap, Sparkles } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen maplio-landing text-slate-900 flex flex-col font-sans overflow-hidden relative">
      <div className="maplio-landing-orbs" aria-hidden="true">
        <span className="maplio-orb maplio-orb--one" />
        <span className="maplio-orb maplio-orb--two" />
        <span className="maplio-orb maplio-orb--three" />
      </div>

      <header className="flex items-center justify-between px-8 py-6 max-w-7xl w-full mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <div className="maplio-brand-badge">
            <Map className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Maplio</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-800">
          <a href="#features" className="hover:underline">Features</a>
          <a href="#how-it-works" className="hover:underline">How it Works</a>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/dashboard"
            className="maplio-cta-outline"
          >
            Go to App
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="maplio-pill"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold">AI-Powered Learning Architecture</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight"
          >
            Turn ambitious goals into
            <span className="block maplio-landing-accent">bold, visual roadmaps.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-700 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Maplio maps any skill into an interactive knowledge graph, complete with stages, subtopics, and the next right move.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/dashboard"
              className="maplio-cta-solid group w-full sm:w-auto"
            >
              Start Generating
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#demo"
              className="maplio-cta-outline maplio-cta-outline--wide w-full sm:w-auto"
            >
              <Zap className="w-5 h-5 text-amber-400" />
              See Example
            </a>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage
