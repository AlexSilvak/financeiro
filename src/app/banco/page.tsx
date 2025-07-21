'use client'

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
import { columns, Bancos } from "./columns"
import { DataTable } from './data-table'
import { useEffect, useState } from "react"
import axios from "axios"
import Loading from "@/components/Loading";
import { toast } from "sonner"

export default function Page() {
 const [loading,setLoading]=useState(false)
  const [data, setData] = useState<Bancos[]>([])
const [form, setForm] = useState({
  name: '',
  bank_code: '',
  agency: {
    number: '',
    address: '',
    contact: ''
  },
  address: '',
  contact: '',
  status: 'ativo'
})

  const [open, setOpen] = useState(false)

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/bancos')
      setData(res.data)
      console.log(res.data)
    } catch (error) {
      console.error("Erro ao buscar bancos", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/bancos', form)
      toast.success("Categoria deletada com sucesso!")
      await fetchData() // 🔄 auto reload após salvar
      setOpen(false) // fecha o Dialog
      setForm({ 
         name: '',
  bank_code: '',
  agency: {
    number: '',
    address: '',
    contact: ''
  },
  address: '',
  contact: '',
  status: 'ativo' 
}) // limpa
    } catch (err) {
      console.error("Erro ao salvar banco", err)
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Cadastro</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Novo Banco</DialogTitle>
              <DialogDescription>Preencha os dados do banco</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="agency.name">Nome</Label>
                <Input id="nome" name="nome" value={form.name} onChange={handleChange}  />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="agency">Código</Label>
                <Input id="codigo" name="codigo" value={form.bank_code} onChange={handleChange} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="agency.number">Agência</Label>
                <Input id="agencia" name="agencia" value={form.agency} onChange={handleChange} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="agency.address">Endereço</Label>
                <Input id="endereco" name="endereco" value={form.address} onChange={handleChange} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="agency.contact">Contato</Label>
                <Input id="contato" name="contato" value={form.contact} onChange={handleChange} />
              </div>
            </div>
            <div className="mt-5">
                <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DataTable columns={columns} data={data} />
       <div className="text-center mt-50 ">
            {loading && <Loading/>}
          </div>
    </div>
  )
}
