// src/app/api/accounts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Account from '@/models/account'
import { connectDB } from '@/lib/mongodb'

// GET /api/accounts
export async function GET() {
  await connectDB()
  const accounts = await Account.find().populate('bank') // opcional: incluir dados do banco
  return NextResponse.json(accounts)
}

// POST /api/accounts
export async function POST(req: NextRequest) {
  await connectDB()
  const data = await req.json()
  const newAccount = await Account.create(data)
  return NextResponse.json(newAccount, { status: 201 })
}
