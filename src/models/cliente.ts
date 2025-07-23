import { Schema, Document, model, models } from 'mongoose'

export interface ICliente extends Document {
  nome: string
  tipo_pessoa: 'física' | 'jurídica'
  cpf_cnpj: string
  rg_ie?: string
  data_nascimento?: Date
  email?: string
  telefone?: string
  celular?: string
  endereco?: {
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
  status: 'ativo' | 'inativo'
}

const ClienteSchema = new Schema<ICliente>(
  {
    nome: { type: String, required: true },
    tipo_pessoa: { type: String, enum: ['física', 'jurídica'], required: true },
    cpf_cnpj: { type: String, required: true },
    rg_ie: { type: String },
    data_nascimento: { type: Date },
    email: { type: String },
    telefone: { type: String },
    celular: { type: String },
    endereco: {
      rua: { type: String },
      numero: { type: String },
      complemento: { type: String },
      bairro: { type: String },
      cidade: { type: String },
      estado: { type: String },
      cep: { type: String },
    },
    status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  },
  {
    timestamps: true,
  }
)

const Cliente = models.Cliente || model<ICliente>('Cliente', ClienteSchema)
export default Cliente
