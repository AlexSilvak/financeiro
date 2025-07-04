'use client'

import React from "react";
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select,SelectLabel, SelectTrigger, SelectValue, SelectItem, SelectContent, SelectGroup } from '@/components/ui/select'
import { toast } from "sonner"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DotsVerticalIcon } from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash2, Pencil, Printer, Plus } from "lucide-react"



interface FormData {
  _id:string
  descricao: string
  forma_de_pagamento: string
  valor: string
  tipo: 'despesa' | 'receita' | ''
  categoria: string
  data_vencimento: string
  data_pagamento: string
  multa: string
  juros: string
  parcela:string
  
}

interface Categoria {
  _id: string
  nome: string
  descricao:string
  
}
type Lancamento = {
  _id: string
  descricao: string
  forma_de_pagamento: string
  valor: number
  tipo: "despesa" | "receita"
  categoria: string
  data_vencimento: string
  status:string
  juros:string
  multa:string
  parcela:string
}





export default function FormLancamento() {
   const [open, setOpen] = useState(false)
   const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
   const [data, setData] = useState<Categoria[]>([])
   const [formData, setFormData] = useState<FormData>({
    _id:'',
    descricao: '',
    forma_de_pagamento: '',
    valor: '',
    tipo: '',
    categoria: '',
    data_vencimento: '',
    data_pagamento: '',
    multa: '',
    juros: '',
    parcela:'',
  })
  
  
  


  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Tem certeza que deseja deletar esta lançamento?")
    
    toast("Event has been created", {
        description: "Tem certeza que deseja deletar esta lançamento?",
        action: {
          label: "Sim",
          onClick: () => console.log("Undo"),
        },
      })
    
  
    if (!confirm) return
  
    const res = await fetch(`/api/lancamentos/${id}`, {
      method: 'DELETE',
    })
  
    if (res.ok) {
      toast.success("Lançamento deletada com sucesso!")
      
      setData((prev) => prev.filter((cat) => cat._id !== id))
      fetchLancamentos()
    } else {
      toast.error("Erro ao deletar Lançamento.")
    }
  }
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      valor: parseFloat(formData.valor),
      multa: parseFloat(formData.multa) || 0,
      juros: parseFloat(formData.juros) || 0,
      parcela: parseFloat(formData.parcela),
      usuario_id: '0', // substitua depois
    }

    const res = await fetch('/api/lancamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    

    if (res.ok) {
      toast.success('Lançamento salvo com sucesso!')
      
      setFormData({
        _id:'',
        descricao: '',
        forma_de_pagamento: '',
        valor: '',
        tipo: '',
        categoria: '',
        data_vencimento: '',
        data_pagamento: '',
        multa: '',
        juros: '',
        parcela:''
      })
      setOpen(false)
      fetchLancamentos()
    } else {
      toast.error('Erro ao salvar lançamento.')
    }
  }
  // usado para listagem de categoria no dropdown
  useEffect(() => {
    const usuario_id = '1234567890abcdef' // ou pegue do auth/context
  
    fetch(`/api/categorias?usuario_id=${usuario_id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log( res.data)
        if (res.success) setData(res.data)
      })
  }, [])




const fetchLancamentos = async () => {
  const res = await fetch('/api/lancamentos')
  const json = await res.json()
  if (json.lancamentos) setLancamentos(json.lancamentos)
}

useEffect(() => {
  fetchLancamentos()
  
}, [])



  return (
    <div className="p-6">
   
   <div className="grid gap-4 ">
   <Label htmlFor="name-1">Nome:<span className="inline-flex items-center rounded-md bg-gray-50  py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset px-4 p-0 ">Francisco Alex da Silva Queiroz </span> CPF/CNPJ:<span className="inline-flex items-center rounded-md bg-gray-50  py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset px-4 p-0 ">097.732.929-94</span></Label>
   <Label htmlFor="name-1"> </Label>
    
   </div>
   
    <div className="mt-6">
      
  <h2 className="text-lg font-semibold mb-2">Lançamentos</h2>
  
  <div className="flex flex-wrap gap-4 items-center mt-4">
  <Input
    placeholder="🔍 Buscar por nome do backup..."
    
    className="max-w-xs"
  />
  <div className="flex gap-2 items-center">
    <label className="text-sm text-muted-foreground">Início:</label>
    <Input
      type="date"
      
      className="w-fit"
    />
  </div>
  <div className="flex gap-2 items-center">
    <label className="text-sm text-muted-foreground">Fim:</label>
    <Input
      type="date"
     
      className="w-fit"
    />
  </div>
  <div className="flex gap-2 items-center">
  <div className="">
    <Dialog       open={open} onOpenChange={setOpen}>
      
        <DialogTrigger asChild>
          <Button variant="outline"><Plus />Novo Lançamento</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl p-4 m-auto">
          <DialogHeader>
            <DialogTitle>Novo Lançamento</DialogTitle>
           
          </DialogHeader>
         
          <div className="grid gap-4 ">
          <div>
            
        <Label className="p-2 ">Descrição</Label>
        <Input name="descricao" value={formData.descricao} onChange={handleChange} required />
      </div>
            <div>
        <Label className="p-2">Forma de Pagamento</Label>
        <Select value={formData.forma_de_pagamento} onValueChange={(v:string) => handleSelectChange('forma_de_pagamento', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a forma de pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pix">Pix</SelectItem>
            <SelectItem value="boleto">Boleto</SelectItem>
            <SelectItem value="cartao">Cartão</SelectItem>
            <SelectItem value="transferencia">Transferência</SelectItem>
          </SelectContent>
        </Select>
      </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Valor</Label>
              <Input name="valor" type="number" value={formData.valor} onChange={handleChange} required  />
            </div>
            <div>
        <Label className="p-2">Tipo</Label>
        <Select value={formData.tipo} onValueChange={(v: string) => handleSelectChange('tipo', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="despesa">Despesa</SelectItem>
            <SelectItem value="receita">Receita</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>

<Label className="p-2">Categoria</Label>

<Select
value={formData.categoria}
onValueChange={(v: string) => handleSelectChange("categoria", v)}
>
<SelectTrigger className="w-full">
<SelectValue placeholder="Selecione uma categoria" />
</SelectTrigger>

<SelectContent>
<SelectGroup>
{data.map((grup)=>{
return (
<React.Fragment key={grup._id}>
<SelectItem value={grup.nome}>{grup.nome}</SelectItem>
<SelectLabel  >{grup.descricao}</SelectLabel>

</React.Fragment>

)

})}

</SelectGroup>

</SelectContent>

</Select>
</div>
            <div className="grid grid-cols-2 gap-2">
          
           

        <div>
        <Label className="p-1">Data de Vencimento</Label>
        <Input name="data_vencimento" type="date" value={formData.data_vencimento} onChange={handleChange} required />
      </div>

      <div>
        <Label className="p-1">Data de Pagamento</Label>
        <Input name="data_pagamento" type="date" value={formData.data_pagamento} onChange={handleChange} />
      </div>
      <div>
          <Label className="p-1">Multa</Label>
          <Input name="multa" type="number" value={formData.multa} onChange={handleChange} />
        </div>

        <div>
          <Label className="p-1">Juros</Label>
          <Input name="juros" type="number" value={formData.juros} onChange={handleChange} />
        </div>

        <div>
          <Label className="p-1">Parcela</Label>
          <Input name="juros" type="number" value={formData.juros} onChange={handleChange} />
        </div>
      </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salva</Button>
          </DialogFooter>
          </form>
        </DialogContent>
     
    </Dialog>
    </div>
  </div>
</div>
  <div className="rounded-md border mt-2">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Parcela</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Pagamento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Vencimento</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lancamentos.map(l => (
          <TableRow key={l._id}>
            <TableCell>{l.descricao}</TableCell>
            <TableCell>R$ {l.valor.toFixed(2)}</TableCell>
            <TableCell >{l.parcela}</TableCell>
            <TableCell className={l.tipo === "receita" ? "text-green-600" : "text-red-600" }>{l.tipo}</TableCell>
            <TableCell>{l.categoria}</TableCell>
            <TableCell>{l.forma_de_pagamento}</TableCell>
            <TableCell className={l.status === "pago" ? "text-green-600" : "text-red-600" }>{l.status}</TableCell>
            <TableCell>{new Date(l.data_vencimento).toLocaleDateString("pt-BR")}</TableCell>
            <TableCell>
            <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost"><DotsVerticalIcon/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 ml-4" align="center">
      
        <DropdownMenuGroup>
          <DropdownMenuItem><Pencil/>Editar</DropdownMenuItem>
          <DropdownMenuItem><Printer/>Imprimir</DropdownMenuItem>
          
          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(l._id)}>
  <Trash2 className="h-4 w-4" /> Deletar
</DropdownMenuItem>

        </DropdownMenuGroup>
      </DropdownMenuContent>
      </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</div>

    
    </div>
    
  )
}



 