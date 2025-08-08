// src/models/transactions.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  description: string;    
  payment_method: string;    
  amount: number;
  type: 'expense' | 'income';
  category: string;
  due_date: Date;
  payment_date?: Date;
  status: 'pendente' | 'pago' | 'falhou' | 'concluido';
  notes?: string;
  recurring?: boolean;
  created_at: Date;
  user_id: string;
  bank_id?: string;
  account_id?: string;
  trntype?: string;
  date?: Date;
  memo?: string;
  fitid: string;
}

const TransactionSchema: Schema = new Schema({
  description: { type: String, trim: true },
  payment_method: { type: String, trim: true },
  amount: { type: Number, min: 0 },
  type: { type: String, enum: ['expense', 'income'] },
  category: { type: String, trim: true },
  due_date: { type: Date, default: null },
  payment_date: { type: Date, default: null },
  status: { type: String, enum: ['pendente', 'pago', 'concluido', 'falhou'], default: 'pendente' },
  notes: { type: String, default: '', trim: true },
  recurring: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  user_id: { type: String },
  bank_id: { type: String, trim: true },
  account_id: { type: String, trim: true },
  trntype: { type: String, trim: true },
  date: { type: Date, default: null },
  memo: { type: String, trim: true },
  fitid: { type: String, index: true, unique: false }, // Pode ou não ser único
});

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema);
