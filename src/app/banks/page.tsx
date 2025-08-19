'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { columns,  Banks } from './columns'
import { DataTable } from './data-table'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '@/components/Loading'
import { toast } from 'sonner'
import { useId } from 'react'

import { Switch } from '@/components/ui/switch'
export default function Page() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Banks[]>([])
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const toggleSwitch = (value: boolean) => {
    setChecked(value)
    handleChange("status", value ? "ativo" : "inativo")
  }
  const [form, setForm] = useState({
    ispb: '',
    name: '',
    bank_id: '',
    code:'',
    fullName:'',
    status: 'ativo',
  })
   const id = useId()
  

  //const toggleSwitch = () => setChecked(prev => !prev)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await axios.get('https://brasilapi.com.br/api/banks/v1')
      setData(res.data)
      console.log(res.data)
    } catch (error) {
      console.error('Erro ao buscar banks', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }


  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/banks', form)
      toast.success('Banco cadastrado com sucesso!')
      await fetchData()
      setOpen(false)
      // reset
      setForm({
    ispb:'',
    name: '',
    bank_id: '',
    code:'',
    fullName:'',
    status: 'ativo',
      })
    } catch (err) {
      toast.error('Erro ao salvar banco.')
      console.error('Erro ao salvar banco', err)
    }
  }

  return (
    <div className="space-y-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Cadastrar Banco</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Novo Banco</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para criar um novo banco.
              </DialogDescription>
            </DialogHeader>
             
             
            <div className="grid gap-4 py-4">
               <div className="grid gap-2">
                <Label htmlFor="name">ISPB</Label>
                <Input
                  id="name"
                  value={form.ispb}
                  onChange={(e) => handleChange('ispb', e.target.value)}
                />
              </div>



              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="code">Código do Banco</Label>
                <Input
                  id="code"
                  value={form.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                />
              </div>
                 <div className="grid gap-2">
      <Label htmlFor={id}>Status</Label>
      <div className="flex items-center gap-2">
        <span
          className={`cursor-pointer text-sm font-medium ${
            checked ? "text-muted-foreground/70" : ""
          }`}
          onClick={() => toggleSwitch(true)}
        >
          Ativo
        </span>

        <Switch
          id={id}
          checked={checked}
          onCheckedChange={toggleSwitch}
          aria-labelledby={`${id}-yes ${id}-no`}
        />

        <span
          className={`cursor-pointer text-sm font-medium ${
            !checked ? "text-muted-foreground/70" : ""
          }`}
          onClick={() => toggleSwitch(false)}
        >
          Inativo
        </span>
      </div>

              
              </div>

           
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div>
        <DataTable columns={columns} data={data} />
        {loading && (
          <div className="flex justify-center mt-4">
            <Loading />
          </div>
        )}
      </div>
    </div>
  )
}
