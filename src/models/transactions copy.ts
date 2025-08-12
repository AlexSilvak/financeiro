// src/models/transactions.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  description?: string;
  payment_method?: string;
  amount?: number;
  type?: 'expense' | 'income';
  category?: string;
  due_date?: Date | null;
  payment_date?: Date | null;
  status?: 'pendente' | 'pago' | 'falhou' | 'concluido';
  notes?: string;
  recurring?: boolean;
  created_at?: Date;
  user_id?: string;
  bank_id?: string;
  account_id?: string;
  trntype?: string;
  date?: Date | null;
  memo?: string;
  fitid?: string;
}

const TransactionSchema: Schema = new Schema({
  description: { type: String, trim: true, default: "" },
  payment_method: { type: String, trim: true, default: "" },
  amount: { type: Number, min: 0, default: 0 },
  type: { type: String, enum: ['expense', 'income'], default: 'expense' },
  category: { type: String, trim: true, default: "" },
  due_date: { type: Date, default: null },
  payment_date: { type: Date, default: null },
  status: { type: String, enum: ['pendente', 'pago', 'concluido', 'falhou'], default: 'pendente' },
  notes: { type: String, default: "", trim: true },
  recurring: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  user_id: { type: String, default: "" },
  bank_id: { type: String, trim: true, default: "" },
  account_id: { type: String, trim: true, default: "" },
  trntype: { type: String, trim: true, default: "" },
  date: { type: Date, default: null },
  memo: { type: String, trim: true, default: "" },
  fitid: { type: String, index: true, default: "" }
});

TransactionSchema.index({ user_id: 1, fitid: 1 }, { unique: true });

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema);
