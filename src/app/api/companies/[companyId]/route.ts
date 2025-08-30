import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/models/company";
import mongoose from "mongoose";

export async function PUT(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  await connectDB();
  const { companyId } = params;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await req.json();
  const updated = await Company.findByIdAndUpdate(companyId, body, { new: true });

  if (!updated) {
    return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  await connectDB();
  const { companyId } = params;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const deleted = await Company.findByIdAndDelete(companyId);

  if (!deleted) {
    return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
