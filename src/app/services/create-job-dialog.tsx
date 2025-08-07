'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useState } from 'react'

export default function CreateJobDialog({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, reset } = useForm()
  const [open, setOpen] = useState(false)

  const onSubmit = async (formData: any) => {
    try {
      let parsedData
      try {
        parsedData = JSON.parse(formData.data)
      } catch (e) {
        toast.error('Dados em JSON inválido.')
        return
      }

      const res = await fetch('/api/services/statementProcessor/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          data: parsedData,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.error || 'Erro ao criar o job')
        return
      }

      toast.success('Job criado com sucesso!')
      reset()
      setOpen(false)
      onSuccess()
    } catch (err) {
      toast.error('Erro ao criar o job')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Criar Job</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register('name')} placeholder="Nome do Job" required />
          <Textarea {...register('data')} placeholder="Dados em JSON" required rows={6} />
          <DialogFooter>
            <Button type="submit">Criar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
