import { NextResponse } from 'next/server'
import Service from '@/models/service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, user_id, statement_id } = body

    if (!name || !user_id || !statement_id) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const newService = await Service.create({
      name,
      user_id,
      statement_id,
      log_service: 'Serviço aguardando execução...',
      status: 'pending',
    })

    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar serviço', details: error },
      { status: 500 }
    )
  }
}
