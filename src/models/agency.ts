import { Schema, Document, model, models } from 'mongoose'

export interface IAgency extends Document {
  bank: Schema.Types.ObjectId
  number: string
  name?: string
  address?: string
  contact?: string
  fone?: string
  email?: string
}

const AgencySchema = new Schema<IAgency>(
  {
    bank: { type: Schema.Types.ObjectId, ref: 'Bank', required: true },
    number: { type: String, required: true },
    name: { type: String },
    address: { type: String },
    contact: { type: String },
    fone: { type: String },
    email: { type: String },
  },
  { timestamps: true }
)

const Agency = models.Agency || model<IAgency>('Agency', AgencySchema)
export default Agency
