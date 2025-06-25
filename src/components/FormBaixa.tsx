'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
import { toast } from 'sonner'

interface Lancamento {
  _id: string
  descricao: string
  valor: number
  data_vencimento: string
}

export   function FormBaixa() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [formData, setFormData] = useState({
    data_pagamento: '',
    valor_total_pago: '',
    multa: '',
    juros: '',
  })

  useEffect(() => {
    const fetchLancamentos = async () => {
      const res = await fetch('/api/lancamentos?status=pendente')
      const data = await res.json()
      setLancamentos(data)
    }
    fetchLancamentos()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleBaixa = async () => {
    if (!selectedId) return toast.error('Selecione um lançamento')
    const res = await fetch(`/api/lancamentos/${selectedId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        valor_total_pago: parseFloat(formData.valor_total_pago),
        multa: parseFloat(formData.multa) || 0,
        juros: parseFloat(formData.juros) || 0,
        status: 'pago',
      }),
    })

    if (res.ok) {
      toast.success('Pagamento registrado com sucesso!')
      setSelectedId('')
      setFormData({ data_pagamento: '', valor_total_pago: '', multa: '', juros: '' })
    } else {
      toast.error('Erro ao registrar baixa')
    }
  }

  return (
    <form className="max-w-xl space-y-4 p-4 m-auto">
      <div>
        <Label className="p-2">Selecionar Lançamento Pendente</Label>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um lançamento" />
          </SelectTrigger>
          <SelectContent>
            
            {Array.isArray(lancamentos) ? lancamentos.map((l) => (
              <SelectItem key={l._id} value={l._id}>
                {l.descricao} - R$ {l.valor.toFixed(2)} - {new Date(l.data_vencimento).toLocaleDateString()}
              </SelectItem>
            )) : (
              <p>Nenhum lançamento encontrado</p>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="p-2">Data de Pagamento</Label>
        <Input type="date" name="data_pagamento" value={formData.data_pagamento} onChange={handleChange} required />
      </div>

      <div>
        <Label className="p-2">Valor Total Pago</Label>
        <Input type="number" name="valor_total_pago" value={formData.valor_total_pago} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="p-2">Multa</Label>
          <Input type="number" name="multa" value={formData.multa} onChange={handleChange} />
        </div>

        <div>
          <Label className="p-2">Juros</Label>
          <Input type="number" name="juros" value={formData.juros} onChange={handleChange} />
        </div>
      </div>

      <Button type="button" className="w-full p-2" onClick={handleBaixa}>
        Confirmar Baixa
      </Button>
    </form>
  )
}
