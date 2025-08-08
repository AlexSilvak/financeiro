'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react"

// Definição do tipo com os novos campos
export type Payment = {
  id: string
  amount: number
  status: string
  description: string
  payment_method: string
  type: 'income' | 'expense'
  recurring: boolean
  category: string
  notes: string
  bank_id?: string
  account_id?: string
  trntype?: string
  date?: string
  memo?: string
  fitid?: string
}

// Colunas da tabela
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.status === "pago" || row.original.status === "concluido" ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconLoader />
          )}
          {row.original.status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
    meta: { editable: true },
  },
  {
    accessorKey: 'amount',
    header: 'Valor',
    cell: ({ row }) => {
      const amount = Number(row.getValue('amount'))
      const type = row.original.type
      const formatted = amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
      return (
        <div className={cn('flex items-center gap-1', type === 'expense' ? 'text-red-600' : 'text-green-600')}>
          {type === 'income' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
          {formatted}
        </div>
      )
    },
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = row.getValue<'type'>('type')
      return type === 'expense' ? 'Despesa' : 'Receita'
    },
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
  },
  {
    accessorKey: 'bank_id',
    header: 'Banco',
  },
  {
    accessorKey: 'account_id',
    header: 'Conta',
  },
  {
    accessorKey: 'trntype',
    header: 'Transação',
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => row.original.date
      ? new Date(row.original.date).toLocaleDateString('pt-BR')
      : '-'
  },
  {
    accessorKey: 'memo',
    header: 'Observação',
  },
  {
    accessorKey: 'fitid',
    header: 'FITID',
  }
]
