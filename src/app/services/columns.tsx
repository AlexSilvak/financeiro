'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Service } from './types'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ServiceActions } from './service-actions'

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: 'name',
    header: 'Service Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      const color = status === 'running' ? 'green' : status === 'stopped' ? 'red' : 'yellow'
      return <Badge variant="outline" className={`text-${color}-500 border-${color}-500`}>{status}</Badge>
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => format(new Date(row.original.created_at), 'dd/MM/yyyy HH:mm'),
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Modified',
    cell: ({ row }) => format(new Date(row.original.updated_at), 'dd/MM/yyyy HH:mm'),
  },
  {
    accessorKey: 'log_service',
    header: 'Log',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ServiceActions service={row.original} />,
  },
]
