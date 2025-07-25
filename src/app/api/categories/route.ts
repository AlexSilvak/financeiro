// src/app/api/categories/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Category from '@/models/category'
import { connectDB } from '@/lib/mongodb' // your DB connection function

// 🔹 GET /api/categories - List all system and user-defined categories
export async function GET() {
  await connectDB()

  try {
    const categories = await Category.find().lean()
    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// 🔹 POST /api/categories - Create a new custom category
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    
    const { name, type, description,fixed, user_id } = body
    console.log(name, type, description, user_id)
    if (!name || !type || !user_id) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    const newCategory = await Category.create({
      name: name.trim(),
      type,
      description,
      fixed: false,
      user_id,
    })

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.log( error)
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 })
  }
}
