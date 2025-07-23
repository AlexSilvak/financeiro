"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  description: string
  forma_de_pagamento: string
  type: "entrada" | "saida"
  category: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Payment["status"]

      const color =
        status === "success"
          ? "green"
          : status === "failed"
          ? "red"
          : status === "processing"
          ? "yellow"
          : "gray"

      return <Badge variant="outline" className={`border-${color}-500 text-${color}-600`}>{status}</Badge>
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number
      return (
        <div className="text-right font-medium">
          {amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
      )
    },
  },
  {
    accessorKey: "forma_de_pagamento",
    header: "Forma de Pagamento",
    cell: ({ row }) => {
      const valor = row.getValue("forma_de_pagamento") as string
      return valor.charAt(0).toUpperCase() + valor.slice(1)
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as Payment["type"]
      return (
        <div className={`flex items-center gap-2 ${type === "entrada" ? "text-green-600" : "text-red-600"}`}>
          {type === "entrada" ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => {
      const categoria = row.getValue("category") as string
      return categoria.charAt(0).toUpperCase() + categoria.slice(1)
    },
  },
]
