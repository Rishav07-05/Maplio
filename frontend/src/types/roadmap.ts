export type Roadmap = {
  title: string
  description: string
  level: string
  estimated_duration: string
  stages: Stage[]
}

export type Stage = {
  id: string
  title: string
  description: string
  order: number
  topics: Topic[]
}

export type Topic = {
  id: string
  title: string
  description: string
  difficulty: string
  estimated_time: string
  prerequisites: string[]
  subtopics: Subtopic[]
}

export type Subtopic = {
  id: string
  title: string
  description: string
  difficulty?: string
  estimated_time?: string
  prerequisites?: string[]
  subtopics?: Subtopic[]
}

export type RoadmapRequest = {
  goal: string
  level: string
}

export type NodeMeta = {
  title?: string
  description?: string
  tags?: string[]
  status?: 'todo' | 'in-progress' | 'done'
  link?: string
  notes?: string
}

export type RoadmapHistoryItem = {
  _id: string
  goal: string
  name?: string
  roadmap: Roadmap
  nodeMeta?: Record<string, NodeMeta>
  isPublic?: boolean
  shareId?: string
  createdAt: string
  updatedAt: string
}

export type RoadmapHistorySummary = Omit<RoadmapHistoryItem, 'roadmap' | 'nodeMeta'> & {
  roadmap: Pick<Roadmap, 'title' | 'level' | 'estimated_duration'>
}
