import { Schema, Document, model, models, Types } from 'mongoose'

export interface IMovement extends Document {
  description: string
  type: 'income' | 'expense'
  amount: number
  paymentMethod: 'cash' | 'pix' | 'bank_transfer' | 'credit_card' | 'other'
  date: Date
  category?: string
  bankAccount?: Types.ObjectId // reference to bank account
  customer?: Types.ObjectId // optional
  supplier?: Types.ObjectId // optional
  thirdPartyName?: string // when there's no customer/supplier record
  notes?: string
  status: 'pending' | 'paid' | 'canceled'
  createdBy: Types.ObjectId // user who created the record
}

const MovementSchema = new Schema<IMovement>(
  {
    description: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['cash', 'pix', 'bank_transfer', 'credit_card', 'other'],
      required: true
    },
    date: { type: Date, required: true },
    category: { type: String },
    bankAccount: { type: Schema.Types.ObjectId, ref: 'BankAccount' },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    thirdPartyName: { type: String, trim: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'paid', 'canceled'],
      default: 'pending'
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)

// ✅ Validation: must have customer, supplier, or thirdPartyName
MovementSchema.pre('validate', function (next) {
  if (!this.customer && !this.supplier && !this.thirdPartyName) {
    return next(
      new Error(
        'Movement must have either a customer, supplier, or thirdPartyName.'
      )
    )
  }
  next()
})

export const Movement =
  models.Movement || model<IMovement>('Movement', MovementSchema)
