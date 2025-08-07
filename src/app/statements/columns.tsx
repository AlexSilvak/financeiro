// app/(sua-rota)/columns.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Statement } from '@/types/statement' // ajuste conforme o seu tipo
import { format } from 'date-fns'

export const columns: ColumnDef<Statement>[] = [
  {
    accessorKey: 'bank_id',
    header: 'Banco',
  },
  {
    accessorKey: 'account_id',
    header: 'Conta',
  },
  {
    accessorKey: 'branch_id',
    header: 'Agência',
  },
  {
    accessorKey: 'payment_method',
    header: 'Meio de Pagamento',
  },
  {
    accessorKey: 'imported_at',
    header: 'Importado em',
    cell: ({ row }) =>
      format(new Date(row.original.imported_at), 'dd/MM/yyyy HH:mm'),
  },
]
