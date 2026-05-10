import React from 'react'
import { motion } from 'framer-motion'
import { BrainCircuit, Sparkles } from 'lucide-react'

const LoadingScreen: React.FC = () => {
  return (
    <div className="absolute inset-0 maplio-overlay z-50 flex items-center justify-center rounded-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="maplio-card maplio-card--floating rounded-2xl p-8 max-w-sm w-full text-center flex flex-col items-center"
      >
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-indigo-100 border-t-indigo-500 rounded-full"
          />
          <BrainCircuit className="w-8 h-8 text-indigo-600 animate-pulse" />
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
          </motion.div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Topic</h3>
        <p className="text-slate-500 text-sm">
          Our AI is building your personalized learning architecture. This might take a few moments...
        </p>

        {/* Fake progress steps for visual feedback */}
        <div className="mt-6 space-y-3 w-full text-left">
          <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium">
            <div className="w-4 h-4 rounded-full border-2 border-indigo-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
            </div>
            Extracting core concepts
          </div>
          <motion.div 
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex items-center gap-2 text-xs text-slate-400 font-medium"
          >
            <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
            Structuring learning path
          </motion.div>
          <motion.div 
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
            className="flex items-center gap-2 text-xs text-slate-400 font-medium"
          >
            <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
            Generating knowledge graph
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoadingScreen
