import React, { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { CheckCircle2 } from 'lucide-react'

export const CustomNode = memo(({ data, isConnectable }: any) => {
  return (
    <div className="bg-[#ffe818] rounded-md shadow-[4px_4px_0px_rgba(0,0,0,1)] border-[3px] border-black min-w-[200px] max-w-[280px] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group">
      {/* Top Handle for Spine */}
      <Handle type="target" position={Position.Top} id="top" isConnectable={isConnectable} className="w-2 h-2 bg-blue-500 border-none rounded-full" />
      
      <div className="px-4 py-3 text-center relative">
        <h3 className="font-bold text-black text-sm">{data.label}</h3>
        
        {data.hasSubtopics && (
          <div className="mt-2 flex justify-center">
            <span className="text-[10px] font-bold text-black border border-black px-2 py-0.5 rounded bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
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

  return (
    <div className="bg-[#ffdfa0] rounded-md shadow-[3px_3px_0px_rgba(0,0,0,1)] border-[2px] border-black w-[260px] p-2 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all flex items-start justify-between relative group cursor-pointer">
      <Handle 
        type="target" 
        position={isRight ? Position.Left : Position.Right} 
        id={isRight ? 'left' : 'right'} 
        isConnectable={isConnectable} 
        className="w-1.5 h-1.5 bg-blue-400 border-none rounded-full top-1/2" 
      />

      <div className="flex flex-col gap-1 w-full pl-1 pr-6">
        <h4 className="font-semibold text-black text-xs leading-tight">{data.label}</h4>
        {data.description && (
          <p className="text-[10px] text-black/75 font-medium leading-snug line-clamp-2">
            {data.description}
          </p>
        )}
        {data.hasSubtopics && (
          <div className="mt-1 flex justify-start">
            <span className="text-[9px] font-bold text-black border border-black px-1.5 py-0.5 rounded bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
              {data.isExpanded ? 'Hide Details' : 'View Details'}
            </span>
          </div>
        )}
      </div>
      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 absolute right-2 top-2" />

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
