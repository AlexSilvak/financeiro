import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Transaction from '@/models/transactions'

export async function DELETE(
   req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB()

  const transaction = await Transaction.findByIdAndDelete(params.id)

  if (!transaction) {
    return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Transação deletada com sucesso' })
}
