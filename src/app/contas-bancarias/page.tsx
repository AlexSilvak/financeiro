'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { columns } from './columns'
import { DataTable } from './data-table'
import Loading from '@/components/Loading'

interface ContaForm {
  descricao: string
  numero_conta: string
  tipo: 'corrente' | 'poupanca' | 'investimento' | 'outro'
  banco_id: string
  saldo_inicial: number
  ativo: boolean
}

interface Banco {
  _id: string
  name: string
  bank_code: string
}

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [contas, setContas] = useState([])
  const [bancos, setBancos] = useState<Banco[]>([])
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState<ContaForm>({
    descricao: '',
    numero_conta: '',
    tipo: 'corrente',
    banco_id: '',
    saldo_inicial: 0,
    ativo: true,
  })

  const fetchContas = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/conta-bancaria')
      setContas(res.data)
    } catch (err) {
      toast.error('Erro ao carregar contas bancárias.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBancos = async () => {
    try {
      const res = await axios.get('/api/bancos')
      setBancos(res.data)
    } catch (err) {
      console.log(err)
      toast.error('Erro ao carregar bancos.',)
    }
  }

  useEffect(() => {
    fetchContas()
    fetchBancos()
  }, [])

  const handleChange = (field: keyof ContaForm, value: string ) => {
    setForm((prev) => ({ 
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/conta-bancaria', form)
      toast.success('Conta bancária cadastrada com sucesso!')
      setOpen(false)
      fetchContas()
      setForm({
        descricao: '',
        numero_conta: '',
        tipo: 'corrente',
        banco_id: '',
        saldo_inicial: 0,
        ativo: true,
      })
    } catch (err) {
      toast.error('Erro ao cadastrar conta.')
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Cadastrar Conta</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Nova Conta Bancária</DialogTitle>
              <DialogDescription>Preencha os dados da conta</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Input
                  value={form.descricao}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>Número da Conta</Label>
                <Input
                  value={form.numero_conta}
                  onChange={(e) => handleChange('numero_conta', e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select
                  value={form.tipo}
                  onValueChange={(value) => handleChange('tipo', value as ContaForm['tipo'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo da conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corrente">Corrente</SelectItem>
                    <SelectItem value="poupanca">Poupança</SelectItem>
                    <SelectItem value="investimento">Investimento</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Banco</Label>
                <Select
                  value={form.banco_id}
                  onValueChange={(value) => handleChange('banco_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {bancos.map((banco) => (
                      <SelectItem key={banco._id} value={banco._id}>
                        {banco.name} ({banco.bank_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Saldo Inicial</Label>
                <Input
                  type="number"
                  value={form.saldo_inicial}
                  onChange={(e) =>
                    handleChange('saldo_inicial', parseFloat(e.target.value))
                  }
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
        <DataTable columns={columns} data={contas} />
        {loading && (
          <div className="flex justify-center mt-4">
            <Loading />
          </div>
        )}
      </div>
    </div>
  )
}
