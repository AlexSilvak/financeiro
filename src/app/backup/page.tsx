'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { BackupButton } from '@/components/BackupButton'

type BackupLog = {
  _id: string
  nome: string
  caminho: string
  status: 'sucesso' | 'erro'
  mensagem: string
  criado_em: string
}

export default function BackupListPage() {
  const [data, setData] = useState<BackupLog[]>([])

  useEffect(() => {
    fetch('/api/backup')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.logs)
          

      })
  }, [])

  const columns: ColumnDef<BackupLog>[] = [
    {
      header: 'Nome',
      accessorKey: 'nome',
    },
    {
      header: 'Criado em',
      accessorKey: 'criado_em',
      cell: ({ row }) => (
        <span>{format(new Date(row.original.criado_em), 'dd/MM/yyyy HH:mm')}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span
          className={`text-sm font-semibold ${
            row.original.status === 'sucesso' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      header: 'Caminho',
      accessorKey: 'caminho',
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Backups salvos</h2>
      <BackupButton/>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
