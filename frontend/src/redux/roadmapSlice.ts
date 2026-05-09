import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { generateRoadmap } from '../services/roadmapApi'
import type { Roadmap, RoadmapRequest } from '../types/roadmap'

type RoadmapState = {
  data: Roadmap | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: RoadmapState = {
  data: null,
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
      state.data = action.payload
      state.status = 'succeeded'
      state.error = null
    },
    clearRoadmap(state) {
      state.data = null
      state.status = 'idle'
      state.error = null
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
      })
      .addCase(requestRoadmap.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Failed to load roadmap'
      })
  },
})

export const { hydrateRoadmap, clearRoadmap } = roadmapSlice.actions
export default roadmapSlice.reducer
