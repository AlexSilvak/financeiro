import { Schema, Document, model, models } from 'mongoose'

export interface ISupplier extends Document {
  name: string
  person_type: 'individual' | 'company'
  tax_id: string // CPF or CNPJ
  state_registration?: string // RG or IE
  email?: string
  phone?: string
  mobile?: string
  contact_person?: string
  address?: {
    street: string
    number: string
    complement?: string
    district: string
    city: string
    state: string
    zip_code: string
  }
  notes?: string
  status: 'active' | 'inactive'
}

const SupplierSchema = new Schema<ISupplier>(
  {
    name: { type: String, required: true },
    person_type: { type: String, enum: ['individual', 'company'], required: true },
    tax_id: { type: String, required: true },
    state_registration: { type: String },
    email: { type: String },
    phone: { type: String },
    mobile: { type: String },
    contact_person: { type: String },
    address: {
      street: { type: String },
      number: { type: String },
      complement: { type: String },
      district: { type: String },
      city: { type: String },
      state: { type: String },
      zip_code: { type: String },
    },
    notes: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  {
    timestamps: true,
  }
)

const Supplier = models.Supplier || model<ISupplier>('Supplier', SupplierSchema)
export default Supplier
