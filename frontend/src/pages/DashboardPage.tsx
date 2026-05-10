import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../redux/store'
import {
  requestRoadmap,
  updateNodeMeta,
  undoNodeMeta,
  redoNodeMeta,
  setRoadmapId,
  setGoal,
  setRoadmap
} from '../redux/roadmapSlice'
import { loadHistory } from '../redux/historySlice'
import { setSearchQuery } from '../redux/uiSlice'
import RoadmapCanvas from '../components/RoadmapCanvas'
import LoadingScreen from '../components/LoadingScreen'
import { Play, Loader2, Save, History, Search, Undo2, Redo2, Share2, FileDown } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import { createHistory, updateHistory, fetchRoadmapById, publishHistory } from '../services/historyApi'
import type { NodeMeta } from '../types/roadmap'
import { toPng } from 'html-to-image'

const LEVELS = [
  'School',
  'Beginner',
  'Intermediate',
  'Advanced',
  'College Level',
  'Industry Ready'
]

const TEMPLATES = [
  { label: 'Frontend Engineer', goal: 'Become a frontend engineer with React, TypeScript, and modern tooling' },
  { label: 'Data Analyst', goal: 'Learn data analysis with SQL, Python, and visualization tools' },
  { label: 'Mobile Apps', goal: 'Build mobile apps with React Native and backend integrations' },
  { label: 'AI Engineer', goal: 'Learn AI engineering with ML fundamentals, LLMs, and deployment' },
  { label: 'Backend Systems', goal: 'Master backend development with APIs, databases, and scaling' },
  { label: 'Product Design', goal: 'Become a product designer with UX research, UI, and prototyping' }
]

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const status = useSelector((state: RootState) => state.roadmap.status)
  const roadmapError = useSelector((state: RootState) => state.roadmap.error)
  const roadmap = useSelector((state: RootState) => state.roadmap.data)
  const roadmapId = useSelector((state: RootState) => state.roadmap.roadmapId)
  const nodeMeta = useSelector((state: RootState) => state.roadmap.nodeMeta)
  const historyItems = useSelector((state: RootState) => state.history.items)
  const historyStatus = useSelector((state: RootState) => state.history.status)
  const historyError = useSelector((state: RootState) => state.history.error)
  const selectedNodeId = useSelector((state: RootState) => state.ui.selectedNodeId)
  const searchQuery = useSelector((state: RootState) => state.ui.searchQuery)
  const { getToken } = useAuth()
  const canvasRef = useRef<HTMLDivElement | null>(null)
  
  const [goal, setGoalInput] = useState('')
  const [level, setLevel] = useState('Beginner')
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleGenerate = () => {
    if (!goal.trim()) return
    dispatch(setGoal(goal))
    dispatch(requestRoadmap({ goal, level }))
  }

  useEffect(() => {
    const load = async () => {
      const token = await getToken()
      if (!token) return
      dispatch(loadHistory({ token }))
    }
    void load()
  }, [dispatch, getToken])

  const selectedMeta = useMemo(() => {
    if (!selectedNodeId) return null
    return nodeMeta[selectedNodeId] || {}
  }, [nodeMeta, selectedNodeId])

  const safeHistoryItems = Array.isArray(historyItems) ? historyItems : []

  const handleSave = async () => {
    if (!roadmap) return
    setSaveStatus('saving')
    setErrorMessage(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Authentication required')

      if (roadmapId) {
        const updated = await updateHistory(
          roadmapId,
          {
            roadmap,
            goal: goal || roadmap.title,
            nodeMeta
          },
          token
        )
        dispatch(setRoadmapId(updated._id))
      } else {
        const created = await createHistory(
          {
            roadmap,
            goal: goal || roadmap.title,
            nodeMeta
          },
          token
        )
        dispatch(setRoadmapId(created._id))
      }

      await dispatch(loadHistory({ token }))
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 1500)
    } catch (error) {
      setSaveStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Save failed')
    }
  }

  const handleOpenHistory = async (id: string) => {
    setErrorMessage(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Authentication required')
      const full = await fetchRoadmapById(id, token)
      dispatch(setRoadmap(full))
      setGoalInput(full.goal)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load roadmap')
    }
  }

  const handlePublish = async () => {
    if (!roadmapId) return
    setErrorMessage(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Authentication required')
      const updated = await publishHistory(roadmapId, token)
      dispatch(setRoadmapId(updated._id))
      await dispatch(loadHistory({ token }))
      if (updated.shareId) {
        await navigator.clipboard.writeText(`${window.location.origin}/shared/${updated.shareId}`)
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Publish failed')
    }
  }

  const handleExportJson = () => {
    if (!roadmap) return
    const blob = new Blob([
      JSON.stringify({ roadmap, nodeMeta, goal }, null, 2)
    ], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${roadmap.title.replace(/\s+/g, '-').toLowerCase()}-roadmap.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPng = async () => {
    if (!canvasRef.current) return
    try {
      const dataUrl = await toPng(canvasRef.current, { cacheBust: true, pixelRatio: 2 })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'maplio-roadmap.png'
      link.click()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Export failed')
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full gap-4 relative">
      {/* Left Sidebar Control Panel */}
      <div className="w-full md:w-96 flex-shrink-0 maplio-card rounded-2xl p-5 flex flex-col gap-5 relative z-10">
        <div className="flex items-center gap-2 maplio-tab-wrap p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'create' ? 'maplio-tab-active' : 'text-slate-500'
            }`}
          >
            Create
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'history' ? 'maplio-tab-active' : 'text-slate-500'
            }`}
          >
            History
          </button>
        </div>

        {activeTab === 'create' ? (
          <>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Create Roadmap</h2>
              <p className="text-sm text-slate-500">Define your learning objective.</p>
            </div>

            <div className="space-y-4 flex-grow">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">What do you want to learn?</label>
                <textarea
                  className="maplio-input w-full p-3 rounded-xl outline-none resize-none transition-all"
                  rows={4}
                  placeholder="e.g. Become a Full Stack Developer, Learn Machine Learning..."
                  value={goal}
                  onChange={(e) => setGoalInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Your Current Level</label>
                <select
                  className="maplio-input w-full p-3 rounded-xl outline-none transition-all"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  {LEVELS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Start from a template</label>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.label}
                      onClick={() => setGoalInput(template.goal)}
                      className="maplio-chip px-3 py-1.5 text-xs font-semibold rounded-full transition"
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={status === 'loading' || !goal.trim()}
              className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all
                ${status === 'loading' || !goal.trim() 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'maplio-primary shadow-md'
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
          </>
        ) : (
          <div className="flex flex-col gap-3 flex-grow">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">History</h2>
              <p className="text-sm text-slate-500">Open your saved roadmaps anytime.</p>
            </div>
            <div className="flex flex-col gap-3 overflow-auto flex-grow pr-1">
              {historyStatus === 'loading' && (
                <div className="text-sm text-slate-500">Loading history...</div>
              )}
              {historyError && (
                <div className="maplio-alert text-sm p-3 rounded-xl">
                  {historyError}
                </div>
              )}
              {historyStatus !== 'loading' && safeHistoryItems.length === 0 && !historyError && (
                <div className="text-sm text-slate-500">No saved roadmaps yet.</div>
              )}
              {safeHistoryItems.map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleOpenHistory(item._id)}
                  className="maplio-list-item p-3 rounded-xl text-left transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-800">
                      {item.roadmap?.title || item.goal}
                    </div>
                    <History className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSave}
            disabled={!roadmap || saveStatus === 'saving'}
            className="maplio-button-outline flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saveStatus === 'saving' ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handlePublish}
            disabled={!roadmapId}
            className="maplio-button-outline flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportJson}
            disabled={!roadmap}
            className="maplio-button-outline flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            Export JSON
          </button>
          <button
            onClick={handleExportPng}
            disabled={!roadmap}
            className="maplio-button-outline flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            Export PNG
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(undoNodeMeta())}
            className="maplio-button-outline flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition"
          >
            <Undo2 className="w-4 h-4" />
            Undo
          </button>
          <button
            onClick={() => dispatch(redoNodeMeta())}
            className="maplio-button-outline flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition"
          >
            <Redo2 className="w-4 h-4" />
            Redo
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Search Nodes</label>
          <div className="maplio-input mt-2 flex items-center gap-2 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search roadmap"
              className="w-full text-sm outline-none bg-transparent"
            />
          </div>
        </div>

        {(errorMessage || roadmapError) && (
          <div className="maplio-alert text-sm p-3 rounded-xl">
            {errorMessage || roadmapError}
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div ref={canvasRef} className="flex-grow rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner maplio-card">
        {status === 'loading' && <LoadingScreen />}
        <RoadmapCanvas />
      </div>

      <div className="hidden lg:flex w-80 flex-shrink-0 maplio-card rounded-2xl p-5 flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Node Details</h3>
          <p className="text-xs text-slate-500">Select a node to edit its title, status, and notes.</p>
        </div>
        {!selectedNodeId ? (
          <div className="text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl p-4">
            Click any node on the canvas to edit its details.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</label>
              <input
                value={selectedMeta?.title || ''}
                onChange={(e) => dispatch(updateNodeMeta({ nodeId: selectedNodeId, meta: { title: e.target.value } }))}
                placeholder="Custom title"
                className="maplio-input w-full rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
              <textarea
                value={selectedMeta?.description || ''}
                onChange={(e) => dispatch(updateNodeMeta({ nodeId: selectedNodeId, meta: { description: e.target.value } }))}
                placeholder="Notes for this node"
                className="maplio-input w-full rounded-lg px-3 py-2 text-sm"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tags</label>
              <input
                value={(selectedMeta?.tags || []).join(', ')}
                onChange={(e) => {
                  const tags = e.target.value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
                  dispatch(updateNodeMeta({ nodeId: selectedNodeId, meta: { tags } }))
                }}
                placeholder="design, api, practice"
                className="maplio-input w-full rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</label>
              <select
                value={selectedMeta?.status || 'todo'}
                onChange={(e) => dispatch(updateNodeMeta({ nodeId: selectedNodeId, meta: { status: e.target.value as NodeMeta['status'] } }))}
                className="maplio-input w-full rounded-lg px-3 py-2 text-sm"
              >
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Link</label>
              <input
                value={selectedMeta?.link || ''}
                onChange={(e) => dispatch(updateNodeMeta({ nodeId: selectedNodeId, meta: { link: e.target.value } }))}
                placeholder="https://..."
                className="maplio-input w-full rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</label>
              <textarea
                value={selectedMeta?.notes || ''}
                onChange={(e) => dispatch(updateNodeMeta({ nodeId: selectedNodeId, meta: { notes: e.target.value } }))}
                placeholder="Extra context"
                className="maplio-input w-full rounded-lg px-3 py-2 text-sm"
                rows={4}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
