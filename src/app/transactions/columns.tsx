'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

// Definição do tipo
export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  description: string
  payment_method: string
  type: 'income' | 'expense'
  recurring:boolean
  category: string
  notes:string
}

// Colunas da tabela
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue<'status'>('status')
      const statusMap: Record<Payment['status'], string> = {
        pending: 'Pendente',
        processing: 'Processando',
        success: 'Concluído',
        failed: 'Falhou',
      }
      return <Badge variant="outline">{statusMap[status]}</Badge>
    },
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
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
        <div className={cn('flex items-center gap-1', type === 'income' ? 'text-green-600' : 'text-red-600')}>
          {type === 'income' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
          {formatted}
        </div>
      )
    },
  },
  {
    accessorKey: 'payment_method',
    header: 'Pagamento',
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = row.getValue<'type'>('type')
      return type === 'income' ? 'Receita' : 'Despesa'
    },
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
  },
]
