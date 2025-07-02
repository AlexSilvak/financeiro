"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { DotsVerticalIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { OnlyMobile, OnlyTablet, OnlyDesktop } from "@/components/DeviceVisibility"
import { Trash2, Pencil, Printer, CircleDollarSign, Plus, BadgeCheckIcon } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { useBreakpoint } from "@/hooks/useBreakpoint"

type Lancamento = {
  _id: string
  descricao: string
  forma_pagamento: string
  valor: number
  tipo: string
  categoria: string
  data_pagamento: string
  data_vencimento?: string
  data_criacao?: string
  multa: number
  juros: number
  observacaoes?: string
  recorrente?: string
  usuario_id?: string
  status: "pending" | "processing" | "success" | "failed"
}

export default function SearchPage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [formData,setFormData]= useState<Lancamento[]>([])
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res= await axios.get('/api/lancamentos')
        setLancamentos(res.data )
        
      } catch (error) {
        console.error("Erro ao consultar os dados na API:", error)
      }
    }

    fetchData()
  }, [])
  

   
  const handleDelete = async (_id: string) => {
    if (!_id) return
    const confirmado = window.confirm(`Deseja excluir o item ${_id}?`)
    if (!confirmado) return

    try {
      const response = await axios.delete(`/api/lancamentos/${_id}`)
      toast.success("Lançamento deletado com sucesso!", response.data)
      setFormData((prev) => prev.filter((item) => item._id !== _id))
    } catch (error) {
      console.error("Erro ao deletar o lançamento:", error)
    }
  }
  console.log(formData)
  const renderTableRows = () =>
    lancamentos.map((item) => {
      const formatDate = (data: string | undefined): string => {
        if (!data) return new Date().toLocaleDateString("pt-BR")
        return new Date(data).toLocaleDateString("pt-BR")
      }
      console.log(formData)
      const dataPagamento = formatDate(item.data_pagamento)
      const dataVencimento = formatDate(item.data_vencimento)
      const dataCriacao = formatDate(item.data_criacao)
      const total = item.valor + item.multa + item.juros

      return (
        <TableRow key={item._id}>
          <TableCell>{item.descricao}</TableCell>
          <TableCell>{item.forma_pagamento}</TableCell>
          <TableCell>R${item.valor.toFixed(2)}</TableCell>
          <TableCell>{item.tipo}</TableCell>
          <TableCell>{item.categoria}</TableCell>
          <TableCell>{dataVencimento}</TableCell>
          <TableCell>{dataPagamento}</TableCell>
          <TableCell>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <BadgeCheckIcon className="mr-1 size-4" />
              {item.status}
            </Badge>
          </TableCell>
          <TableCell>R${item.multa.toFixed(2)}</TableCell>
          <TableCell>R${item.juros.toFixed(2)}</TableCell>
          <TableCell>R${total.toFixed(2)}</TableCell>
          <TableCell>{item.observacaoes}</TableCell>
          <TableCell>{item.recorrente}</TableCell>
          <TableCell>{item.usuario_id}</TableCell>
          <TableCell>{dataCriacao}</TableCell>
          <TableCell>{item._id}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8" size="icon">
                  <DotsVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem><Pencil className="mr-2" />Editar</DropdownMenuItem>
                <DropdownMenuItem><CircleDollarSign className="mr-2" />Parcial</DropdownMenuItem>
                <DropdownMenuItem><CircleDollarSign className="mr-2" />Total</DropdownMenuItem>
                <DropdownMenuItem><Plus className="mr-2" />Incluir</DropdownMenuItem>
                <DropdownMenuItem /* onClick={print} */><Printer className="mr-2" />Imprimir</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2" />Deletar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      )
    })

  const TabelaResponsiva = () => (
    <Table className="table-auto text-xs md:text-sm w-full">
    
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead>Pagamento</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Pagamento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Multa</TableHead>
          <TableHead>Juros</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Obs</TableHead>
          <TableHead>Recorrente</TableHead>
          <TableHead>Titular</TableHead>
          <TableHead>Criação</TableHead>
          <TableHead>UID</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{renderTableRows()}</TableBody>
    </Table>
  )

  return (
    <>
      <OnlyMobile><TabelaResponsiva /></OnlyMobile>
      <OnlyTablet><TabelaResponsiva /></OnlyTablet>
      <OnlyDesktop><TabelaResponsiva /></OnlyDesktop>
    </>
  )
}
