import mongoose, { Schema, Document } from 'mongoose'

export interface IService extends Document {
  name: string
  status: 'stopped' | 'running' | 'restarting'
  created_at: Date
  updated_at: Date
  log_service: string
  user_id: string
}

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['stopped', 'running', 'restarting'],
    default: 'stopped',
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  log_service: { type: String, trim: true, default: '' },
  user_id: { type: String, required: true },
})

export default mongoose.models.Service ||
  mongoose.model<IService>('Service', ServiceSchema)
