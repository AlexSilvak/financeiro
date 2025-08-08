import { NextRequest, NextResponse } from 'next/server'
import { Movement } from '@/models/movements'
import { connectDB } from '@/lib/mongodb'

// 📌 POST - Create new movement
export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()

    const {
      description,
      type,
      amount,
      paymentMethod,
      date,
      category,
      bankAccount,
      customer,
      supplier,
      thirdPartyName,
      notes,
      status = 'pending',
      createdBy
    } = body

    const movement = new Movement({
      description,
      type, // 'income' | 'expense'
      amount,
      paymentMethod, // 'cash' | 'pix' | 'bank_transfer' | 'credit_card' | 'other'
      date,
      category,
      bankAccount,
      customer,
      supplier,
      thirdPartyName,
      notes,
      status,
      createdBy
    })

    await movement.save()

    return NextResponse.json(
      { message: 'Movement created successfully', data: movement },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating movement:', error)
    return NextResponse.json(
      { message: error.message || 'Error creating movement' },
      { status: 400 }
    )
  }
}
