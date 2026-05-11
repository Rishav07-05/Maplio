import type { Request, Response, NextFunction } from 'express'
import { getAuth } from '@clerk/express'

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req)
  console.log('[requireUser] auth header:', req.headers.authorization ? 'present' : 'missing')
  console.log('[requireUser] auth object:', auth)
  if (!auth?.userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  ;(req as any).userId = auth.userId
  return next()
}

export type AuthedRequest = Request & { userId: string }
