import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import roadmapRoutes from './routes/roadmapRoutes'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '2mb' }))

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/', roadmapRoutes)

app.listen(port, () => {
  console.log(`Maplio backend running on port ${port}`)
})
