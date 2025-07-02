import { NextRequest, NextResponse } from 'next/server';
import Categoria from '@/models/categorias';
import { connectDB } from '@/lib/mongodb'; // sua função de conexão

// 🔹 GET /api/categorias - Lista todas as categorias (do sistema e do usuário)
export async function GET() {
  await connectDB()

  try {
    const categorias = await Categoria.find().lean()
    return NextResponse.json({ success: true, data: categorias })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// 🔹 POST /api/categorias - Cria uma nova categoria personalizada
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { nome, tipo, descricao, cor, usuario_id } = body;

    if (!nome || !tipo || !usuario_id) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    const novaCategoria = await Categoria.create({
      nome: nome.trim(),
      tipo,
      descricao,
      cor,
      fixa: false,
      usuario_id,
    });

    return NextResponse.json(novaCategoria, { status: 201 });
  } catch (error) {
    console.error('[ERRO_CRIAR_CATEGORIA]', error);
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 });
  }
}
