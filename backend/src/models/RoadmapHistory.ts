import mongoose, { Schema } from 'mongoose'

const NodeMetaSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    tags: { type: [String], default: [] },
    status: { type: String },
    link: { type: String },
    notes: { type: String }
  },
  { _id: false }
)

const RoadmapHistorySchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    goal: { type: String, required: true },
    name: { type: String },
    roadmap: { type: Schema.Types.Mixed, required: true },
    nodeMeta: { type: Map, of: NodeMetaSchema, default: {} },
    isPublic: { type: Boolean, default: false },
    shareId: { type: String, index: true, sparse: true }
  },
  { timestamps: true }
)

export const RoadmapHistory =
  mongoose.models.RoadmapHistory ||
  mongoose.model('RoadmapHistory', RoadmapHistorySchema)
