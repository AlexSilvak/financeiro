// /api/services/delete/route.ts
import { NextResponse } from 'next/server'

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID do serviço não fornecido.' }, { status: 400 })
  }

  try {
    // Exclua do banco de dados aqui com base no ID
    return NextResponse.json({ message: `Serviço ${id} excluído com sucesso.` }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao excluir o serviço' }, { status: 500 })
  }
}
