import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Service from '@/models/service'

export async function DELETE(req: Request) {
  try {
    await connectDB()
    const { serviceId } = await req.json()

    const deleted = await Service.findByIdAndDelete(serviceId)

    if (!deleted) {
      return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Serviço deletado com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar serviço', details: `${error}` }, { status: 500 })
  }
}
