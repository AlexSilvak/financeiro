'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { IContaBancaria } from '@/models/conta-bancaria'

export const columns: ColumnDef<IContaBancaria>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar tudo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => <span className="capitalize">{row.getValue('descricao')}</span>,
  },
  {
    accessorKey: 'numero_conta',
    header: 'Conta',
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
    cell: ({ row }) => {
      const tipo = row.getValue('tipo') as string
      const label = {
        corrente: 'Corrente',
        poupanca: 'Poupança',
        investimento: 'Investimento',
        outro: 'Outro',
      }[tipo]

      return <Badge variant="outline">{label}</Badge>
    },
  },
  {
    accessorKey: 'saldo_inicial',
    header: 'Saldo Inicial',
    cell: ({ row }) => {
      const valor = Number(row.getValue('saldo_inicial'))
      return `R$ ${valor.toFixed(2).replace('.', ',')}`
    },
  },
  {
    accessorKey: 'ativo',
    header: 'Ativo',
    cell: ({ row }) => {
      const ativo = row.getValue('ativo') as boolean
      return ativo ? (
        <Badge variant="default">Sim</Badge>
      ) : (
        <Badge variant="destructive">Não</Badge>
      )
    },
  },
   {
    accessorKey: 'opcoes',
    header: 'opcoes',
    cell: ({ row }) => {
      const ativo = row.getValue('ativo') as boolean
      return ativo ? (
        <Badge variant="default">Sim</Badge>
      ) : (
        <Badge variant="destructive">Não</Badge>
      )
    },
  },
]
