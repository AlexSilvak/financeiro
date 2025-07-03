// src/app/api/transacoes/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  console.log('Recebido:', body)
  return NextResponse.json({ success: true })
}
