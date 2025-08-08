import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Customer } from '@/models/customers'

// 🔹 CREATE - POST /api/customers
export async function POST(req: NextRequest) {
  await connectDB()

  try {
    const body = await req.json()
    const newCustomer = await Customer.create(body)

    return NextResponse.json(
      {
        message: 'Customer created successfully',
        customer: newCustomer,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to create customer',
        details: error,
      },
      { status: 400 }
    )
  }
}

// 🔹 READ - GET /api/customers
export async function GET(req: NextRequest) {
  await connectDB()

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const person_type = searchParams.get('person_type')

    const filter: Record<string, any> = {}
    if (status) filter.status = status
    if (person_type) filter.person_type = person_type

    const customers = await Customer.find(filter)
      .sort({ created_at: -1 })
      .limit(100)

    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch customers',
        details: error,
      },
      { status: 500 }
    )
  }
}
