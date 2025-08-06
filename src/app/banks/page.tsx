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

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Banks[]>([])

  const [form, setForm] = useState({
    name: '',
    bank_code: '',
    agency: {
      number: '',
      address: '',
      contact: '',
    },
    address: '',
    contact: '',
    status: 'ativo',
  })

  const [open, setOpen] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/banks')
      setData(res.data)
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

  const handleAgencyChange = (
    field: keyof typeof form.agency,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      agency: {
        ...prev.agency,
        [field]: value,
      },
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
        name: '',
        bank_code: '',
        agency: {
          number: '',
          address: '',
          contact: '',
        },
        address: '',
        contact: '',
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
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bank_code">Código do Banco</Label>
                <Input
                  id="bank_code"
                  value={form.bank_code}
                  onChange={(e) => handleChange('bank_code', e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="agency_number">Número da Agência</Label>
                <Input
                  id="agency_number"
                  value={form.agency.number}
                  onChange={(e) => handleAgencyChange('number', e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="agency_address">Endereço da Agência</Label>
                <Input
                  id="agency_address"
                  value={form.agency.address}
                  onChange={(e) =>
                    handleAgencyChange('address', e.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="agency_contact">Contato da Agência</Label>
                <Input
                  id="agency_contact"
                  value={form.agency.contact}
                  onChange={(e) =>
                    handleAgencyChange('contact', e.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Endereço Geral</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contact">Contato</Label>
                <Input
                  id="contact"
                  value={form.contact}
                  onChange={(e) => handleChange('contact', e.target.value)}
                />
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
