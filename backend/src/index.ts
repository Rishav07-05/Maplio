import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { clerkMiddleware } from '@clerk/express'

import roadmapRoutes from './routes/roadmapRoutes'
import historyRoutes from './routes/historyRoutes'
import { connectDatabase } from './db'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
)

app.use(express.json({ limit: '6mb' }))

app.use(clerkMiddleware())

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.get('/', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/', roadmapRoutes)
app.use('/', historyRoutes)

const start = async () => {
  await connectDatabase()

  app.listen(port, () => {
    console.log(`Maplio backend running on port ${port}`)
  })
}

start().catch((error) => {
  console.error('Failed to start server', error)
  process.exit(1)
})