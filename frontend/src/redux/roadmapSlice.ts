import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { generateRoadmap } from '../services/roadmapApi'
import type { Roadmap, RoadmapRequest, NodeMeta, RoadmapHistoryItem } from '../types/roadmap'

type RoadmapState = {
  data: Roadmap | null
  roadmapId: string | null
  goal: string | null
  nodeMeta: Record<string, NodeMeta>
  undoStack: Record<string, NodeMeta>[]
  redoStack: Record<string, NodeMeta>[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: RoadmapState = {
  data: null,
  roadmapId: null,
  goal: null,
  nodeMeta: {},
  undoStack: [],
  redoStack: [],
  status: 'idle',
  error: null,
}

export const requestRoadmap = createAsyncThunk<
  Roadmap,
  RoadmapRequest,
  { rejectValue: string }
>('roadmap/requestRoadmap', async (payload, { rejectWithValue }) => {
  try {
    return await generateRoadmap(payload)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return rejectWithValue(message)
  }
})

const roadmapSlice = createSlice({
  name: 'roadmap',
  initialState,
  reducers: {
    hydrateRoadmap(state, action) {
      const payload = action.payload as RoadmapHistoryItem
      state.data = payload.roadmap
      state.roadmapId = payload._id
      state.goal = payload.goal
      state.nodeMeta = payload.nodeMeta || {}
      state.undoStack = []
      state.redoStack = []
      state.status = 'succeeded'
      state.error = null
    },
    setRoadmap(state, action) {
      const payload = action.payload as RoadmapHistoryItem & { roadmapId?: string }
      state.data = payload.roadmap
      state.goal = payload.goal
      state.roadmapId = payload.roadmapId || payload._id || null
      state.nodeMeta = payload.nodeMeta || {}
      state.undoStack = []
      state.redoStack = []
      state.status = 'succeeded'
      state.error = null
    },
    clearRoadmap(state) {
      state.data = null
      state.roadmapId = null
      state.goal = null
      state.nodeMeta = {}
      state.undoStack = []
      state.redoStack = []
      state.status = 'idle'
      state.error = null
    },
    updateNodeMeta(state, action) {
      const { nodeId, meta } = action.payload as { nodeId: string; meta: NodeMeta }
      state.undoStack.push({ ...state.nodeMeta })
      state.redoStack = []
      state.nodeMeta = {
        ...state.nodeMeta,
        [nodeId]: {
          ...state.nodeMeta[nodeId],
          ...meta
        }
      }
    },
    setNodeTags(state, action) {
      const { nodeId, tags } = action.payload as { nodeId: string; tags: string[] }
      state.undoStack.push({ ...state.nodeMeta })
      state.redoStack = []
      state.nodeMeta = {
        ...state.nodeMeta,
        [nodeId]: {
          ...state.nodeMeta[nodeId],
          tags
        }
      }
    },
    undoNodeMeta(state) {
      const prev = state.undoStack.pop()
      if (!prev) return
      state.redoStack.push({ ...state.nodeMeta })
      state.nodeMeta = prev
    },
    redoNodeMeta(state) {
      const next = state.redoStack.pop()
      if (!next) return
      state.undoStack.push({ ...state.nodeMeta })
      state.nodeMeta = next
    },
    setRoadmapId(state, action) {
      state.roadmapId = action.payload as string
    },
    setGoal(state, action) {
      state.goal = action.payload as string
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestRoadmap.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(requestRoadmap.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
        state.roadmapId = null
        state.nodeMeta = {}
        state.undoStack = []
        state.redoStack = []
      })
      .addCase(requestRoadmap.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Failed to load roadmap'
      })
  },
})

export const {
  hydrateRoadmap,
  setRoadmap,
  clearRoadmap,
  updateNodeMeta,
  setNodeTags,
  undoNodeMeta,
  redoNodeMeta,
  setRoadmapId,
  setGoal
} = roadmapSlice.actions
export default roadmapSlice.reducer
