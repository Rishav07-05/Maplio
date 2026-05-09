import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../redux/store'
import { requestRoadmap } from '../redux/roadmapSlice'
import RoadmapCanvas from '../components/RoadmapCanvas'
import LoadingScreen from '../components/LoadingScreen'
import { Play, Loader2 } from 'lucide-react'

const LEVELS = [
  'School',
  'Beginner',
  'Intermediate',
  'Advanced',
  'College Level',
  'Industry Ready'
]

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const status = useSelector((state: RootState) => state.roadmap.status)
  
  const [goal, setGoal] = useState('')
  const [level, setLevel] = useState('Beginner')

  const handleGenerate = () => {
    if (!goal.trim()) return
    dispatch(requestRoadmap({ goal, level }))
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full gap-4 relative">
      {/* Left Sidebar Control Panel */}
      <div className="w-full md:w-80 flex-shrink-0 bg-white shadow-sm border border-slate-200 rounded-2xl p-5 flex flex-col gap-6 relative z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Create Roadmap</h2>
          <p className="text-sm text-slate-500">Define your learning objective.</p>
        </div>

        <div className="space-y-4 flex-grow">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">What do you want to learn?</label>
            <textarea
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all text-slate-800"
              rows={4}
              placeholder="e.g. Become a Full Stack Developer, Learn Machine Learning..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Your Current Level</label>
            <select
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white text-slate-800"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {LEVELS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={status === 'loading' || !goal.trim()}
          className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all
            ${status === 'loading' || !goal.trim() 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/25'
            }`}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Generate Roadmap
            </>
          )}
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-grow bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner">
        {status === 'loading' && <LoadingScreen />}
        <RoadmapCanvas />
      </div>
    </div>
  )
}

export default DashboardPage
