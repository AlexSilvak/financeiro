import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Company from '@/models/company'

// GET → listar empresas
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const name = searchParams.get('name')

    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    const query: any = {}
    if (status) query.status = status
    if (name) query.nomeFantasia = { $regex: name, $options: 'i' }

    const total = await Company.countDocuments(query)
    const companies = await Company.find(query).skip(skip).limit(limit)

    return NextResponse.json({
      data: companies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Erro ao buscar empresas:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST → criar empresa
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    // garantir CNPJ único
    const exists = await Company.findOne({ cnpj: body.cnpj })
    if (exists) {
      return NextResponse.json(
        { error: 'Empresa já cadastrada com este CNPJ' },
        { status: 400 }
      )
    }

    const company = await Company.create(body)
    return NextResponse.json(company, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar empresa:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
