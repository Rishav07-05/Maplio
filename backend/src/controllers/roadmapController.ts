import { Request, Response } from 'express'
import { generateRoadmapFromAI } from '../services/openaiService'
import { safeJsonParse } from '../utils/safeJson'

export const generateRoadmap = async (req: Request, res: Response) => {
  const { goal, level } = req.body as { goal?: string; level?: string }

  if (!goal || !level) {
    return res.status(400).json({ error: 'Goal and level are required' })
  }

  try {
    const raw = await generateRoadmapFromAI(goal, level)
    const parsed = safeJsonParse(raw)
    return res.status(200).json(parsed)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ error: message })
  }
}
