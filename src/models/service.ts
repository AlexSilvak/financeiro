// src/models/service.ts
import mongoose, { Schema, Document } from 'mongoose'

export type ServiceStatus = 'stopped' | 'running' | 'restarting' | 'pending' | 'completed' | 'failed'

export interface IService extends Document {
  name: string
  status: ServiceStatus
  jobId?: string
  created_at: Date
  updated_at: Date
}

const ServiceSchema = new Schema<IService>({
  name: { type: String, required: true },
  status: { type: String, enum: ['stopped', 'running', 'restarting', 'pending', 'completed', 'failed'], default: 'stopped' },
  jobId: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema)
