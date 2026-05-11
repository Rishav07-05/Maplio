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
  const [roadmapTitle, setRoadmapTitle] = useState<string>('Shared Roadmap')

  useEffect(() => {
    const load = async () => {
      if (!shareId) return
      try {
        const doc = await fetchPublicRoadmap(shareId)
        console.log(doc)
        console.log(doc.roadmap)
        dispatch(setRoadmap(doc.roadmap))
        setRoadmapTitle(doc.goal || doc.roadmap?.title || 'Shared Roadmap')
        setStatus('ready')
      } catch (error) {
        setStatus('error')
      }
    }
    void load()
  }, [dispatch, shareId])

  return (
    <div className="min-h-screen maplio-shared-shell flex flex-col font-sans">
      <header className="maplio-shared-header h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 transition-opacity hover:opacity-80">
          <div className="maplio-brand-mark maplio-brand-mark--sm">
            <Map className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-extrabold maplio-brand-text tracking-tight hidden sm:block">Maplio</h1>
        </Link>
        <div className="flex-grow flex justify-center px-4">
          <div className="text-sm sm:text-base font-semibold maplio-shared-title truncate max-w-[200px] sm:max-w-md">
            {roadmapTitle}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium maplio-shared-badge px-3 py-1.5 rounded-full">
          Public View
        </div>
      </header>

      <main className="flex-grow p-3 sm:p-4 md:p-6 flex flex-col">
        {status === 'loading' && (
          <div className="flex-grow flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 rounded-full animate-spin maplio-loader"></div>
              <p className="text-sm font-medium text-muted animate-pulse">Loading shared roadmap...</p>
            </div>
          </div>
        )}
        {status === 'error' && (
          <div className="flex-grow flex items-center justify-center">
            <div className="maplio-card maplio-alert rounded-2xl p-6 text-center max-w-sm">
              <h3 className="text-lg font-bold mb-2">Roadmap Not Found</h3>
              <p className="text-sm mb-4">The link might be broken or the roadmap is no longer public.</p>
              <Link to="/" className="inline-flex items-center justify-center maplio-button-outline font-semibold text-sm px-4 py-2 rounded-xl transition">
                Create Your Own
              </Link>
            </div>
          </div>
        )}
        {status === 'ready' && (
          <div className="flex-grow w-full rounded-2xl overflow-hidden min-h-[500px] maplio-canvas-shell">
            <RoadmapCanvas />
          </div>
        )}
      </main>
    </div>
  )
}

export default SharedRoadmapPage
