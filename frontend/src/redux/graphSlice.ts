import { createSlice } from '@reduxjs/toolkit'
import type { Edge, Node } from 'reactflow'

type GraphState = {
  nodes: Node[]
  edges: Edge[]
  expanded: Record<string, boolean>
}

const initialState: GraphState = {
  nodes: [],
  edges: [],
  expanded: {},
}

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setGraph(state, action) {
      state.nodes = action.payload.nodes
      state.edges = action.payload.edges
    },
    toggleExpanded(state, action) {
      const id = action.payload
      state.expanded[id] = !state.expanded[id]
    },
    resetExpanded(state) {
      state.expanded = {}
    },
  },
})

export const { setGraph, toggleExpanded, resetExpanded } = graphSlice.actions
export default graphSlice.reducer
