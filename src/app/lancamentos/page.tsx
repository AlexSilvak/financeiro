'use client'


import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select,SelectLabel, SelectTrigger, SelectValue, SelectItem, SelectContent, SelectGroup } from '@/components/ui/select'
import { toast } from "sonner"
import axios from "axios"
import { useEffect, useState } from "react"

interface FormData {
  descricao: string
  forma_de_pagamento: string
  valor: string
  tipo: 'despesa' | 'receita' | ''
  categoria: string
  data_vencimento: string
  data_pagamento: string
  multa: string
  juros: string
}
interface Categoria {
  _id: string
  nome: string
  descricao:string
  
}


export default function FormLancamento() {
   const [data, setData] = useState<Categoria[]>([])
  const [formData, setFormData] = useState<FormData>({
    descricao: '',
    forma_de_pagamento: '',
    valor: '',
    tipo: '',
    categoria: '',
    data_vencimento: '',
    data_pagamento: '',
    multa: '',
    juros: '',
  })

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
      usuario_id: '0', // substitua depois
    }

    const res = await fetch('/api/lancamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    

    if (res.ok) {
      toast.success('Lançamento salvo com sucesso!',{description:formData.descricao})
      setFormData({
        descricao: '',
        forma_de_pagamento: '',
        valor: '',
        tipo: '',
        categoria: '',
        data_vencimento: '',
        data_pagamento: '',
        multa: '',
        juros: '',
      })
    } else {
      toast.error('Erro ao salvar lançamento.')
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/categorias",{params:{usuario_id:'1234567890abcdef'}})
        setData(response.data.categorias) // ✅ agora funciona!
        console.log(response.data.categorias)
      } catch (error) {
        console.error("Erro ao buscar categorias", error)
      }
    }

    fetchData()
  }, [])


 
  return (
    
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl p-4 m-auto">
      
      <div>
        <Label className="p-2">Descrição</Label>
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

      <div>
        <Label className="p-2">Valor</Label>
        <Input name="valor" type="number" value={formData.valor} onChange={handleChange} required />
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
     <>
      <SelectItem value={grup.nome} key={grup._id}>{grup.nome}</SelectItem>
     <SelectLabel  >{grup.descricao}</SelectLabel>
    
     </>
     
      )

    })}
  
  </SelectGroup>
   
  </SelectContent>
 

  
</Select>

      </div>
      
      
      

       
      <div>
        <Label className="p-2">Data de Vencimento</Label>
        <Input name="data_vencimento" type="date" value={formData.data_vencimento} onChange={handleChange} required />
      </div>

      <div>
        <Label className="p-2">Data de Pagamento</Label>
        <Input name="data_pagamento" type="date" value={formData.data_pagamento} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="p-2">Multa</Label>
          <Input name="multa" type="number" value={formData.multa} onChange={handleChange} />
        </div>

        <div>
          <Label className="p-2">Juros</Label>
          <Input name="juros" type="number" value={formData.juros} onChange={handleChange} />
        </div>
      </div>

      <Button type="submit" className="w-full p-2">Salvar Lançamento</Button>
    </form>
  )
}



 