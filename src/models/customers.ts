import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  number: { type: String, required: true },
  complement: { type: String, default: '' },
  district: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip_code: { type: String, required: true },
}, { _id: false })

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    person_type: {
      type: String,
      enum: ['física', 'jurídica'],
      required: true,
    },
    cpf_cnpj: { type: String, required: true },
    rg_ie: { type: String, default: '' },
    birth_date: { type: Date },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    mobile: { type: String, default: '' },
    address: { type: addressSchema },
    status: {
      type: String,
      enum: ['ativo', 'inativo'],
      default: 'ativo',
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'customers',
  }
)

// Exporta apenas um model fixo para "customers"
export const Customer =
  mongoose.models.Customer || mongoose.model('Customer', customerSchema)
