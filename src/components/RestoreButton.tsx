'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function RestoreButton() {
  const handleRestore = async () => {
    toast.info('Restaurando backup...')
    
    const res = await fetch('/api/restore', { method: 'POST' })
    const data = await res.json()

    if (data.success) {
      toast.success(`Backup restaurado de: ${data.path}`)
    } else {
      toast.error(`Erro: ${data.error}`)
    }
  }

  return (
    <Button onClick={handleRestore} variant="secondary">
      Restaurar Backup
    </Button>
  )
}
