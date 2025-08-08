import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/models/customers'

// 🔹 READ ONE - GET /api/customers/:id
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()

  try {
    const customer = await Customer.findById(params.id)
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customer', details: error }, { status: 500 })
  }
}

// 🔹 UPDATE - PUT /api/customers/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()

  try {
    const body = await req.json()
    const updated = await Customer.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })

    if (!updated) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Customer updated successfully',
      customer: updated,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update customer', details: error }, { status: 400 })
  }
}

// 🔹 DELETE - DELETE /api/customers/:id
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()

  try {
    const deleted = await Customer.findByIdAndDelete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete customer', details: error }, { status: 500 })
  }
}
