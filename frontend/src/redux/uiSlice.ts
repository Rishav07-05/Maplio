import { createSlice } from '@reduxjs/toolkit'

type UiState = {
  theme: 'light' | 'dark'
  searchQuery: string
  selectedNodeId: string | null
}

const getInitialTheme = (): UiState['theme'] => {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('maplio-theme')
  if (stored === 'light' || stored === 'dark') return stored
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

const initialState: UiState = {
  theme: getInitialTheme(),
  searchQuery: '',
  selectedNodeId: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload
    },
    setSelectedNode(state, action) {
      state.selectedNodeId = action.payload as string | null
    },
  },
})

export const { setTheme, setSearchQuery, setSelectedNode } = uiSlice.actions
export default uiSlice.reducer
