// src/app/(admin)/services/service-actions.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Service } from './types'
import { toast } from 'sonner'

export function ServiceActions({ service }: { service: Service }) {
  const handleAction = async (action: 'start' | 'restart' | 'stop') => {
    try {
      const method = action === 'start' ? 'POST' : action === 'restart' ? 'PUT' : 'DELETE'
      const res = await fetch('/api/import-service', {
        method,
        body: JSON.stringify({
          statementId: service.statement_id,
          userId: service.user_id,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')

      toast.success(`Serviço ${action} executado com sucesso`)
    } catch (err: any) {
      toast.error(`Erro ao ${action} serviço: ${err.message}`)
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => handleAction('start')}>
        Start
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleAction('restart')}>
        Restart
      </Button>
      <Button variant="destructive" size="sm" onClick={() => handleAction('stop')}>
        Stop
      </Button>
    </div>
  )
}
