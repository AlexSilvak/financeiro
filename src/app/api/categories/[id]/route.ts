// src/app/api/categories/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Category from '@/models/category'
import { connectDB } from '@/lib/mongodb' // your connection function

// 🔹 GET /api/categories?id=... - Lista categorias do sistema e do usuário
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get('usuario_id')

    // List system (fixed) + user categories
    const categories = await Category.find({
      $or: [
        { fixed: true },
        { user_id: user_id },
      ],
    }).sort({ name: 1 })

    return NextResponse.json({ categorias: categories }) // resposta em português
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 })
  }
}

// 🔹 PUT /api/categories/[id] - Atualiza uma categoria
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()
    const { name, type, description } = body

    if (!name || !type) {
      return NextResponse.json({ error: 'Nome e tipo são obrigatórios' }, { status: 400 })
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      {
        name: name.trim(),
        type,
        description,
      },
      { new: true } // return updated doc
    )

    if (!updatedCategory) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
    }

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('[ERRO_ATUALIZAR_CATEGORIA]', error)
    return NextResponse.json({ error: 'Erro ao atualizar categoria' }, { status: 500 })
  }
}

// 🔹 DELETE /api/categories/[id] - Remove uma categoria
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const deletedCategory = await Category.findByIdAndDelete(params.id)

    if (!deletedCategory) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Categoria excluída com sucesso' })
  } catch (error) {
    console.error('[ERRO_DELETAR_CATEGORIA]', error)
    return NextResponse.json({ error: 'Erro ao excluir categoria' }, { status: 500 })
  }
}
