import type { Request, Response, NextFunction } from 'express'

type AuthRequest = Request & { auth?: { userId?: string } }

export const requireUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.auth?.userId
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  ;(req as AuthRequest & { userId: string }).userId = userId
  return next()
}

export type AuthedRequest = AuthRequest & { userId: string }
