'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

// Definição do tipo
export type Payment = {
  trntype: string
  amount: number
  payment_method?: string
  date: Date
  memo?: string
  fitid: string
  user_id?: string
}

// Colunas da tabela
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'memo',
    header: 'Descrição',
    meta: { editable: true },
  },
  {
    accessorKey: 'amount',
    header: 'Valor',
    cell: ({ row }) => {
      const amount = Number(row.getValue('amount'))
      const type = row.original.trntype
      const formatted = amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })

      const isCredit = type === 'DEBIT'

      return (
        <div className={cn('flex items-center gap-1', isCredit ?  'text-red-600' :'text-green-600')}>
          {isCredit ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
          {formatted}
        </div>
      )
    },
  },
  {
    accessorKey: 'trntype',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = row.getValue('trntype') as string
      return (
        <Badge variant={type === 'CREDIT' ? 'outline' : 'default'}>
          {type === 'CREDIT' ? 'Crédito' : 'Débito'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date') as string | Date)
      return format(date, 'dd/MM/yyyy')
    },
  },
  {
    accessorKey: 'fitid',
    header: 'ID da Transação',
    cell: ({ row }) => {
      const id = row.getValue('fitid') as string
      return <code className="text-xs text-muted-foreground">{id}</code>
    },
  },
  {
    accessorKey: 'user_id',
    header: 'Usuário',
    cell: ({ row }) => {
      const userId = row.getValue('user_id') as string
      return userId ? <span>{userId}</span> : <span className="text-muted-foreground">—</span>
    },
  },
]
