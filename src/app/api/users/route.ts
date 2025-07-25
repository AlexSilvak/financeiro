// src/app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/user'

// 🔹 GET /api/users - Lista todos os usuários
export async function GET() {
  try {
    await connectDB()

    const users = await User.find().select('-password').lean()
    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error('[ERRO_LISTAR_USUARIOS]', error)
    return NextResponse.json({ error: 'Erro ao listar usuários' }, { status: 500 })
  }
}

// 🔹 POST /api/users - Cria um novo usuário
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 400 })
    }

    const newUser = await User.create({
      name,
      email,
      password, // Ideal: hash a senha antes (ex: bcrypt)
      role: role || 'financeiro',
    })

    const { password: _, ...userWithoutPassword } = newUser.toObject()

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('[ERRO_CRIAR_USUARIO]', error)
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
  }
}
