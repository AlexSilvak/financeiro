"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Banks = {
  id: string
  name: string
  bank_id: string
  status: string
  number: string
  fullName:string
}

export const columns: ColumnDef< Banks>[] = [
  {
    accessorKey: "fullName",
    header: "Nome"
  },
  {
    accessorKey: "code",
    header: "Banco"
  },
  
]
