import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import FluxoCaixa from "@/models/fluxoCaixa"

// PUT: Atualizar lançamento
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()
    const id = params.id

    const atualizado = await FluxoCaixa.findByIdAndUpdate(id, body, { new: true })

    if (!atualizado) {
      return NextResponse.json({ error: "Lançamento não encontrado" }, { status: 404 })
    }

    return NextResponse.json(atualizado)
  } catch (error) {
    console.error("Erro no PUT /api/fluxo-caixa:", error)
    return NextResponse.json({ error: "Erro ao atualizar lançamento" }, { status: 500 })
  }
}

// DELETE: Remover lançamento
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const id = params.id

    const removido = await FluxoCaixa.findByIdAndDelete(id)

    if (!removido) {
      return NextResponse.json({ error: "Lançamento não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ sucesso: true })
  } catch (error) {
    console.error("Erro no DELETE /api/fluxo-caixa:", error)
    return NextResponse.json({ error: "Erro ao excluir lançamento" }, { status: 500 })
  }
}
