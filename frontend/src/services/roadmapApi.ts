import type { Roadmap, RoadmapRequest } from '../types/roadmap'

export const generateRoadmap = async (payload: RoadmapRequest): Promise<Roadmap> => {
  const response = await fetch('http://localhost:5000/generate-roadmap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to generate roadmap')
  }

  return response.json()
}
