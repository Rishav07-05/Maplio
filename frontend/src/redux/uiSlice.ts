import { createSlice } from '@reduxjs/toolkit'

type UiState = {
  theme: 'light' | 'dark'
  searchQuery: string
  selectedNodeId: string | null
}

const initialState: UiState = {
  theme: 'light',
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
      state.selectedNodeId = action.payload
    },
  },
})

export const { setTheme, setSearchQuery, setSelectedNode } = uiSlice.actions
export default uiSlice.reducer
