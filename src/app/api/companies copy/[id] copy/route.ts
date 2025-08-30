import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Company from '@/models/company'

// GET → detalhes de uma empresa
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const company = await Company.findById(params.id)
    if (!company) return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })
    return NextResponse.json(company)
  } catch (error: any) {
    console.error('Erro ao buscar empresa:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT → atualizar empresa
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()

    const company = await Company.findByIdAndUpdate(params.id, body, { new: true })
    if (!company) return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })

    return NextResponse.json(company)
  } catch (error: any) {
    console.error('Erro ao atualizar empresa:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE → remover empresa
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const company = await Company.findByIdAndDelete(params.id)
    if (!company) return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })

    return NextResponse.json({ message: 'Empresa removida com sucesso' })
  } catch (error: any) {
    console.error('Erro ao deletar empresa:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
