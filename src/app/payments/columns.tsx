"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  description: string
  forma_de_pagamento:string
  type:string
  category:string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "amount",
    header: "Valor",
  },
  {
    accessorKey: "forma_de_pagamento",
    header: "Pagamento",
  },
  {
    accessorKey: "type",
    header: "Tipo",
  },
  {
    accessorKey: "category",
    header: "Internet",
  },
  
]