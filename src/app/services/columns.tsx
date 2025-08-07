// app/services/columns.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { IService } from '@/types/service'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const columns: ColumnDef<IService>[] = [
  {
    accessorKey: 'name',
    header: 'Serviço',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      const color =
        status === 'running'
          ? 'green'
          : status === 'stopped'
          ? 'red'
          : status === 'restarting'
          ? 'yellow'
          : 'gray'
      return <Badge variant="outline" className={`text-${color}-500`}>{status}</Badge>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const service = row.original
      const { mutate } = useSWR('/api/services/list', fetcher)

      const handleAction = async (action: string) => {
        const res = await fetch(`/api/services/${action}`, {
          method: 'POST',
          body: JSON.stringify({ id: service._id }),
        })
        const json = await res.json()

        if (res.ok) {
          toast.success(json.message || `${action} executado com sucesso`)
          mutate()
        } else {
          toast.error(json.error || `Erro ao executar ${action}`)
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <DotsVerticalIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleAction('start')}>
              Iniciar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('stop')}>
              Parar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('restart')}>
              Reiniciar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('delete')}>
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
