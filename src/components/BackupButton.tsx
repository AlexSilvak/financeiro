'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function BackupButton() {
  const handleBackup = async () => {
    toast.info('Iniciando backup...')
    const res = await fetch('/api/backup',{method:'POST'})
    const data = await res.json()

    if (data.success) {
      toast.success(`Backup salvo em: ${data.path}`)
    } else {
      toast.error(`Erro: ${data.error}`)
    }
  }

  return (
    <Button onClick={handleBackup}>
      Fazer Backup
    </Button>
  )
}
