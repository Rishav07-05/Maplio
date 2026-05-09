import React, { useEffect, useCallback, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel
} from 'reactflow'
import type { NodeMouseHandler } from 'reactflow'
import 'reactflow/dist/style.css'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../redux/store'
import { generateGraph } from '../utils/graph'
import { toggleExpanded } from '../redux/graphSlice'
import { CustomNode, SubtopicNode } from './CustomNode'
import { Map, Info } from 'lucide-react'

const RoadmapCanvas: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const roadmapData = useSelector((state: RootState) => state.roadmap.data)
  const expanded = useSelector((state: RootState) => state.graph.expanded)

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const nodeTypes = useMemo(() => ({
    customNode: CustomNode,
    subtopicNode: SubtopicNode
  }), [])

  // Regenerate graph whenever roadmapData or expanded state changes
  useEffect(() => {
    if (roadmapData && roadmapData.stages) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = generateGraph(roadmapData, expanded)
      setNodes(layoutedNodes)
      setEdges(layoutedEdges)
    }
  }, [roadmapData, expanded, setNodes, setEdges])

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if ((node.type === 'customNode' || node.type === 'subtopicNode') && node.data.hasSubtopics) {
        dispatch(toggleExpanded(node.id))
      }
    },
    [dispatch]
  )

  if (!roadmapData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
          <Map className="w-8 h-8 text-slate-300" />
        </div>
        <p className="font-medium text-slate-500">Your roadmap will appear here.</p>
        <p className="text-sm mt-1">Enter your goal and click Generate.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={1.5}
        className="bg-white"
      >
        <Background color="#cbd5e1" gap={24} size={1} />
        <Controls className="bg-white shadow-md border-black border-2 rounded-md overflow-hidden [&>button]:border-b-2 [&>button]:border-black" />
        <MiniMap 
          className="bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] border-[2px] border-black rounded-md"
          nodeColor={(n) => {
            if (n.type === 'customNode') return '#ffe818'
            if (n.type === 'subtopicNode') return '#ffdfa0'
            return '#cbd5e1'
          }}
        />
        <Panel position="top-left" className="bg-white/80 backdrop-blur border border-slate-200 p-3 rounded-xl shadow-sm max-w-sm">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-indigo-500 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-800">{roadmapData.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{roadmapData.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded bg-indigo-50 text-indigo-600">
                  {roadmapData.level}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded bg-slate-100 text-slate-600">
                  {roadmapData.estimated_duration}
                </span>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default RoadmapCanvas
