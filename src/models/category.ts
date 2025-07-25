// src/models/category.ts

import mongoose, { Schema, Document, Types } from 'mongoose'

// TypeScript Interface
export interface ICategory extends Document {
  name: string
  type: 'expense' | 'income'
  description?: string
  user_id?: Types.ObjectId | null
  created_at: Date
}

// Mongoose Schema
const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
  },
  type: {
    type: String,
    required: true,
    enum: ['expense', 'income'],
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

// Composite index to avoid duplicate categories per user
CategorySchema.index({ name: 1, user_id: 1 }, { unique: true })

export default mongoose.models.Category ||
  mongoose.model<ICategory>('Category', CategorySchema)
