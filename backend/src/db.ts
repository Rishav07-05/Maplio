import mongoose from 'mongoose'

export const connectDatabase = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    throw new Error('MONGO_URI is not configured')
  }

  await mongoose.connect(uri)
}
