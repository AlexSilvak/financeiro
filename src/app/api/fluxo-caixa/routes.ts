import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import FluxoCaixa from "@/models/fluxoCaixa"

// POST: Criar novo lançamento
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    const {
      descricao,
      tipo,
      valor,
      forma_pagamento,
      data,
      categoria,
      conta_bancaria,
      cliente,
      fornecedor,
      observacao,
      status,
      usuario,
    } = body

    if (!descricao || !tipo || !valor || !forma_pagamento || !data || !usuario) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    const novoLancamento = await FluxoCaixa.create({
      descricao,
      tipo,
      valor,
      forma_pagamento,
      data: new Date(data),
      categoria,
      conta_bancaria,
      cliente,
      fornecedor,
      observacao,
      status: status || "pendente",
      usuario,
    })

    return NextResponse.json({ sucesso: true, lancamento: novoLancamento })
  } catch (error) {
    console.error("Erro no POST /api/fluxo-caixa:", error)
    return NextResponse.json({ error: "Erro interno ao criar lançamento" }, { status: 500 })
  }
}

// GET: Buscar todos os lançamentos
export async function GET() {
  try {
    await connectDB()
    const lista = await FluxoCaixa.find().sort({ data: -1 }) // mais recentes primeiro
    return NextResponse.json(lista)
  } catch (error) {
    console.error("Erro no GET /api/fluxo-caixa:", error)
    return NextResponse.json({ error: "Erro ao buscar lançamentos" }, { status: 500 })
  }
}
