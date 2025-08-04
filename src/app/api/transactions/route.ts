// src/app/api/transactions/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Transaction from '@/models/transactions'
import { connectDB } from '@/lib/mongodb'

export async function POST(req: NextRequest) {
  await connectDB()

  try {
    const body = await req.json()

    // Suporte para múltiplas transações
    if (Array.isArray(body.transactions)) {
      const created = await Transaction.insertMany(body.transactions)
      return NextResponse.json({
        message: 'Transações criadas com sucesso',
        count: created.length,
      }, { status: 201 })
    }

    // Caso seja apenas uma única transação
    const created = await Transaction.create(body)
    console.log(created)
    return NextResponse.json({
      message: 'Transação criada com sucesso',
      data: created,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar transações:', error)
    return NextResponse.json({
      error: error.message || 'Erro ao criar transações',
    }, { status: 500 })
  }
}
// GET /api/transactions
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    const filter: any = {};
    if (user_id) {
      if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }
      filter.user_id = user_id;
    }

    const transactions = await Transaction.find(filter).sort({ due_date: -1 });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Error fetching transactions" },
      { status: 500 }
    );
  }
}