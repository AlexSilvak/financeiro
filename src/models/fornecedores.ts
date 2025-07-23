import { Schema, Document, model, models } from 'mongoose'

export interface IFornecedor extends Document {
  nome: string
  tipo_pessoa: 'física' | 'jurídica'
  cpf_cnpj: string
  rg_ie?: string
  email?: string
  telefone?: string
  celular?: string
  contato?: string
  endereco?: {
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
  observacoes?: string
  status: 'ativo' | 'inativo'
}

const FornecedorSchema = new Schema<IFornecedor>(
  {
    nome: { type: String, required: true },
    tipo_pessoa: { type: String, enum: ['física', 'jurídica'], required: true },
    cpf_cnpj: { type: String, required: true },
    rg_ie: { type: String },
    email: { type: String },
    telefone: { type: String },
    celular: { type: String },
    contato: { type: String }, // nome da pessoa responsável no fornecedor
    endereco: {
      rua: { type: String },
      numero: { type: String },
      complemento: { type: String },
      bairro: { type: String },
      cidade: { type: String },
      estado: { type: String },
      cep: { type: String },
    },
    observacoes: { type: String },
    status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  },
  {
    timestamps: true,
  }
)

const Fornecedor = models.Fornecedor || model<IFornecedor>('Fornecedor', FornecedorSchema)
export default Fornecedor
