'use client'

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from 'react'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
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
import { Plus } from 'lucide-react';


interface FormData {
  nome: string
  tipo: 'despesa' | 'receita' | ''
  descricao: string
  cor: string
  usuario_id: string
}
type Categoria = {
  _id: string
  nome: string
  tipo: 'receita' | 'despesa'
  descricao: string
  cor: string
  usuario_id: string
}
export default function Page() {
  const [data, setData] = useState<Categoria[]>([])
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    tipo: "",
    descricao: "",
    cor: "#000000",
    usuario_id: "1234567890abcdef",
  })

  useEffect(() => {
    const usuario_id = '1234567890abcdef' // ou pegue do auth/context
  
    fetch(`/api/categorias?usuario_id=${usuario_id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log( res.data)
        if (res.success) setData(res.data)
      })
  }, [])
  

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      toast.success('Categoria salva com sucesso!')
      setFormData({
        nome: '',
        tipo: '',
        descricao: '',
        cor: '#000000',
        usuario_id: '1234567890abcdef',
      })
    } else {
      toast.error('Erro ao salvar categoria.')
    }
  }
  const columns: ColumnDef<Categoria>[] = [
    {
      header: 'Nome',
      accessorKey: 'nome',
    },
    {
      header: 'Tipo',
      accessorKey: 'tipo',
      cell: ({ row }) => (
        <span
          className={`capitalize font-semibold ${
            row.original.tipo === 'despesa' ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {row.original.tipo}
        </span>
      ),
    },
    {
      header: 'Descrição',
      accessorKey: 'descricao',
    },
    {
      header: 'Cor',
      accessorKey: 'cor',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: row.original.cor }}
          />
          <span>{row.original.cor}</span>
        </div>
      ),
    },
  ]
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
   
    <div className="p-6">
       <Dialog>
       <DialogTrigger asChild>
        <Button variant="outline"><Plus />Novo</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Cadastro de Categoria</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div className="grid gap-3 mt-3 ">
            <div className="grid gap-3">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleChange("tipo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="despesa">Despesa</SelectItem>
                  <SelectItem value="receita">Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
              />
            </div>

            <div className="grid gap-3 ">
              <Label htmlFor="cor">Cor</Label>
              <Input
                className=""
                type="color"
                id="cor"
                value={formData.cor || '#000000'}
                onChange={(e) => handleChange("cor", e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-3 mt-3 ">
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" >Salvar</Button>
          </DialogFooter>
          </div>
       
        </form>
      </DialogContent>
    </Dialog>
    <h2 className="text-2xl font-bold mb-4">Categorias Cadastradas</h2>
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
