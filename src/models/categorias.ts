// src/models/categorias.ts

import mongoose, { Schema, Document } from 'mongoose';
// Descricação
// Na categoria deve ser cadastro apenas tipos de gastos ex: Lazer, Academia, Combustível...
// Deve ser resumida em apenas uma palavra

export interface ICategoria extends Document {
  nome: string;
  tipo: 'despesa' | 'receita';
  descricao?: string;
  fixa?: boolean; // true = padrão do sistema, false = criada pelo usuário
  usuario_id?: string; // undefined se for padrão do sistema
  data_criacao: Date;
}

const CategoriaSchema: Schema = new Schema({
  nome: { type: String, required: true, trim: true },
  tipo: { type: String, required: true, enum: ['despesa', 'receita'] },
  descricao: { type: String, trim: true, default: '' },
  fixa: { type: Boolean, default: false }, // false = personalizada
  usuario_id: { type: String, default: null }, // null = categoria do sistema
  data_criacao: { type: Date, default: Date.now },
});

export default mongoose.models.Categoria ||
  mongoose.model<ICategoria>('Categoria', CategoriaSchema);
