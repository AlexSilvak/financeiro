import mongoose, { Schema, model, models } from 'mongoose'

const backupLogSchema = new Schema({
  nome: { type: String, required: true },
  caminho: { type: String, required: true },
  criado_em: { type: Date, default: Date.now },
  status: { type: String, enum: ['sucesso', 'erro'], default: 'sucesso' },
  mensagem: { type: String }, // log, erro ou output
})

export const BackupLog = models.BackupLog || model('BackupLog', backupLogSchema)
