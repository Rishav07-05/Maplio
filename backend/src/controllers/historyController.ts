import type { Response } from 'express'
import crypto from 'crypto'
import { RoadmapHistory } from '../models/RoadmapHistory'
import type { Request } from 'express'
import type { AuthedRequest } from '../middleware/requireUser'

const createShareId = () => crypto.randomBytes(10).toString('hex')

export const listRoadmaps = async (req: AuthedRequest, res: Response) => {
  try {
    const items = await RoadmapHistory.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .select('goal name isPublic shareId createdAt updatedAt roadmap.title roadmap.level roadmap.estimated_duration')
      .lean()

    return res.status(200).json(items)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ error: message })
  }
}

export const createRoadmap = async (req: AuthedRequest, res: Response) => {
  try {
    const { roadmap, goal, name, nodeMeta, isPublic } = req.body as {
      roadmap?: unknown
      goal?: string
      name?: string
      nodeMeta?: Record<string, unknown>
      isPublic?: boolean
    }

    if (!roadmap || !goal) {
      return res.status(400).json({ error: 'roadmap and goal are required' })
    }

    const doc = await RoadmapHistory.create({
      userId: req.userId,
      roadmap,
      goal,
      name,
      nodeMeta: nodeMeta || {},
      isPublic: !!isPublic,
      shareId: isPublic ? createShareId() : undefined
    })

    return res.status(201).json(doc)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ error: message })
  }
}

export const getRoadmap = async (req: AuthedRequest, res: Response) => {
  try {
    const { id } = req.params
    const doc = await RoadmapHistory.findOne({ _id: id, userId: req.userId }).lean()

    if (!doc) {
      return res.status(404).json({ error: 'Roadmap not found' })
    }

    return res.status(200).json(doc)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ error: message })
  }
}

export const updateRoadmap = async (req: AuthedRequest, res: Response) => {
  try {
    const { id } = req.params
    const { roadmap, goal, name, nodeMeta, isPublic } = req.body as {
      roadmap?: unknown
      goal?: string
      name?: string
      nodeMeta?: Record<string, unknown>
      isPublic?: boolean
    }

    const update: Record<string, unknown> = {}
    if (roadmap) update.roadmap = roadmap
    if (goal) update.goal = goal
    if (typeof name === 'string') update.name = name
    if (nodeMeta) update.nodeMeta = nodeMeta
    if (typeof isPublic === 'boolean') {
      update.isPublic = isPublic
      if (isPublic) {
        const existing = (await RoadmapHistory.findOne({ _id: id, userId: req.userId })
          .select('shareId')
          .lean()) as { shareId?: string } | null
        update.shareId = existing?.shareId || createShareId()
      } else {
        update.shareId = undefined
      }
    }

    const doc = await RoadmapHistory.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $set: update },
      { new: true }
    ).lean()

    if (!doc) {
      return res.status(404).json({ error: 'Roadmap not found' })
    }

    return res.status(200).json(doc)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ error: message })
  }
}

export const deleteRoadmap = async (req: AuthedRequest, res: Response) => {
  try {
    const { id } = req.params
    const doc = await RoadmapHistory.findOneAndDelete({ _id: id, userId: req.userId }).lean()

    if (!doc) {
      return res.status(404).json({ error: 'Roadmap not found' })
    }

    return res.status(204).send()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ error: message })
  }
}

export const publishRoadmap = async (req: AuthedRequest, res: Response) => {
  try {
    const { id } = req.params
    const existing = (await RoadmapHistory.findOne({ _id: id, userId: req.userId })
      .select('shareId')
      .lean()) as { shareId?: string } | null
    const doc = await RoadmapHistory.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $set: { isPublic: true, shareId: existing?.shareId || createShareId() } },
      { new: true }
    ).lean()

    if (!doc) {
      return res.status(404).json({ error: 'Roadmap not found' })
    }

    return res.status(200).json(doc)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ error: message })
  }
}

export const getPublicRoadmap = async (req: Request, res: Response) => {
  try {
    const { shareId } = req.params
    const doc = await RoadmapHistory.findOne({ shareId, isPublic: true })
      .select('-userId')
      .lean()

    if (!doc) {
      return res.status(404).json({ error: 'Roadmap not found' })
    }

    return res.status(200).json(doc)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ error: message })
  }
}
