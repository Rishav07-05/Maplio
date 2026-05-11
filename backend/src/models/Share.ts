import { Schema, model, Document } from 'mongoose'

export interface IShare extends Document {
  roadmapId: Schema.Types.ObjectId
  shareId: string
}

const ShareSchema = new Schema<IShare>(
  {
    roadmapId: {
      type: Schema.Types.ObjectId,
      ref: 'RoadmapHistory',
      required: true
    },
    shareId: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
)

const Share = model<IShare>('Share', ShareSchema)

export default Share
