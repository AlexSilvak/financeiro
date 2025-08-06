import mongoose, { Schema, Document } from 'mongoose'

export interface IService extends Document {
  name: string
  status: 'running' | 'stopped' | 'pending'
  created_at: Date
  updated_at: Date
  log_service: string
  statement_id: string
  user_id: string
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['running', 'stopped', 'pending'], required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    log_service: { type: String, default: '' },
    statement_id: { type: String, required: true },
    user_id: { type: String, required: true },
  },
  {
    collection: 'services',
  }
)

export const ServiceModel =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema)
