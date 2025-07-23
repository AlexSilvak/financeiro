import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import FluxoCaixa from '@/models/fluxoCaixa'
import FechamentoCaixa from '@/models/fechamentoCaixa'
import { startOfDay, endOfDay } from 'date-fns'

export async function POST(req: NextRequest) {
  await connectDB()

  const { data, saldo_inicial, usuario, observacao } = await req.json()

  if (!data || saldo_inicial === undefined || !usuario) {
    return NextResponse.json({ error: 'Dados obrigatórios ausentes' }, { status: 400 })
  }

  const dia = new Date(data)
  const inicio = startOfDay(dia)
  const fim = endOfDay(dia)

  const transacoes = await FluxoCaixa.find({ data: { $gte: inicio, $lte: fim } })

  const entradas = transacoes.filter(t => t.tipo === 'entrada')
  const saidas = transacoes.filter(t => t.tipo === 'saida')

  const total_entradas = entradas.reduce((s, t) => s + t.valor, 0)
  const total_saidas = saidas.reduce((s, t) => s + t.valor, 0)
  const saldo_final = saldo_inicial + total_entradas - total_saidas

  const detalhes = transacoes.map(t => ({
    descricao: t.descricao,
    valor: t.valor,
    tipo: t.tipo,
    categoria: t.categoria || '',
  }))

  const fechamento = await FechamentoCaixa.create({
    data: inicio,
    saldo_inicial,
    total_entradas,
    total_saidas,
    saldo_final,
    usuario,
    observacao,
    detalhes,
  })

  return NextResponse.json({ sucesso: true, fechamento })
}


export async function GET(req: NextRequest) {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const dataParam = searchParams.get('data')

  if (!dataParam) {
    return NextResponse.json({ error: 'Parâmetro data ausente' }, { status: 400 })
  }

  const dia = new Date(dataParam)
  const inicio = startOfDay(dia)
  const fim = endOfDay(dia)

  const fechamento = await FechamentoCaixa.findOne({ data: { $gte: inicio, $lte: fim } }).populate('usuario')

  if (!fechamento) {
    return NextResponse.json({ error: 'Fechamento não encontrado' }, { status: 404 })
  }

  return NextResponse.json(fechamento)
}
