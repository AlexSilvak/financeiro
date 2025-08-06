// src/app/api/services/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ServiceModel } from '@/models/service-model';

export async function GET() {
  try {
    await connectDB();
    const services = await ServiceModel.find().sort({ updated_at: -1 });
    return NextResponse.json(services);
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao buscar serviços' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, status, statement_id, user_id, log_service = '' } = await req.json();

    if (![name, status, statement_id, user_id].every(Boolean)) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    await connectDB();
    const newService = await ServiceModel.create({
      name,
      status,
      log_service,
      statement_id,
      user_id,
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao criar serviço' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { statementId, userId } = await req.json();

    if (!statementId || !userId) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    await connectDB();

    // Lógica de reinício de serviço (exemplo: atualizar timestamp)
    const updated = await ServiceModel.findOneAndUpdate(
      { statement_id: statementId, user_id: userId },
      { $set: { updated_at: new Date() } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Serviço reiniciado com sucesso' });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao reiniciar serviço' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { statementId, userId } = await req.json();

    if (!statementId || !userId) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    await connectDB();

    const deleted = await ServiceModel.findOneAndDelete({
      statement_id: statementId,
      user_id: userId,
    });

    if (!deleted) {
      return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Serviço parado com sucesso' });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao parar serviço' }, { status: 500 });
  }
}
