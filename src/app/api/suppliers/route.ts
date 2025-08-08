// src/app/api/suppliers/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Supplier from '@/models/suppliers'

// 🔹 GET /api/suppliers - Lista todos os fornecedores
export async function GET() {
  try {
    await connectDB()

    const suppliers = await Supplier.find().lean()
    return NextResponse.json({ success: true, data: suppliers })
  } catch (error) {
    console.error('[ERROR_FETCH_SUPPLIERS]', error)
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 })
  }
}

// 🔹 POST /api/suppliers - Cria um novo fornecedor
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    const { name, person_type, tax_id, status } = body

    if (!name || !person_type || !tax_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newSupplier = await Supplier.create({
      ...body,
      status: status || 'active',
    })

    return NextResponse.json(newSupplier, { status: 201 })
  } catch (error) {
    console.error('[ERROR_CREATE_SUPPLIER]', error)
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 })
  }
}
