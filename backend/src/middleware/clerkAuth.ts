import { Request, Response, NextFunction } from 'express'
import { getAuth } from '@clerk/express'

export const clerkAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req)

  console.log('[AUTH]', auth)

  if (!auth.userId) {
    return res.status(401).json({
      error: 'Unauthorized'
    })
  }

  next()
}