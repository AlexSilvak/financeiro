import { NextRequest, NextResponse } from 'next/server';
import Categoria from '@/models/categorias';
import { connectDB } from '@/lib/mongodb'; // sua função de conexão

// 🔹 GET /api/categorias - Lista todas as categorias (do sistema e do usuário)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const usuario_id = searchParams.get('usuario_id');

    // Lista categorias padrão do sistema (fixas) + do usuário
    const categorias = await Categoria.find({
      $or: [
        { fixa: true },
        { usuario_id: usuario_id },
      ],
    }).sort({ nome: 1 });

    return NextResponse.json({ categorias });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 });
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
