"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash, Circle, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Account = {
  _id: string
  bank: string
  account_number: string
  account_type: string
  holder_name: string
  holder_document: string
  balance: number
  currency: string
  status: string
  createdAt: string
}

// Função de exclusão
async function deleteAccount(id: string) {
  const res = await fetch(`/api/accounts/${id}`, {
    method: "DELETE",
  })
  console.log(res)
  if (!res.ok) throw new Error("Erro ao excluir conta")
  window.location.reload()
}

// Função de inativação
async function toggleAccountStatus(id: string, currentStatus: string) {
  const newStatus = currentStatus === "ativo" ? "inativo" : "ativo"

  const res = await fetch(`/api/accounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  })

  if (!res.ok) throw new Error(`Erro ao alterar status da conta`)
  window.location.reload()
}

// Função de edição (exemplo genérico)
async function updateAccount(id: string, data: Partial<Account>) {
  const res = await fetch(`/api/accounts/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Erro ao atualizar conta")
  window.location.reload()
}

export const columns: ColumnDef<Account>[] = [
  { accessorKey: "holder_name", header: "Titular" },
  { accessorKey: "holder_document", header: "Documento" },
  { accessorKey: "account_number", header: "Conta" },
  { accessorKey: "account_type", header: "Tipo" },
  {
    accessorKey: "balance",
    header: "Saldo",
    cell: ({ row }) => {
      const balance = row.getValue("balance") as number
      const currency = row.original.currency
      return `${currency} ${balance.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="flex items-center gap-2">
          <Circle
            className={`h-3 w-3 ${
              status === "ativo" ? "text-green-500" : "text-red-500"
            }`}
            fill={status === "ativo" ? "green" : "red"}
          />
          {status}
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string)
      return date.toLocaleDateString("pt-BR")
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const account = row.original
      return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              updateAccount(account._id, {
                holder_name: account.holder_name + " (editado)",
              })
            }
          >
            <Pencil className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteAccount(account._id)}>
            <Trash className="mr-2 h-4 w-4 text-red-500" /> Excluir
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => toggleAccountStatus(account._id, account.status)}
          >
            <Ban
              className={`mr-2 h-4 w-4 ${
                account.status === "ativo" ? "text-yellow-500" : "text-green-500"
              }`}
            />
            {account.status === "ativo" ? "Inativar" : "Ativar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      )
    },
  },
]
