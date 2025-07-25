// src/app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/user'

// 🔹 GET /api/users/[id] - Obtem um usuário pelo ID
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const user = await User.findById(params.id).select('-password').lean()
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('[ERRO_OBTER_USUARIO]', error)
    return NextResponse.json({ error: 'Erro ao obter usuário' }, { status: 500 })
  }
}

// 🔹 PUT /api/users/[id] - Atualiza dados do usuário
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()
    const { name, email, role, active } = body

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { name, email, role, active },
      { new: true, runValidators: true }
    ).select('-password')

    if (!updatedUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('[ERRO_ATUALIZAR_USUARIO]', error)
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 })
  }
}

// 🔹 DELETE /api/users/[id] - Remove um usuário
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const deletedUser = await User.findByIdAndDelete(params.id)

    if (!deletedUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Usuário removido com sucesso' })
  } catch (error) {
    console.error('[ERRO_REMOVER_USUARIO]', error)
    return NextResponse.json({ error: 'Erro ao remover usuário' }, { status: 500 })
  }
}
