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
  
  //🔹 PUT /api/categorias - Lista todas as categorias (do sistema e do usuário)
  export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      const body = await req.json();
      const { nome, tipo, descricao, cor } = body;
  
      if (!nome || !tipo) {
        return NextResponse.json({ error: 'Nome e tipo são obrigatórios' }, { status: 400 });
      }
  
      const categoriaAtualizada = await Categoria.findByIdAndUpdate(
        params.id,
        {
          nome: nome.trim(),
          tipo,
          descricao,
          cor,
        },
        { new: true } // Retorna o documento atualizado
      );
  
      if (!categoriaAtualizada) {
        return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
      }
  
      return NextResponse.json(categoriaAtualizada);
    } catch (error) {
      console.error('[ERRO_ATUALIZAR_CATEGORIA]', error);
      return NextResponse.json({ error: 'Erro ao atualizar categoria' }, { status: 500 });
    }
  }
  
  //🔹 DELETE /api/categorias - Lista todas as categorias (do sistema e do usuário)


  export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
      await connectDB();
  
      const categoriaRemovida = await Categoria.findByIdAndDelete(params.id);
  
      if (!categoriaRemovida) {
        return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Categoria excluída com sucesso' });
    } catch (error) {
      console.error('[ERRO_DELETAR_CATEGORIA]', error);
      return NextResponse.json({ error: 'Erro ao excluir categoria' }, { status: 500 });
    }
  }
  