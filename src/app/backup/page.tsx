'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toZonedTime, format as formatTz } from 'date-fns-tz'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { BackupButton } from '@/components/BackupButton'
import { RestoreButton } from '@/components/RestoreButton'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { MoreVertical } from 'lucide-react'

type BackupLog = {
  _id: string
  nome: string
  caminho: string
  status: 'sucesso' | 'erro' | 'restaurado'
  mensagem: string
  criado_em: string
}

export default function BackupListPage() {
  const [data, setData] = useState<BackupLog[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const loadBackups = async () => {
    const res = await fetch('/api/backup')
    const result = await res.json()
    if (result.success) {
      setData(result.logs)
    } else {
      toast.error('Erro ao carregar backups')
    }
  }
  
  useEffect(() => {
    loadBackups()
  }, [])

 

  // ✅ Filtrando os dados conforme o termo de busca
  const filteredData = useMemo(() => {
    return data.filter((log) => {
      const nomeMatch = log.nome.toLowerCase().includes(searchTerm.toLowerCase())
  
      const criadoEm = new Date(log.criado_em)
  
      const startOk = startDate ? criadoEm >= new Date(startDate) : true
      const endOk = endDate ? criadoEm <= new Date(endDate + 'T23:59:59') : true
  
      return nomeMatch && startOk && endOk
    })
  }, [searchTerm, startDate, endDate, data])
  
  const handleBackup = async () => {
    toast.info('Iniciando backup...')
    const res = await fetch('/api/backup', { method: 'POST' })
    const data = await res.json()
  
    if (data.success) {
      toast.success(`Backup salvo em: ${data.path}`)
      await loadBackups()
    } else {
      toast.error(`Erro: ${data.error}`)
    }
  }
  
  
  const handleRestore = async (caminho: string) => {
    toast.info('Restaurando backup...')
    const res = await fetch('/api/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caminho }),
    })
  
    const data = await res.json()
  
    if (data.success) {
      toast.success(`Backup restaurado de: ${data.path}`)
      await loadBackups()
    } else {
      toast.error(`Erro: ${data.error}`)
    }
  }
  

  const handleDownload = (caminho: string) => {
    toast.info('Preparando para download...')
    // Supondo que o caminho seja tipo: /backups/backup-2025-07-02T15-06-34-470Z/financeirodb
    const dir = caminho.split('/backups/')[1]?.split('/')[0]
    const filename = `backup-${dir}.zip`
    window.open(`/backups/${filename}`, '_blank')
  }

  const columns: ColumnDef<BackupLog>[] = [
    {
      header: 'Nome',
      accessorKey: 'nome',
      cell: ({ row }) => {
        const nome = row.original.nome
        const data = new Date(row.original.criado_em)
        const formatado = format(data, 'yyyy-MM-dd_HH-mm')
        return <span>{`${nome} (${formatado})`}</span>
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status
        const color =
          status === 'sucesso'
            ? 'text-green-600'
            : status === 'restaurado'
            ? 'text-yellow-600'
            : 'text-red-600'

        return <span className={`font-semibold ${color}`}>{status}</span>
      },
    },
    {
      header: 'Criado em',
      accessorKey: 'criado_em',
      cell: ({ row }) => {
        const zoned = toZonedTime(new Date(row.original.criado_em), 'America/Sao_Paulo')
        return <span>{formatTz(zoned, 'dd/MM/yyyy HH:mm')}</span>
      }
      
    },
    {
      header: 'Ações',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleDownload(row.original.caminho)}
            >
              📎 Anexar arquivo
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRestore(row.original.caminho)}
            >
              ♻️ Restaurar este backup
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBackup}>
              💾 Fazer novo backup
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  ]

  const table = useReactTable({
    data: filteredData, // 🔁 Aqui usa os dados filtrados
    columns,
    getCoreRowModel: getCoreRowModel(),
  })


  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Histórico de Backups</h2>

      <div className="flex gap-4">
        <BackupButton/>
        <RestoreButton />
      </div>
      <div className="flex flex-wrap gap-4 items-center mt-4">
  <Input
    placeholder="🔍 Buscar por nome do backup..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="max-w-xs"
  />
  <div className="flex gap-2 items-center">
    <label className="text-sm text-muted-foreground">Início:</label>
    <Input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="w-fit"
    />
  </div>
  <div className="flex gap-2 items-center">
    <label className="text-sm text-muted-foreground">Fim:</label>
    <Input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="w-fit"
    />
  </div>
</div>

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
