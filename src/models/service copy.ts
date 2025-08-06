import mongoose, { Schema, Document, Model } from 'mongoose'

export type ServiceStatus = 'stopped' | 'running' | 'restarting' | 'pending'

export interface IService extends Document {
  name: string
  status: ServiceStatus
  created_at: Date
  updated_at: Date
  log_service: string
  user_id: string
  statement_id: string
}

const ServiceSchema: Schema<IService> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['stopped', 'running', 'restarting', 'pending'],
      default: 'pending',
    },
    log_service: {
      type: String,
      trim: true,
      default: 'Serviço aguardando execução...',
    },
    user_id: {
      type: String,
      required: true,
    },
    statement_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

const ServiceModel: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema)

export default ServiceModel
