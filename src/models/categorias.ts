// src/models/categorias.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoria extends Document {
  nome: string;
  tipo: 'despesa' | 'receita';
  descricao?: string;
  cor?: string;
  fixa?: boolean; // true = padrão do sistema, false = criada pelo usuário
  usuario_id?: string; // undefined se for padrão do sistema
  data_criacao: Date;
}

const CategoriaSchema: Schema = new Schema({
  nome: { type: String, required: true, trim: true },
  tipo: { type: String, required: true, enum: ['despesa', 'receita'] },
  descricao: { type: String, trim: true, default: '' },
  cor: { type: String, default: '#cccccc' }, // ex: cor para identificar no gráfico
  fixa: { type: Boolean, default: false }, // false = personalizada
  usuario_id: { type: String, default: null }, // null = categoria do sistema
  data_criacao: { type: Date, default: Date.now },
});

export default mongoose.models.Categoria ||
  mongoose.model<ICategoria>('Categoria', CategoriaSchema);
