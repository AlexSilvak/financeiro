'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FormService } from './form-service'
import { Service } from './types'
import { useDeleteService } from '@/hooks/useDeleteService'
import { mutate } from 'swr'

type Props = {
  service: Service
}

export function ServiceActions({ service }: Props) {
  const { trigger: triggerDelete, isMutating } = useDeleteService()

  const handleStart = async () => {
    await handleAction('start')
  }

  const handleRestart = async () => {
    await handleAction('restart')
  }

  const handleStop = async () => {
    await handleAction('stop')
  }

  const handleDelete = async () => {
    try {
      await triggerDelete({ id: service._id })
      toast.success('Serviço deletado com sucesso')
      mutate('/api/services')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleAction = async (action: 'start' | 'restart' | 'stop') => {
    try {
      let url = '/api/services'
      const method = action === 'start' ? 'POST' : action === 'restart' ? 'PUT' : 'DELETE'
      const payload = {
        statementId: service.statement_id,
        userId: service.user_id,
      }

      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      }

      if (method === 'DELETE') {
        url += `?statementId=${encodeURIComponent(payload.statementId)}&userId=${encodeURIComponent(payload.userId)}`
      } else {
        options.body = JSON.stringify(payload)
      }

      const res = await fetch(url, options)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')

      toast.success(`Serviço ${action} executado com sucesso`)
      mutate('/api/services')
    } catch (err: any) {
      toast.error(`Erro ao ${action} serviço: ${err.message}`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <DotsVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleStart}>Iniciar</DropdownMenuItem>
        <DropdownMenuItem onClick={handleRestart}>Reiniciar</DropdownMenuItem>
        <DropdownMenuItem onClick={handleStop}>Parar</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} disabled={isMutating}>
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CreateServiceButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Criar novo serviço</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
        </DialogHeader>
        <FormService onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
