// src/app/api/transactions/route.ts

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Transaction from "@/models/transactions";
import { connectDB } from "@/lib/mongodb";

// POST /api/transactions
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      description,
      payment_method,
      amount,
      type,
      category,
      due_date,
      payment_date,
      status,
      notes,
      recurring,
      user_id,
      created_at,
    } = body;

    if (!description || !amount || !type || !category) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const newTransaction = await Transaction.create({
      description,
      payment_method,
      amount,
      type,
      category,
      due_date,
      payment_date,
      status,
      notes,
      recurring,
      user_id,
      created_at,
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error: any) {
    console.error("[ERROR_CREATE_TRANSACTION]", error);
    return NextResponse.json(
      { error: "Error while creating transaction" },
      { status: 500 }
    );
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

// PUT /api/transactions/:id
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const {
      description,
      payment_method,
      amount,
      type,
      category,
      due_date,
      payment_date,
      status,
      notes,
      recurring,
    } = body;

    const updated = await Transaction.findByIdAndUpdate(
      id,
      {
        description,
        payment_method,
        amount,
        type,
        category,
        due_date,
        payment_date,
        status,
        notes,
        recurring,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[ERROR_UPDATE_TRANSACTION]", error);
    return NextResponse.json(
      { error: "Error updating transaction" },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Transaction successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Error deleting transaction" },
      { status: 500 }
    );
  }
}
