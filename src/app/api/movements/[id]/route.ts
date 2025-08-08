import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Movement } from '@/models/movements'

// 📌 GET - Get movement by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const movement = await Movement.findById(params.id)
      .populate('customer', 'name')
      .populate('supplier', 'name')
      .populate('bankAccount', 'name')
      .populate('createdBy', 'name')

    if (!movement) {
      return NextResponse.json({ message: 'Movement not found' }, { status: 404 })
    }

    return NextResponse.json({ data: movement }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching movement:', error)
    return NextResponse.json(
      { message: error.message || 'Error fetching movement' },
      { status: 500 }
    )
  }
}

// 📌 PUT - Update movement by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()

    const updated = await Movement.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true
    })

    if (!updated) {
      return NextResponse.json({ message: 'Movement not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Movement updated', data: updated }, { status: 200 })
  } catch (error: any) {
    console.error('Error updating movement:', error)
    return NextResponse.json(
      { message: error.message || 'Error updating movement' },
      { status: 400 }
    )
  }
}

// 📌 DELETE - Delete movement by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const deleted = await Movement.findByIdAndDelete(params.id)

    if (!deleted) {
      return NextResponse.json({ message: 'Movement not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Movement deleted' }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting movement:', error)
    return NextResponse.json(
      { message: error.message || 'Error deleting movement' },
      { status: 500 }
    )
  }
}
