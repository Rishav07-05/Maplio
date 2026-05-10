import type { Roadmap, RoadmapRequest } from '../types/roadmap'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const generateRoadmap = async (payload: RoadmapRequest): Promise<Roadmap> => {
  const response = await fetch(`${API_BASE_URL}/generate-roadmap`, {
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
