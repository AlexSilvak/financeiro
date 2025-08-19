import { Schema, Document, model, models } from 'mongoose'

export interface IBank extends Document {
  ispb: string          // Identificador BACEN (8 dígitos)
  code: number          // Código COMPE (3 dígitos) 
  name: string          // Nome curto (ex: Banco do Brasil)
  fullName: string      // Nome completo (ex: Banco do Brasil S.A.)
  status: string        // ativo / inativo
}

const BankSchema = new Schema<IBank>(
  {
    ispb: { type: String, required: true },           // sempre string porque começa com zeros
    code: { type: Number, required: true },           // COMPE (ex: 001, 237, 341)
    name: { type: String, required: true },           // ex: Itaú
    fullName: { type: String, required: true },       // ex: Itaú Unibanco S.A.
    status: { type: String, required: true },         // ativo / inativo
  },
  { timestamps: true }
)

const Bank = models.Bank || model<IBank>('Bank', BankSchema)
export default Bank
