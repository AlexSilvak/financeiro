import { NextRequest,NextResponse } from "next/server";
import mongoose from "mongoose";
import Lancamento from "@/models/lancamentos";
import { connectDB } from "@/lib/mongodb";


// GET /api/lancamentos - Lista todos os lançamentos
export async function GET(req: NextRequest) {
    try {
      await connectDB();
  
      const { searchParams } = new URL(req.url);
      const usuario_id = searchParams.get('usuario_id');
  
      const filtro: any = {};
      if (usuario_id) {
        if (!mongoose.Types.ObjectId.isValid(usuario_id)) {
          return NextResponse.json({ error: 'ID de usuário inválido' }, { status: 400 });
        }
        filtro.usuario_id = usuario_id;
      }
  
      const lancamentos = await Lancamento.find(filtro).sort({ data_vencimento: -1 });
  
      return NextResponse.json({ lancamentos });
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error);
      return NextResponse.json({ error: 'Erro ao buscar lançamentos' }, { status: 500 });
    }
  }
  
 
  
  export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
  
    try {
      await connectDB();
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
      }
  
      const body = await req.json();
  
      const {
        nome,
        valor,
        tipo,
        categoria_id,
        descricao,
        data_vencimento,
        data_pagamento,
        status
      } = body;
  
      const atualizado = await Lancamento.findByIdAndUpdate(
        id,
        {
          nome,
          valor,
          tipo,
          categoria_id,
          descricao,
          data_vencimento,
          data_pagamento,
          status
        },
        { new: true }
      );
  
      if (!atualizado) {
        return NextResponse.json({ error: 'Lançamento não encontrado' }, { status: 404 });
      }
  
      return NextResponse.json(atualizado);
    } catch (error) {
      console.error('[ERRO_ATUALIZAR_LANCAMENTO]', error);
      return NextResponse.json({ error: 'Erro ao atualizar lançamento' }, { status: 500 });
    }
  }

  
// DELETE /api/lancamentos/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const id = await params.id; // ← importante: acesso correto aqui
  
    try {
      await connectDB();
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
      }
  
      const deletedLancamento = await Lancamento.findByIdAndDelete(id);
  
      if (!deletedLancamento) {
        return NextResponse.json({ error: 'Lançamento não encontrado' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Lançamento deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar lançamento:', error);
      return NextResponse.json({ error: 'Erro ao deletar lançamento' }, { status: 500 });
    }
  }
  