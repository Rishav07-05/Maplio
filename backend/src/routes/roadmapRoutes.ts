import { Router } from 'express'
import { generateRoadmap } from '../controllers/roadmapController'

const router = Router()

router.post('/generate-roadmap', generateRoadmap)

export default router
