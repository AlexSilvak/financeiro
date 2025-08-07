"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Banks = {
  id: string
  name: string
  bank_id: string
  agency: {
    number: string
    name?: string
    address?: string
    contact?: string
  }
  address: string
  status: string
  number: string
}

export const columns: ColumnDef< Banks>[] = [
  {
    accessorKey: "name",
    header: "Nome"
  },
  {
    accessorKey: "bank_id",
    header: "Banco"
  },
  {
    header: "Agência",
    accessorKey: "agency.number",
    cell: ({ row }) => row.original.agency?.number || "-"
  },
  {
    header: "Endereço",
    accessorKey: "agency.address",
    cell: ({ row }) => row.original.agency?.address || "-"
  },
 
  {
    accessorKey: "contact",
    header: "Contato",
    cell: ({ row }) => row.original.agency?.contact || "-"
  },
   {
    accessorKey: "status",
    header: "Status"
  },
]
