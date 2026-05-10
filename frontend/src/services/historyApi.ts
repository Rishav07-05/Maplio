import type { Roadmap, RoadmapHistoryItem, RoadmapHistorySummary, NodeMeta } from '../types/roadmap'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const authHeaders = async (token?: string) => {
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

export const fetchHistory = async (token: string): Promise<RoadmapHistorySummary[]> => {
  const response = await fetch(`${API_BASE_URL}/roadmaps`, {
    headers: {
      ...(await authHeaders(token))
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to load history')
  }

  return response.json()
}

export const fetchRoadmapById = async (id: string, token: string): Promise<RoadmapHistoryItem> => {
  const response = await fetch(`${API_BASE_URL}/roadmaps/${id}`, {
    headers: {
      ...(await authHeaders(token))
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to load roadmap')
  }

  return response.json()
}

export const createHistory = async (payload: {
  roadmap: Roadmap
  goal: string
  name?: string
  nodeMeta?: Record<string, NodeMeta>
  isPublic?: boolean
}, token: string): Promise<RoadmapHistoryItem> => {
  const response = await fetch(`${API_BASE_URL}/roadmaps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeaders(token))
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to save roadmap')
  }

  return response.json()
}

export const updateHistory = async (id: string, payload: {
  roadmap?: Roadmap
  goal?: string
  name?: string
  nodeMeta?: Record<string, NodeMeta>
  isPublic?: boolean
}, token: string): Promise<RoadmapHistoryItem> => {
  const response = await fetch(`${API_BASE_URL}/roadmaps/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeaders(token))
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to update roadmap')
  }

  return response.json()
}

export const deleteHistory = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/roadmaps/${id}`, {
    method: 'DELETE',
    headers: {
      ...(await authHeaders(token))
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to delete roadmap')
  }
}

export const publishHistory = async (id: string, token: string): Promise<RoadmapHistoryItem> => {
  const response = await fetch(`${API_BASE_URL}/roadmaps/${id}/publish`, {
    method: 'POST',
    headers: {
      ...(await authHeaders(token))
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to publish roadmap')
  }

  return response.json()
}

export const fetchPublicRoadmap = async (shareId: string): Promise<RoadmapHistoryItem> => {
  const response = await fetch(`${API_BASE_URL}/public/roadmaps/${shareId}`)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to load shared roadmap')
  }

  return response.json()
}
