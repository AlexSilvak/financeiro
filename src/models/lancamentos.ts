// src/models/lancamentos.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ILancamento extends Document {
  descricao: string;
  valor: number;
  forma_de_pagamento:string;
  tipo: 'despesa' | 'receita';
  categoria: string;
  data_vencimento: Date;
  data_pagamento?: Date;
  status: 'pendente' | 'pago' | 'recebido'; // depende do tipo
  multa?: number;
  juros?: number;
  parcela:number;
  parcela_final:number
  valor_total_pago?: number;
  observacoes?: string;
  recorrente?: boolean;
  data_criacao: Date;
  usuario_id: string;
}

const LancamentoSchema: Schema = new Schema({
  descricao: { type: String, required: true, trim: true },
  forma_de_pagamento:{ type: String, required: true, trim: true },
  valor: { type: Number, required: true, min: 0 },
  tipo: { type: String, required: true, enum: ['despesa', 'receita'] },
  categoria: { type: String, required: true, trim: true },
  data_vencimento: { type: Date, required: true },
  data_pagamento: { type: Date, default: null },
  status: { type: String, enum: ['pendente', 'pago', 'recebido'], default: 'pendente' },
  multa: { type: Number, default: 0 },
  juros: { type: Number, default: 0 },
  parcela: { type: Number, default: 0 },
  parcela_final: { type: Number, default: 0 },
  valor_total_pago: { type: Number, default: 0 },
  observacoes: { type: String, default: '', trim: true },
  recorrente: { type: Boolean, default: false },
  data_criacao: { type: Date, default: Date.now },
  usuario_id: { type:  String, required: true },
});

export default mongoose.models.Lancamento ||
  mongoose.model<ILancamento>('Lancamento', LancamentoSchema);   