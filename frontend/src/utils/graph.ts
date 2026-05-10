import type { Edge, Node } from 'reactflow'
import { MarkerType } from 'reactflow'
import type { Roadmap, Subtopic, NodeMeta } from '../types/roadmap'

const MAIN_NODE_WIDTH = 250
const MAIN_NODE_HEIGHT = 60
const SUB_NODE_WIDTH = 260
const SUB_NODE_HEIGHT = 65

const VERTICAL_SPACING = 150
const HORIZONTAL_OFFSET = 320
const SUBTOPIC_VERTICAL_SPACING = 90

export const generateGraph = (
  roadmap: Roadmap,
  expanded: Record<string, boolean>,
  nodeMeta: Record<string, NodeMeta>,
  searchQuery: string,
  theme: 'light' | 'dark'
) => {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const hiddenIds = new Set<string>()

  const edgeColor = theme === 'dark' ? '#9bb7ff' : '#3b82f6'
  const mainEdgeStyle = { stroke: edgeColor, strokeWidth: 3, strokeDasharray: '6 6' }
  const subEdgeStyle = { stroke: edgeColor, strokeWidth: 2, strokeDasharray: '3 6' }

  let currentY = 0

  const allTopics = roadmap.stages.flatMap(stage => stage.topics.map(topic => {
    // LLMs sometimes rename 'subtopics' to 'topics' inside the JSON
    const actualSubtopics = topic.subtopics || (topic as any).topics || []
    return { ...topic, subtopics: actualSubtopics, stageOrder: stage.order }
  }))

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const matchesQuery = (label: string) => {
    if (!normalizedQuery) return true
    return label.toLowerCase().includes(normalizedQuery)
  }

  allTopics.forEach((topic, topicIndex) => {
    const isRightBranch = topicIndex % 2 === 0
    const meta = nodeMeta[topic.id]
    const title = meta?.title || topic.title
    const description = meta?.description || topic.description
    const shouldShow = matchesQuery(title)

    nodes.push({
      id: topic.id,
      type: 'customNode',
      data: {
        label: title,
        description,
        tags: meta?.tags || [],
        status: meta?.status,
        link: meta?.link,
        notes: meta?.notes,
        hasSubtopics: topic.subtopics && topic.subtopics.length > 0,
        isExpanded: !!expanded[topic.id],
        isMain: true,
      },
      hidden: !shouldShow,
      position: { x: -MAIN_NODE_WIDTH / 2, y: currentY },
    })

    if (!shouldShow) hiddenIds.add(topic.id)

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
        markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor, width: 20, height: 20 },
        style: mainEdgeStyle,
        hidden: hiddenIds.has(prevTopic.id) || hiddenIds.has(topic.id)
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

        const subMeta = nodeMeta[sub.id]
        const subTitle = subMeta?.title || sub.title
        const subDescription = subMeta?.description || sub.description
        const showSub = matchesQuery(subTitle)

        nodes.push({
          id: sub.id,
          type: 'subtopicNode',
          data: {
            label: subTitle,
            description: subDescription,
            tags: subMeta?.tags || [],
            status: subMeta?.status,
            link: subMeta?.link,
            notes: subMeta?.notes,
            hasSubtopics: actualNestedSubtopics.length > 0,
            isExpanded: !!expanded[sub.id],
            branchDir: isRight ? 1 : -1
          },
          hidden: !showSub,
          // Adjust X to perfectly center the React Flow node around the calculated point
          position: { x: subX - SUB_NODE_WIDTH / 2, y: subY }
        })

        if (!showSub) hiddenIds.add(sub.id)

        edges.push({
          id: `e-${parentId}-${sub.id}`,
          source: parentId,
          target: sub.id,
          sourceHandle: isRight ? 'right' : 'left',
          targetHandle: isRight ? 'left' : 'right',
          type: 'smoothstep',
          animated: false,
          markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor },
          style: subEdgeStyle,
          hidden: hiddenIds.has(parentId) || hiddenIds.has(sub.id)
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
