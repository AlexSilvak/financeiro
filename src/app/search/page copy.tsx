'use client'
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { DotsVerticalIcon} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import axios from "axios"

import { Trash2, Pencil ,Printer,CircleDollarSign,Plus } from 'lucide-react';
import { toast } from "sonner"
import { TabsContent } from "@radix-ui/react-tabs"
import { redirect } from "next/dist/server/api-utils"
import { Badge } from "@/components/ui/badge"
import { AlertCircleIcon, BadgeCheckIcon, CheckIcon } from "lucide-react"
type Lancamento = {
  _id: string;
  descricao: string;
  forma_pagamento: string;
  valor: number;
  tipo: string;
  categoria: string;
  data_pagamento:string
  status: "pending" | "processing" | "success" | "failed"
};

export default function search() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [url, setURL] = useState("/api/lancamentos");
  const [_id,setId]=useState([])


   useEffect(()=>{

   const fetchData=async()=>{
  
   try {
    const response = await axios.get(url);
    setLancamentos(response.data.lancamentos); // Depende da estrutura retornada pela API
    console.log(lancamentos)
  } catch (error) {
    console.error('Erro ao consultar os dados na API:', error);
  }
  
   }

   fetchData()
   },[])

   
   
   
   const handleDelete = async (_id: string) => {
    if (!_id) {
      console.log(_id)
      console.warn("ID inválido para exclusão.");
      return;
    }
    
    const confirmado = window.confirm(`Tem certeza que deseja deletar este item? ${_id}`);
    if (!confirmado) return;
  
    try {
      const response = await axios.delete(`/api/lancamentos/${_id}`);
      toast.success('Lançamento deletado com Sucesso!.', response.data)
      
      // TODO: atualizar a lista de lançamentos aqui, se necessário
      window.location.reload()
      
      
    } catch (error) {
      console.error("Erro ao deletar o lançamento:", error);
    }
    
  };
  type ButtonVariant = "default" | "secondary" | "destructive" | "outline" | null | undefined;

  const variant: ButtonVariant = "outline"; // ✅ válido

    return (
   
   

   <Table  className="table-auto">
      
      <TableCaption>page</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="justify-items-center">Descrição</TableHead>
          <TableHead className="items-center">Forma de Pagamento</TableHead>
          <TableHead className="items-center">Valor</TableHead>
          <TableHead className="items-center">Tipo</TableHead>
          <TableHead className="items-center">Categoria</TableHead>
          <TableHead className="items-center">Data Vencimento</TableHead>
          <TableHead className="items-center">Data Pagamento</TableHead>
          <TableHead className="items-center">Status</TableHead>
          <TableHead className="items-center">Multa</TableHead>
          <TableHead className="items-center">Juros</TableHead>
          <TableHead className="items-center">Total Pagar</TableHead>
          <TableHead className="items-center">Oberservações</TableHead>
          <TableHead className="items-center">Recorrente</TableHead>
          <TableHead className="items-center">Titular</TableHead>
          <TableHead className="items-center">Data Criação</TableHead>
          <TableHead className="items-center">UID</TableHead>
          <TableHead className="items-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      {  lancamentos.map((item:any)=>{
        const hoje = new Date();
        const dataFormatada = hoje.toLocaleDateString("pt-BR"); // "18/06/2025"
        item.data_pagamento = dataFormatada;
        item.data_vencimento=dataFormatada;
        item.data_criacao=dataFormatada;
        let  valor_total_pagar=item.valor+item.juros+item.multa
          return (
            <TableBody key={item._id}>
            <TableRow >      
              <TableCell className="justify-items-center">{item.descricao}</TableCell>
              <TableCell className="items-center justify-center">{item.forma_de_pagamento}</TableCell>
              <TableCell className="items-center">R${item.valor}</TableCell>
              <TableCell className="items-center">{item.tipo}</TableCell>
              <TableCell className="items-center">{item.categoria}</TableCell>
              <TableCell className="items-center justify-center">{item.data_vencimento}</TableCell>
              <TableCell className="items-center">{item.data_pagamento}</TableCell>
              <TableCell className="items-center justify-center">{item.status}</TableCell>
              <TableCell className="items-center">R${item.multa}</TableCell>
              <TableCell className="items-center">R${item.juros}</TableCell>
              <TableCell className="items-center justify-center">R${valor_total_pagar}</TableCell>
              <TableCell>{item.observacaoes}</TableCell>
              <TableCell>{item.recorrente}</TableCell>
              <TableCell>{item.usuario_id}</TableCell>
              <TableCell className="items-center">{item.data_criacao}</TableCell>
              <TableCell className="items-center"><Badge variant="outline"className="text-muted-foreground px-1.5 mt-4 m-3"><BadgeCheckIcon className="fill-green-500 dark:fill-green-400" />{item.status}</Badge></TableCell>
              <TableCell onClick={() => setId(item._id)}>{item._id}</TableCell>
              <TableCell><DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                          size="icon"
                        >
                          <DotsVerticalIcon />
                          <p className="sr-only">Open menu</p>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem><Pencil />Editar</DropdownMenuItem>
                        <DropdownMenuItem><CircleDollarSign />Parcial</DropdownMenuItem>
                        <DropdownMenuItem><CircleDollarSign />Total</DropdownMenuItem>
                        <DropdownMenuItem><Plus />Incluir</DropdownMenuItem>
                        <DropdownMenuItem onClick={print} ><Printer />Imprimir</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={()=>handleDelete(item._id)} ><Trash2 />Deletar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu></TableCell>
            </TableRow>
              
          </TableBody>
          )
    
        })
       }
      
    </Table>
  
    

   
    
    )
  }