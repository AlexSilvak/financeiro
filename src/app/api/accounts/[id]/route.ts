// src/app/api/accounts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Account from '@/models/account'
import { connectDB } from '@/lib/mongodb'

// PUT /api/accounts/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const data = await req.json()
  const updatedAccount = await Account.findByIdAndUpdate(params.id, data, { new: true })
  if (!updatedAccount) {
    return NextResponse.json({ error: 'Conta não encontrada' }, { status: 404 })
  }
  return NextResponse.json(updatedAccount)
}

// DELETE /api/accounts/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const deletedAccount = await Account.findByIdAndDelete(params.id)
  if (!deletedAccount) {
    return NextResponse.json({ error: 'Conta não encontrada' }, { status: 404 })
  }
  return NextResponse.json({ message: 'Conta excluída com sucesso' })
}
