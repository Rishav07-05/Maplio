import { Router } from 'express'

import { requireUser } from '../middleware/requireUser'
import {
  listRoadmaps,
  createRoadmap,
  getRoadmap,
  updateRoadmap,
  deleteRoadmap,
  publishRoadmap,
  getPublicRoadmap
} from '../controllers/historyController'

const router = Router()

router.get('/public/roadmaps/:shareId', getPublicRoadmap)

router.use('/roadmaps', requireUser)

router.get('/roadmaps', listRoadmaps as any)
router.post('/roadmaps', createRoadmap as any)
router.get('/roadmaps/:id', getRoadmap as any)
router.put('/roadmaps/:id', updateRoadmap as any)
router.delete('/roadmaps/:id', deleteRoadmap as any)
router.post('/roadmaps/:id/publish', publishRoadmap as any)

export default router
