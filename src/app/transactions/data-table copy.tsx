'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

import { DotsVerticalIcon } from '@radix-ui/react-icons'

import { Trash2, Plus, PencilLine, PlusCircleIcon } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { mutate } from 'swr'
import { useDeleteTransaction } from '@/hooks/useDeleteTransaction'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FormTransaction } from '@/components/FormTransaction'


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}


function RowActions({ transactionId }: { transactionId: string }) {
  const [open, setOpen] = useState(false)
  const { handleSubmit } = useForm()
  const { trigger: deleteTransaction, isMutating } = useDeleteTransaction() 

  const onDelete = async () => {
    try {
      await deleteTransaction({ id: transactionId })
      toast.success('Transação deletada com sucesso!')
      mutate('/api/transactions')
      
    } catch (error: any) {
      toast.error(error.message || 'Erro ao deletar')
    }
  }
  return (
    
<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <DotsVerticalIcon  />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='start' className='w-40'>
        <NewFormTransaction />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PencilLine className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <ButtonDelRow/>
          <DropdownMenuSeparator/>
          {/* Botão com Dialog para confirmação */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar exclusão</DialogTitle>
              </DialogHeader>
              <p>Tem certeza que deseja deletar esta transação?</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleSubmit(onDelete)}
                  disabled={isMutating}
                >
                  {isMutating ? 'Deletando...' : 'Confirmar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


function NewFormTransaction() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex gap-2 items-center ">
        <DialogTrigger asChild>
          <Button variant="ghost" className='w-full max-w-xs justify-start h-8'><PlusCircleIcon />Novo</Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <FormTransaction/>
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

function ButtonDelRow(){
  const [open,setOpen]=useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
      <Button variant="ghost"><Trash2/>Delete</Button>
      </DialogTrigger>
    </Dialog>
  )
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [filter, setFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: filter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setFilter,
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  }

  const handlePreviousPage = () => table.previousPage()
  const handleNextPage = () => table.nextPage()

  return (
    <div className="space-y-4">
      {/* Filtro + paginação simples */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Buscar..."
          value={filter}
          onChange={handleSearchChange}
          className="w-64"
        />
    <NewFormTransaction />
        <div>
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={!table.getCanNextPage()}
            className="ml-2"
          >
            Próximo
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
                <TableHead>Ações</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
  {table.getRowModel().rows.length ? (
    table.getRowModel().rows.map((row) => (
      <TableRow key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell> 
        ))}
        <TableCell>
          {/* Aqui você deve garantir que row.original tem `id` */}
          <RowActions transactionId={(row.original as any)._id} />
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={columns.length + 1} className="text-center">
        Nenhum resultado encontrado.
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </div>

      {/* Paginação */}
      <div className="flex justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePreviousPage}
                disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                disabled={!table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}