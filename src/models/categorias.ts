import mongoose, { Schema, Document, Types } from 'mongoose'

// Interface TypeScript correta
export interface ICategoria extends Document {
  nome: string
  tipo: 'despesa' | 'receita'
  descricao?: string
  fixa?: boolean
  usuario_id?: Types.ObjectId | null
  data_criacao: Date
}

// Schema Mongoose
const CategoriaSchema: Schema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
  },
  tipo: {
    type: String,
    required: true,
    enum: ['despesa', 'receita'],
  },
  descricao: {
    type: String,
    trim: true,
    default: '',
  },
  fixa: {
    type: Boolean,
    default: false,
  },
  usuario_id: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null,
  },
  data_criacao: {
    type: Date,
    default: Date.now,
  },
})

// Índice para evitar duplicidade por usuário
CategoriaSchema.index({ nome: 1, usuario_id: 1 }, { unique: true })

export default mongoose.models.Categoria ||
  mongoose.model<ICategoria>('Categoria', CategoriaSchema)
