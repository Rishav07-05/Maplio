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
