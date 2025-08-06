'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  IconCircleCheckFilled,
  IconLoader,
} from "@tabler/icons-react"



// Definição do tipo
export type Payment = {
  id: string
  amount: number
  status: string
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
      
    
      return <Badge variant="outline" className="text-muted-foreground px-1.5">{row.original.status === "pago" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.status}
        </Badge>
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
        <div className={cn('flex items-center gap-1', type === 'expense' ? 'text-green-600' : 'text-red-600')}>
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
      return type === 'expense' ? 'Despesa' :'Receita' 
    },
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
  },
]
