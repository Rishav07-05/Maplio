import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RoadmapHistorySummary } from '../types/roadmap'
import { fetchHistory } from '../services/historyApi'

type HistoryState = {
  items: RoadmapHistorySummary[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: HistoryState = {
  items: [],
  status: 'idle',
  error: null
}

export const loadHistory = createAsyncThunk<
  RoadmapHistorySummary[],
  { token: string },
  { rejectValue: string }
>('history/load', async ({ token }, { rejectWithValue }) => {
  try {
    return await fetchHistory(token)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return rejectWithValue(message)
  }
})

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    clearHistory(state) {
      state.items = []
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadHistory.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadHistory.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadHistory.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Failed to load history'
      })
  }
})

export const { clearHistory } = historySlice.actions
export default historySlice.reducer
