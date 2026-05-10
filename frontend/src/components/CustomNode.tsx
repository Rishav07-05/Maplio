import React, { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { CheckCircle2 } from 'lucide-react'

export const CustomNode = memo(({ data, isConnectable }: any) => {
  const tags = Array.isArray(data.tags) ? data.tags : []
  const status = data.status as string | undefined
  const statusColor =
    status === 'done'
      ? 'bg-emerald-500'
      : status === 'in-progress'
        ? 'bg-blue-500'
        : 'bg-slate-400'
  return (
    <div className="maplio-node maplio-node-main rounded-md shadow-[4px_4px_0px_rgba(0,0,0,1)] border-[3px] min-w-[200px] max-w-[280px] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group">
      {/* Top Handle for Spine */}
      <Handle type="target" position={Position.Top} id="top" isConnectable={isConnectable} className="w-2 h-2 bg-blue-500 border-none rounded-full" />
      
      <div className="px-4 py-3 text-center relative">
        <span className={`absolute -top-2 right-2 w-3 h-3 border-2 border-black rounded-full ${statusColor}`} />
        <h3 className="maplio-node-text font-bold text-sm">{data.label}</h3>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {tags.slice(0, 3).map((tag: string) => (
              <span key={tag} className="maplio-node-chip text-[9px] font-bold border px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {data.hasSubtopics && (
          <div className="mt-2 flex justify-center">
            <span className="maplio-node-chip-ghost text-[10px] font-bold border px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {data.isExpanded ? 'Hide Details' : 'View Details'}
            </span>
          </div>
        )}
      </div>

      {/* Left Handle for Branching Left */}
      <Handle type="source" position={Position.Left} id="left" isConnectable={isConnectable} className="w-2 h-2 bg-blue-500 border-none rounded-full" />
      {/* Right Handle for Branching Right */}
      <Handle type="source" position={Position.Right} id="right" isConnectable={isConnectable} className="w-2 h-2 bg-blue-500 border-none rounded-full" />
      
      {/* Bottom Handle for Spine */}
      <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={isConnectable} className="w-2 h-2 bg-blue-500 border-none rounded-full" />
    </div>
  )
})

export const SubtopicNode = memo(({ data, isConnectable }: any) => {
  const isRight = data.branchDir === 1
  const tags = Array.isArray(data.tags) ? data.tags : []
  const status = data.status as string | undefined
  const statusColor =
    status === 'done'
      ? 'bg-emerald-500'
      : status === 'in-progress'
        ? 'bg-blue-500'
        : 'bg-slate-400'

  return (
    <div className="maplio-node maplio-node-sub rounded-md shadow-[3px_3px_0px_rgba(0,0,0,1)] border-[2px] w-[260px] p-2 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all flex items-start justify-between relative group cursor-pointer">
      <Handle 
        type="target" 
        position={isRight ? Position.Left : Position.Right} 
        id={isRight ? 'left' : 'right'} 
        isConnectable={isConnectable} 
        className="w-1.5 h-1.5 bg-blue-400 border-none rounded-full top-1/2" 
      />

      <div className="flex flex-col gap-1 w-full pl-1 pr-6">
        <h4 className="maplio-node-text font-semibold text-xs leading-tight">{data.label}</h4>
        {data.description && (
          <p className="maplio-node-subtext text-[10px] font-medium leading-snug line-clamp-2">
            {data.description}
          </p>
        )}
        {tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag: string) => (
              <span key={tag} className="maplio-node-chip text-[9px] font-bold border px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        {data.hasSubtopics && (
          <div className="mt-1 flex justify-start">
            <span className="maplio-node-chip-ghost text-[9px] font-bold border px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {data.isExpanded ? 'Hide Details' : 'View Details'}
            </span>
          </div>
        )}
      </div>
      <div className="absolute right-2 top-2 flex items-center gap-1">
        <span className={`w-2.5 h-2.5 border border-black rounded-full ${statusColor}`} />
        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
      </div>

      <Handle 
        type="source" 
        position={isRight ? Position.Right : Position.Left} 
        id={isRight ? 'right' : 'left'} 
        isConnectable={isConnectable} 
        className="w-1.5 h-1.5 bg-blue-400 border-none rounded-full top-1/2 opacity-0 group-hover:opacity-100 transition-opacity" 
      />
    </div>
  )
})
