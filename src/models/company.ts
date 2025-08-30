import { Schema, Document, model, models } from 'mongoose'

export interface ICompany extends Document {
  cnpj: string
  ie?: string
  im?: string
  razaoSocial: string
  nomeFantasia: string
  matriz: boolean
  endereco: {
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    uf: string
    cep: string
  }
  contato: {
    telefone?: string
    email?: string
    site?: string
  }
  dataFundacao?: Date
  status: 'ativo' | 'inativo'
}

const CompanySchema = new Schema<ICompany>(
  {
    cnpj: { type: String, required: true, unique: true },
    ie: { type: String },
    im: { type: String },

    razaoSocial: { type: String, required: true },
    nomeFantasia: { type: String, required: true },
    matriz: { type: Boolean, default: false },

    endereco: {
      logradouro: { type: String, required: true },
      numero: { type: String, required: true },
      complemento: { type: String },
      bairro: { type: String, required: true },
      cidade: { type: String, required: true },
      uf: { type: String, required: true, maxlength: 2 },
      cep: { type: String, required: true },
    },

    contato: {
      telefone: { type: String },
      email: { type: String },
      site: { type: String },
    },

    dataFundacao: { type: Date },
    status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  },
  { timestamps: true }
)

const Company = models.Company || model<ICompany>('Company', CompanySchema)
export default Company
