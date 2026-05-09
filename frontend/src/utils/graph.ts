import type { Edge, Node } from 'reactflow'
import { MarkerType } from 'reactflow'
import type { Roadmap, Subtopic } from '../types/roadmap'

const MAIN_NODE_WIDTH = 250
const MAIN_NODE_HEIGHT = 60
const SUB_NODE_WIDTH = 260
const SUB_NODE_HEIGHT = 65

const VERTICAL_SPACING = 150
const HORIZONTAL_OFFSET = 320
const SUBTOPIC_VERTICAL_SPACING = 90

export const generateGraph = (roadmap: Roadmap, expanded: Record<string, boolean>) => {
  const nodes: Node[] = []
  const edges: Edge[] = []

  let currentY = 0

  const allTopics = roadmap.stages.flatMap(stage => stage.topics.map(topic => {
    // LLMs sometimes rename 'subtopics' to 'topics' inside the JSON
    const actualSubtopics = topic.subtopics || (topic as any).topics || []
    return { ...topic, subtopics: actualSubtopics, stageOrder: stage.order }
  }))

  allTopics.forEach((topic, topicIndex) => {
    const isRightBranch = topicIndex % 2 === 0

    nodes.push({
      id: topic.id,
      type: 'customNode',
      data: {
        label: topic.title,
        description: topic.description,
        hasSubtopics: topic.subtopics && topic.subtopics.length > 0,
        isExpanded: !!expanded[topic.id],
        isMain: true,
      },
      position: { x: -MAIN_NODE_WIDTH / 2, y: currentY },
    })

    if (topicIndex > 0) {
      const prevTopic = allTopics[topicIndex - 1]
      edges.push({
        id: `e-${prevTopic.id}-${topic.id}`,
        source: prevTopic.id,
        target: topic.id,
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'smoothstep',
        animated: false,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6', width: 20, height: 20 },
        style: { stroke: '#3b82f6', strokeWidth: 3 }
      })
    }

    let maxSubY = currentY

    const layoutSubtopics = (subs: Subtopic[], parentId: string, isRight: boolean, depth: number, startY: number): number => {
      let localMaxY = startY

      subs.forEach((sub, subIdx) => {
        const subY = localMaxY + (subIdx === 0 ? 0 : SUBTOPIC_VERTICAL_SPACING)
        const subX = isRight 
          ? HORIZONTAL_OFFSET + ((depth - 1) * (SUB_NODE_WIDTH + 40))
          : -HORIZONTAL_OFFSET - ((depth - 1) * (SUB_NODE_WIDTH + 40))

        const actualNestedSubtopics = sub.subtopics || (sub as any).topics || []

        nodes.push({
          id: sub.id,
          type: 'subtopicNode',
          data: {
            label: sub.title,
            description: sub.description,
            hasSubtopics: actualNestedSubtopics.length > 0,
            isExpanded: !!expanded[sub.id],
            branchDir: isRight ? 1 : -1
          },
          // Adjust X to perfectly center the React Flow node around the calculated point
          position: { x: subX - SUB_NODE_WIDTH / 2, y: subY }
        })

        edges.push({
          id: `e-${parentId}-${sub.id}`,
          source: parentId,
          target: sub.id,
          sourceHandle: isRight ? 'right' : 'left',
          targetHandle: isRight ? 'left' : 'right',
          type: 'smoothstep',
          animated: false,
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
          style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' }
        })

        localMaxY = subY

        if (expanded[sub.id] && actualNestedSubtopics.length > 0) {
          localMaxY = layoutSubtopics(actualNestedSubtopics, sub.id, isRight, depth + 1, localMaxY)
        }
      })

      return localMaxY
    }

    if (expanded[topic.id] && topic.subtopics && topic.subtopics.length > 0) {
      maxSubY = layoutSubtopics(topic.subtopics, topic.id, isRightBranch, 1, currentY)
    }

    currentY = Math.max(currentY + VERTICAL_SPACING, maxSubY + VERTICAL_SPACING)
  })

  return { nodes, edges }
}
