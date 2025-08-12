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


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getFilteredRowModel } from '@tanstack/react-table'
import { useId } from 'react'

import { CircleIcon } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DatePickerRangeAndTimePickerDemo from '@/components/DatePickerRangeAndTimePickerDemo'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}



function RowActions({ transactionId }: { transactionId: string }) {
  const [open, setOpen] = useState(false)
  const [descriptionFilter, setDescriptionFilter] = useState('')
const [valueFilter, setValueFilter] = useState('')
const [typeFilter, setTypeFilter] = useState('')
const [dateFilter, setDateFilter] = useState('')



  const { handleSubmit } = useForm()
  const { trigger: deleteTransaction, isMutating } = useDeleteTransaction() 
  
  const handleOpen =()=>setOpen(true)
  const handleClose=()=>setOpen(false)


 const onDelete = async () => {
  try {
    await deleteTransaction({ id: transactionId })
    toast.success('Transação deletada com sucesso!')
    mutate('/api/transactions') // Apenas uma chamada é suficiente
    setOpen(false) // Fecha o Dialog após sucesso
    location.reload()
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
          <DropdownMenuSeparator/>
          {/* Botão com Dialog para confirmação */}
               <AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogTrigger asChild>
    <Button variant="ghost" className="w-full max-w-xs justify-start">
      <Trash2 className="mr-2 h-4 w-4" /> Delete
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Deseja excluir este lançamento?</AlertDialogTitle>
      <AlertDialogDescription>
        Exclusão de lançamentos financeiros.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction
        onClick={() => handleSubmit(onDelete)()}
        disabled={isMutating}
      >
        {isMutating ? 'Deletando...' : 'Confirmar'}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


//formulario do menu 
function NewFormTransaction() {
  const [open, setOpen] = useState(false)
 
  const handleSuccess = () => {
    setOpen(false) // Fecha o dialog
    mutate('/api/transactions') // Dá refresh nos dados

    location.reload()
  
    toast.success('Transação salva com sucesso!')
      
  }

  return (
    
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex gap-2 items-center">
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full max-w-xs justify-start">
            <PlusCircleIcon />
            Novo
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <FormTransaction onSuccess={handleSuccess} />
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
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
  getFilteredRowModel: getFilteredRowModel(), // <- aqui entra
  onGlobalFilterChange: setFilter,
})


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  }



  const handlePreviousPage = () => table.previousPage()
  const handleNextPage = () => table.nextPage()
 const id = useId()
  return (
    
    <div className="space-y-3">
      {/* Filtro + paginação simples */}
      <div className="flex items-center justify-between">
        <div  className='w-full max-w-xs space-y-2 flex grid-cols-1 '>
          <Input
          placeholder="Buscar..."
          value={filter}
          onChange={handleSearchChange}
          className="w-64"
        />
        </div>
         <div className='w-full max-w-xs space-y-2 flex grid-cols-1 gap-2'>
           <DatePickerRangeAndTimePickerDemo/>
         </div>
       
  
       <div className='w-full max-w-xs space-y-1 flex grid-cols-1 gap-2'>
      <Label htmlFor={id}>Tipo</Label>
      <Select defaultValue='1'>
        <SelectTrigger
          id={id}
          className='w-full [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0'
        >
          <SelectValue placeholder='Select status' />
        </SelectTrigger>
        <SelectContent className='[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0'>

          <SelectItem value='3'>
            <span className='flex items-center gap-2'>
              <CircleIcon className='size-2 fill-emerald-600 text-emerald-600' />
              <span className='truncate'>Crédito</span>
            </span>
          </SelectItem>
          <SelectItem value='5'>
            <span className='flex items-center gap-2'>
              <CircleIcon className='size-2 fill-red-500 text-red-500' />
              <span className='truncate'>Débito</span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
        <div className='flex grid-cols-1 gap-2'>
          
          <NewFormTransaction />
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