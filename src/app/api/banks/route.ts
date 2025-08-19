
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Bank from '@/models/bank'
import { z } from 'zod'

// Validação com Zod
const bankSchema = z.object({
  ispb: z.string().length(8, 'ISPB deve ter 8 dígitos'),
  code: z.number().int().nonnegative(),
  name: z.string().min(2),
  fullName: z.string().min(2),
  status: z.enum(['ativo', 'inativo']),
})

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()
    const parsed = bankSchema.parse(body) // valida entrada

    // Verifica duplicado pelo código COMPE ou ISPB
    const exists = await Bank.findOne({
      $or: [{ ispb: parsed.ispb }, { code: parsed.code }],
    })
    if (exists) {
      return NextResponse.json(
        { error: 'Banco já cadastrado (ISPB ou código duplicado)' },
        { status: 400 }
      )
    }

    const novoBank = await Bank.create(parsed)

    return NextResponse.json(novoBank, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar banco:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    )
  }
}



export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)

    // filtros
    const status = searchParams.get('status') // ativo/inativo
    const code = searchParams.get('code')
    const name = searchParams.get('name')

    // paginação
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    // ordenação
    const sortField = searchParams.get('sortField') || 'name'
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1

    // monta query
    const query: any = {}
    if (status) query.status = status
    if (code) query.code = Number(code)
    if (name) query.name = { $regex: name, $options: 'i' }

    const total = await Bank.countDocuments(query)
    const banks = await Bank.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortField]: sortOrder })

    return NextResponse.json({
      data: banks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Erro ao buscar bancos:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    )
  }
}
