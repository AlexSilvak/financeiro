'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { mutate } from 'swr'

type Props = {
  onSuccess?: () => void
}

export function FormService({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm()

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Erro ao criar serviço')

      toast.success('Serviço criado com sucesso')
      mutate('/api/services')
      reset()
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome do Serviço</Label>
        <Input id="name" {...register('name')} required />
      </div>

      <div>
        <Label htmlFor="statement_id">ID do Extrato</Label>
        <Input id="statement_id" {...register('statement_id')} required />
      </div>

      <div>
        <Label htmlFor="user_id">ID do Usuário</Label>
        <Input id="user_id" {...register('user_id')} required />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Criando...' : 'Criar Serviço'}
      </Button>
    </form>
  )
}
