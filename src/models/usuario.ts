import { Schema, Document, model, models } from 'mongoose'

export interface IUsuario extends Document {
  nome: string
  email: string
  senha: string
  role: 'admin' | 'gerente' | 'financeiro' | 'vendedor'
  ativo: boolean
}

const UsuarioSchema = new Schema<IUsuario>(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'gerente', 'financeiro', 'vendedor'],
      default: 'financeiro',
    },
    ativo: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

const Usuario = models.Usuario || model<IUsuario>('Usuario', UsuarioSchema)
export default Usuario
