// src/app/api/planos/route.ts
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import PlanoDePagamento from '@/models/planoDePagamento'

export async function GET() {
  await connectDB()
  const planos = await PlanoDePagamento.find().populate('forma_pagamento_id')
  return NextResponse.json(planos)
}

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  const plano = await PlanoDePagamento.create(body)
  return NextResponse.json(plano)
}
