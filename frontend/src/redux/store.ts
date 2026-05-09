import { configureStore } from '@reduxjs/toolkit'
import roadmapReducer from './roadmapSlice'
import graphReducer from './graphSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    roadmap: roadmapReducer,
    graph: graphReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
