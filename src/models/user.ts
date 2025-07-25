// src/models/user.ts

import { Schema, Document, model, models } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'admin' | 'gerente' | 'financeiro' | 'vendedor'
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'gerente', 'financeiro', 'vendedor'], // valores em português
      default: 'financeiro',
    },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true, // includes createdAt and updatedAt
  }
)

const User = models.User || model<IUser>('User', UserSchema)
export default User
