import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../redux/store'
import { setRoadmap } from '../redux/roadmapSlice'
import RoadmapCanvas from '../components/RoadmapCanvas'
import { fetchPublicRoadmap } from '../services/historyApi'
import { Map } from 'lucide-react'

const SharedRoadmapPage: React.FC = () => {
  const { shareId } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const load = async () => {
      if (!shareId) return
      try {
        const doc = await fetchPublicRoadmap(shareId)
        dispatch(setRoadmap(doc))
        setStatus('ready')
      } catch (error) {
        setStatus('error')
      }
    }
    void load()
  }, [dispatch, shareId])

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Map className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Maplio</h1>
        </Link>
        <div className="text-sm text-slate-500">Shared roadmap</div>
      </header>

      <main className="flex-grow p-4 md:p-6">
        {status === 'loading' && (
          <div className="text-slate-500">Loading shared roadmap...</div>
        )}
        {status === 'error' && (
          <div className="text-slate-500">Shared roadmap not found.</div>
        )}
        {status === 'ready' && (
          <div className="h-[calc(100vh-120px)] rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
            <RoadmapCanvas />
          </div>
        )}
      </main>
    </div>
  )
}

export default SharedRoadmapPage
